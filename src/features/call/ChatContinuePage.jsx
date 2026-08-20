import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import './ChatContinuePage.css';

/* 백엔드 API 미연결 시 사용할 임시 데이터 */
const DEFAULT_MESSAGES = [
  { id: 1, sender: '안부', text: '오늘 수면은 어떠셨나요? 어제 주무시기 어렵다고 하셨는데 좀 나아지셨어요?' },
  { id: 2, sender: '나', text: '어제보다는 좀 나았어요. 그래도 새벽에 한 번 깼어요.' },
  { id: 3, sender: '안부', text: '그렇군요. 식사는 규칙적으로 하고 계신가요?' },
  { id: 4, sender: '안부', text: '오늘 운동이나 산책은 하셨나요?' }
];

/**
 * 채팅 이어하기 화면: 부재중 전화를 놓쳤을 때 같은 안부 질문을 채팅으로 이어가는 화면
 */
export const ChatContinuePage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: '나', text: draft.trim() }]);
    setDraft('');
  };

  return (
    <div className="chat-continue-content">
      <div className="chat-missed-banner">
        <div className="chat-missed-banner-row">
          <span className="chat-missed-icon">📞</span>
          <div className="chat-missed-text">
            <p className="chat-missed-title">오늘 오전 10:00 안부 전화</p>
            <p className="chat-missed-desc">통화를 놓쳤어요. 채팅으로 이어서 대화해요.</p>
          </div>
        </div>
        <Button variant="link" onClick={() => navigate('/call/in-progress')}>
          통화 화면으로
        </Button>
      </div>

      <p className="chat-section-title">오늘의 안부 대화</p>
      <div className="chat-message-list">
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message-row">
            <div className="chat-avatar">Aa</div>
            <div className="chat-message-body">
              <p className="chat-message-sender">{msg.sender}</p>
              <p className="chat-message-text">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-group">
        <label className="chat-input-label" htmlFor="chatDraft">
          안부 질문에 답장하기
        </label>
        <textarea
          id="chatDraft"
          className="chat-input-area"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      </div>
      <Button fullWidth={false} onClick={handleSend}>
        전송
      </Button>
    </div>
  );
};
