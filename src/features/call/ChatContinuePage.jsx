import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import {
  completeConversation,
  getMessages,
  sendMessage,
  startConversation
} from '../../api/conversations';
import { getMemberId } from '../../utils/memberSession';
import './ChatContinuePage.css';

const toChatMessage = (message) => ({
  id: message.id,
  sender: message.role === 'ASSISTANT' ? '안부' : '나',
  text: message.content,
  role: message.role
});

/**
 * 부재중 전화를 놓쳤을 때 같은 안부 대화를 실제 AI 채팅으로 이어가는 화면입니다.
 */
export const ChatContinuePage = () => {
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadConversation = async () => {
      const memberId = getMemberId();
      if (!memberId) {
        if (isMounted) {
          setErrorMessage('먼저 온보딩을 완료해야 대화를 시작할 수 있어요.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const conversation = await startConversation(memberId, 'CHAT');
        const history = await getMessages(conversation.id);
        if (!isMounted) return;
        setConversationId(conversation.id);
        setMessages(history
          .filter((message) => message.role === 'USER' || message.role === 'ASSISTANT')
          .map(toChatMessage));
      } catch (error) {
        console.error('대화 불러오기 오류', error);
        if (isMounted) {
          setErrorMessage('대화를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadConversation();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !conversationId || isSending) return;

    setIsSending(true);
    setErrorMessage('');
    try {
      const result = await sendMessage(conversationId, content);
      setMessages((previous) => [
        ...previous,
        toChatMessage(result.userMessage),
        toChatMessage(result.assistantMessage)
      ]);
      setDraft('');
    } catch (error) {
      console.error('메시지 전송 오류', error);
      setErrorMessage('메시지를 보내지 못했어요. 네트워크 상태를 확인하고 다시 시도해주세요.');
    } finally {
      setIsSending(false);
    }
  };

  const handleComplete = async () => {
    if (!conversationId || isCompleting) return;

    setIsCompleting(true);
    setErrorMessage('');
    try {
      await completeConversation(conversationId);
      navigate('/record');
    } catch (error) {
      console.error('대화 종료 오류', error);
      setErrorMessage('대화를 종료하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="chat-continue-content">
      <div className="chat-missed-banner">
        <div className="chat-missed-banner-row">
          <span className="chat-missed-icon">📞</span>
          <div className="chat-missed-text">
            <p className="chat-missed-title">오늘의 AI 안부 대화</p>
            <p className="chat-missed-desc">편하게 답하면 AI가 대화를 이어가고 건강 기록을 정리해 드려요.</p>
          </div>
        </div>
        <Button variant="link" onClick={() => navigate('/call/in-progress')}>
          음성 대화로 전환
        </Button>
      </div>

      <p className="chat-section-title">오늘의 안부 대화</p>
      <div className="chat-message-list" aria-live="polite">
        {isLoading && <p className="chat-status-message">대화를 불러오는 중이에요…</p>}
        {!isLoading && messages.map((message) => (
          <div key={message.id} className="chat-message-row">
            <div className="chat-avatar">Aa</div>
            <div className="chat-message-body">
              <p className="chat-message-sender">{message.sender}</p>
              <p className="chat-message-text">{message.text}</p>
            </div>
          </div>
        ))}
        {isSending && <p className="chat-status-message">AI가 답변을 준비하고 있어요…</p>}
      </div>

      {errorMessage && <p className="chat-error-message" role="alert">{errorMessage}</p>}

      <div className="chat-input-group">
        <label className="chat-input-label" htmlFor="chatDraft">
          안부 질문에 답장하기
        </label>
        <textarea
          id="chatDraft"
          className="chat-input-area"
          value={draft}
          maxLength={2000}
          disabled={isLoading || !conversationId || isSending || isCompleting}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
        />
      </div>
      <Button fullWidth={false} onClick={handleSend} disabled={isLoading || !conversationId || isSending || !draft.trim()}>
        {isSending ? '답변 생성 중…' : '전송'}
      </Button>
      <Button variant="white" fullWidth={false} onClick={handleComplete} disabled={isLoading || !conversationId || isCompleting}>
        {isCompleting ? '대화 정리 중…' : '대화 마치기'}
      </Button>
    </div>
  );
};
