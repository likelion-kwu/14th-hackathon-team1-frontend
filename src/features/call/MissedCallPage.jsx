import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import './MissedCallPage.css';

/* 백엔드 API 미연결 시 사용할 임시 데이터 */
const DEFAULT_MISSED_CALL = {
  missedAt: '2026-01-15 오후 2:30',
  question: '최근 수면 시간은 충분하셨나요? 어제 밤 몇 시에 주무셨는지 알려주세요.'
};

/**
 * 부재중 알림 화면: 받지 못한 AI 안부 전화를 채팅으로 이어가거나 나중으로 미루는 화면
 */
export const MissedCallPage = () => {
  const navigate = useNavigate();
  const data = DEFAULT_MISSED_CALL;

  return (
    <div className="missed-call-content">
      <div className="missed-call-card">
        <p className="missed-call-title">부재중 전화</p>
        <p className="missed-call-time">{data.missedAt}</p>
      </div>

      <div className="missed-call-card">
        <p className="missed-call-title">오늘의 안부 질문</p>
        <p className="missed-call-question">{data.question}</p>
        <p className="missed-call-note">이 질문은 채팅에서 계속할 수 있습니다.</p>
      </div>

      <Button onClick={() => navigate('/call/chat')}>채팅으로 이어가기</Button>
      <Button variant="white" onClick={() => navigate('/call')}>
        나중에 응답
      </Button>
    </div>
  );
};
