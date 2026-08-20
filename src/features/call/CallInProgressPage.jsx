import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { getMessages, startConversation, sendMessage, completeConversation } from '../../api/conversations';
import { getMemberId } from '../../utils/memberSession';
import { requestMicrophonePermission } from '../../utils/browserPermissions';
import { ApiError } from '../../api/client';
import logo from '../../assets/images/HEY_onboarding.png'
import './CallInProgressPage.css';

// 브라우저 음성 인식 API (Chrome/Edge는 webkit 접두사, 미지원 브라우저는 null)
const SpeechRecognitionAPI =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

const formatElapsed = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * 통화 진행 화면: AI 안부 전화를 받고 실제 백엔드 대화 API로 이어가는 화면
 * - 통화 받기 시 대화를 시작하고, 브라우저 SpeechSynthesis(TTS)로 AI 발화를 실제 음성 출력
 * - 사용자 답변은 SpeechRecognition(STT)으로 인식해 백엔드로 전송, 돌아온 실제 AI 응답을 다시 음성으로 재생하며 대화를 이어감
 * - 통화를 종료하면 대화가 완료 처리되고, 건강 기록은 서버에서 자동으로 추출됨
 */
export const CallInProgressPage = () => {
  const navigate = useNavigate();
  const [isAnswered, setIsAnswered] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle | connecting | speaking | listening | thinking | completed | error
  const [qnaLog, setQnaLog] = useState([]);
  const [interimText, setInterimText] = useState('');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef(null);
  const conversationRef = useRef(null);

  useEffect(() => {
    if (!isAnswered) return;
    const timer = setInterval(() => setElapsedSec((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isAnswered]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = (text, onEnd) => {
    if (!window.speechSynthesis) {
      onEnd?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1;
    utterance.onstart = () => setCallStatus('speaking');
    utterance.onend = () => onEnd?.();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const listenForAnswer = () => {
    if (!SpeechRecognitionAPI) {
      setErrorMessage('이 브라우저는 음성 인식을 지원하지 않아요. Chrome이나 Edge에서 열어주세요.');
      setCallStatus('error');
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = true;

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += text;
          console.log('[음성 인식 - 최종]', text);
        } else {
          interim += text;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      console.error('[음성 인식 오류]', event.error);
    };

    recognition.onend = async () => {
      setInterimText('');
      const answer = finalTranscript.trim();
      if (!answer) {
        // 인식된 말이 없으면 다시 듣기
        listenForAnswer();
        return;
      }
      await handleUserAnswer(answer);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setCallStatus('listening');
  };

  const handleUserAnswer = async (answerText) => {
    setCallStatus('thinking');
    try {
      const result = await sendMessage(conversationRef.current.id, answerText);
      setQnaLog((prev) => [
        ...prev,
        { role: 'user', text: result.userMessage.content },
        { role: 'assistant', text: result.assistantMessage.content }
      ]);
      speak(result.assistantMessage.content, () => listenForAnswer());
    } catch (error) {
      console.error('메시지 전송 오류', error);
      setErrorMessage('AI 응답을 받아오지 못했어요. 네트워크 상태를 확인하고 다시 시도해주세요.');
      setCallStatus('error');
    }
  };

  const handleAnswer = async () => {
    const memberId = getMemberId();
    if (!memberId) {
      setErrorMessage('먼저 온보딩(회원가입)을 완료해야 통화를 시작할 수 있어요.');
      setCallStatus('error');
      return;
    }

    if (SpeechRecognitionAPI && !(await requestMicrophonePermission())) {
      setErrorMessage('마이크 권한을 허용해야 음성 통화를 시작할 수 있어요. 브라우저 설정에서 마이크를 허용한 뒤 다시 시도해주세요.');
      setCallStatus('error');
      return;
    }

    setCallStatus('connecting');
    try {
      const conversation = await startConversation(memberId, 'CALL');
      const messages = await getMessages(conversation.id);
      conversationRef.current = conversation;
      setIsAnswered(true);
      setElapsedSec(0);

      const transcript = messages
        .filter((message) => message.role === 'USER' || message.role === 'ASSISTANT')
        .map((message) => ({
          role: message.role === 'USER' ? 'user' : 'assistant',
          text: message.content
        }));
      const opening = messages.find((message) => message.role === 'ASSISTANT')?.content
        || '안녕하세요. 오늘 몸과 마음은 어떠신가요?';

      setQnaLog(transcript);
      speak(opening, () => listenForAnswer());
    } catch (error) {
      console.error('대화 시작 오류', error);
      if (error instanceof ApiError && error.code === 'NOT_FOUND') {
        setErrorMessage('회원 정보를 찾을 수 없어요. 온보딩을 다시 진행해주세요.');
      } else {
        setErrorMessage('통화를 시작하지 못했어요. 잠시 후 다시 시도해주세요.');
      }
      setCallStatus('error');
    }
  };

  const handleEndConfirm = async () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setShowEndModal(false);

    if (conversationRef.current) {
      try {
        await completeConversation(conversationRef.current.id);
      } catch (error) {
        console.error('통화 종료 처리 오류', error);
      }
    }
    setCallStatus('completed');
    navigate('/record');
  };

  const statusLabel = {
    idle: '전화가 오고 있습니다',
    connecting: '연결하는 중…',
    speaking: `AI가 말하는 중 · ${formatElapsed(elapsedSec)}`,
    listening: `듣고 있어요 🎙️ · ${formatElapsed(elapsedSec)}`,
    thinking: `AI가 답변을 준비 중… · ${formatElapsed(elapsedSec)}`,
    completed: `통화 종료 · ${formatElapsed(elapsedSec)}`,
    error: '문제가 발생했어요'
  }[callStatus] || (isAnswered ? `통화 중 · ${formatElapsed(elapsedSec)}` : '전화가 오고 있습니다');

  const lastAssistantLine = [...qnaLog].reverse().find((entry) => entry.role === 'assistant');

  return (
    <div className="in-call-content">
      <div className="in-call-profile">
        <div className={`in-call-avatar ${callStatus === 'listening' ? 'in-call-avatar-active' : ''}`}>
          <img className='hey-icon' src={logo}/>
        </div>
        <p className="in-call-name">AI 안부</p>
        <p className="in-call-status">{statusLabel}</p>
      </div>

      <div className="in-call-card">
        <p className="in-call-card-label">AI 안부 질문</p>
        <p className="in-call-question">
          {lastAssistantLine ? lastAssistantLine.text : '통화를 받으면 AI가 먼저 안부를 물어봐요.'}
        </p>
        {!SpeechRecognitionAPI && (
          <p className="in-call-warning">
            이 브라우저는 음성 인식을 지원하지 않아요. Chrome/Edge에서 열어보세요. (음성 출력은 대부분 브라우저에서 동작해요)
          </p>
        )}
        {errorMessage && <p className="in-call-warning">{errorMessage}</p>}
      </div>

      <div className="in-call-card">
        <p className="in-call-card-label">대화 내용 {callStatus === 'listening' && '(실시간 인식 중…)'}</p>
        {qnaLog.length === 0 && !interimText && (
          <>
            <div className="in-call-skeleton-line" style={{ width: '99%' }} />
            <div className="in-call-skeleton-line" style={{ width: '100%' }} />
            <div className="in-call-skeleton-line" style={{ width: '60%' }} />
          </>
        )}
        {qnaLog.map((entry, idx) => (
          <p
            key={idx}
            className={entry.role === 'assistant' ? 'in-call-transcript-question' : 'in-call-transcript-line'}
          >
            {entry.role === 'assistant' ? 'AI: ' : '나: '}
            {entry.text}
          </p>
        ))}
        {interimText && <p className="in-call-transcript-interim">나: {interimText}…</p>}
      </div>

      <p className="in-call-disclaimer">
        이 통화는 건강 기록 자동 생성에 활용될 수 있습니다. 의료 진단이나 치료 처방을 포함하지 않습니다.
        음성 인식 결과는 브라우저 콘솔에서도 확인할 수 있어요.
      </p>

      <div className="in-call-actions">
        <Button onClick={handleAnswer} disabled={isAnswered && callStatus !== 'error'}>
          {isAnswered && callStatus !== 'error' ? '통화 연결됨' : '통화 받기'}
        </Button>
        <Button variant="red" onClick={() => setShowEndModal(true)} disabled={!isAnswered}>
          통화 끊기
        </Button>
      </div>

      <Button className='back-btn' variant="link" onClick={() => navigate('/call')}>
        이전 화면으로 돌아가기
      </Button>

      {showEndModal && (
        <div className="in-call-modal-backdrop">
          <div className="in-call-modal-card">
            <p className="in-call-modal-title">통화를 종료할까요?</p>
            <p className="in-call-modal-desc">대화 내용은 건강 기록으로 자동 저장됩니다.</p>
            <div className="in-call-modal-actions">
              <Button variant="white" fullWidth={false} onClick={() => setShowEndModal(false)}>
                계속 통화
              </Button>
              <Button variant="red" fullWidth={false} onClick={handleEndConfirm}>
                종료
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
