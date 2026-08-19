import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { saveCallRecordsFromQna } from '../../utils/callRecordStorage';
import './CallInProgressPage.css';

// AI가 순서대로 묻는 안부 질문 목록 (항목별 하나씩, 답변마다 건강 기록으로 저장됨)
const AI_QUESTIONS = [
  { category: '수면', text: '오늘 잠은 잘 자셨어요? 어제보다 일찍 주무신 것 같던데요.' },
  { category: '식사', text: '식사는 잘 챙겨 드셨나요? 오늘 드신 것들을 편하게 말씀해주세요.' },
  { category: '운동', text: '오늘 몸을 움직이신 게 있으신가요? 산책이나 가벼운 운동도 좋아요.' },
  { category: '피부', text: '요즘 피부 상태는 어떠세요? 건조하거나 트러블 같은 게 있으신가요?' }
];

// 브라우저 음성 인식 API (Chrome/Edge는 webkit 접두사, 미지원 브라우저는 null)
const SpeechRecognitionAPI =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

const formatElapsed = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * 통화 진행 화면: 수신된 AI 안부 전화를 받고, 여러 질문에 순서대로 답하며 대화를 이어가는 화면
 * - 통화 받기 시 브라우저 SpeechSynthesis(TTS)로 AI 질문을 실제로 음성 출력
 * - 질문마다 SpeechRecognition(STT)으로 답변을 인식해 콘솔 로그 + 화면에 실시간 표시
 * - 답변이 끝나면 자동으로 다음 질문으로 이어지고, 마지막 질문까지 끝나면 통화 완료 상태가 됨
 * - 통화를 종료하면 지금까지의 질문/답변이 건강 기록으로 저장되어 기록 탭에 바로 반영됨
 */
export const CallInProgressPage = () => {
  const navigate = useNavigate();
  const [isAnswered, setIsAnswered] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle | speaking | listening | question-done | completed
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [qnaLog, setQnaLog] = useState([]);
  const [interimText, setInterimText] = useState('');
  const [elapsedSec, setElapsedSec] = useState(0);

  const recognitionRef = useRef(null);

  // 통화 연결 후 1초마다 경과 시간 증가 (실제 통화처럼 타이머 표시)
  useEffect(() => {
    if (!isAnswered) return;
    const timer = setInterval(() => setElapsedSec((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isAnswered]);

  // 언마운트 시 진행 중인 음성 인식/합성 정리
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const listenForAnswer = (index) => {
    if (!SpeechRecognitionAPI) {
      console.warn('[통화] 이 브라우저는 SpeechRecognition(음성 인식)을 지원하지 않습니다.');
      setCallStatus('question-done');
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

    recognition.onend = () => {
      setInterimText('');
      const question = AI_QUESTIONS[index];
      const answer = finalTranscript.trim();
      if (answer) {
        setQnaLog((prev) => [...prev, { category: question.category, question: question.text, answer }]);
      }

      const nextIndex = index + 1;
      if (nextIndex < AI_QUESTIONS.length) {
        askQuestion(nextIndex);
      } else {
        setCallStatus('completed');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setCallStatus('listening');
  };

  const askQuestion = (index) => {
    setQuestionIndex(index);
    const question = AI_QUESTIONS[index];

    if (!window.speechSynthesis) {
      console.warn('[통화] 이 브라우저는 SpeechSynthesis(음성 합성)를 지원하지 않습니다.');
      listenForAnswer(index);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(question.text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1;
    utterance.onstart = () => setCallStatus('speaking');
    utterance.onend = () => listenForAnswer(index);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = () => {
    setIsAnswered(true);
    setElapsedSec(0);
    askQuestion(0);
  };

  const handleEndConfirm = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    saveCallRecordsFromQna(qnaLog);
    setShowEndModal(false);
    navigate('/record');
  };

  const currentQuestion = questionIndex >= 0 ? AI_QUESTIONS[questionIndex] : null;

  const statusLabel = {
    idle: '전화가 오고 있습니다',
    speaking: `AI가 말하는 중 · ${formatElapsed(elapsedSec)}`,
    listening: `듣고 있어요 🎙️ · ${formatElapsed(elapsedSec)}`,
    'question-done': `통화 중 · ${formatElapsed(elapsedSec)}`,
    completed: `대화를 모두 마쳤어요 · ${formatElapsed(elapsedSec)}`
  }[callStatus] || (isAnswered ? `통화 중 · ${formatElapsed(elapsedSec)}` : '전화가 오고 있습니다');

  return (
    <div className="in-call-content">
      <div className="in-call-profile">
        <div className={`in-call-avatar ${callStatus === 'listening' ? 'in-call-avatar-active' : ''}`}>Aa</div>
        <p className="in-call-name">AI 안부</p>
        <p className="in-call-status">{statusLabel}</p>
        {isAnswered && callStatus !== 'completed' && (
          <p className="in-call-progress">
            {Math.min(questionIndex + 1, AI_QUESTIONS.length)} / {AI_QUESTIONS.length}번째 질문
          </p>
        )}
      </div>

      <div className="in-call-card">
        <p className="in-call-card-label">AI 안부 질문</p>
        <p className="in-call-question">
          {currentQuestion ? currentQuestion.text : '통화를 받으면 첫 번째 질문을 들려드려요.'}
        </p>
        {!SpeechRecognitionAPI && (
          <p className="in-call-warning">
            이 브라우저는 음성 인식을 지원하지 않아요. Chrome/Edge에서 열어보세요. (음성 출력은 대부분 브라우저에서 동작해요)
          </p>
        )}
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
          <div key={idx} className="in-call-qna-block">
            <p className="in-call-transcript-question">AI: {entry.question}</p>
            <p className="in-call-transcript-line">나: {entry.answer}</p>
          </div>
        ))}
        {interimText && <p className="in-call-transcript-interim">나: {interimText}…</p>}
        {callStatus === 'completed' && (
          <p className="in-call-complete-note">모든 질문에 답해주셨어요. 통화를 끊으면 오늘의 건강 기록으로 저장돼요.</p>
        )}
      </div>

      <p className="in-call-disclaimer">
        이 통화는 건강 기록 자동 생성에 활용될 수 있습니다. 의료 진단이나 치료 처방을 포함하지 않습니다.
        음성 인식 결과는 브라우저 콘솔에서도 확인할 수 있어요.
      </p>

      <div className="in-call-actions">
        <Button onClick={handleAnswer} disabled={isAnswered}>
          {isAnswered ? '통화 연결됨' : '통화 받기'}
        </Button>
        <Button variant="red" onClick={() => setShowEndModal(true)}>
          통화 끊기
        </Button>
      </div>

      <Button variant="link" onClick={() => navigate('/call')}>
        이전 화면으로 돌아가기
      </Button>

      {showEndModal && (
        <div className="in-call-modal-backdrop">
          <div className="in-call-modal-card">
            <p className="in-call-modal-title">통화를 종료할까요?</p>
            <p className="in-call-modal-desc">
              {qnaLog.length > 0
                ? `지금까지 답한 ${qnaLog.length}개 항목이 건강 기록으로 저장됩니다.`
                : '아직 답변한 내용이 없어요. 그래도 종료할까요?'}
            </p>
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
