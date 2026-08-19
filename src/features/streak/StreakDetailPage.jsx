import { Button } from '../../components/common/Button';
import './StreakDetailPage.css';

/* 백엔드 API 미연결 시 사용할 임시 데이터 */
const DEFAULT_WEEKLY_STATUS = [
  { day: '월', answered: true },
  { day: '화', answered: true },
  { day: '수', answered: true },
  { day: '목', answered: true },
  { day: '금', answered: true },
  { day: '토', answered: false },
  { day: '일', answered: false }
];

const STREAK_DAYS = 12;

/**
 * 응답 스트릭 현황 화면: 이번 주 요일별 응답 여부와 스트릭 설명
 */
export const StreakDetailPage = () => {
  return (
    <div className="streak-detail-content">
      <p className="streak-detail-section-title">응답 스트릭</p>
      <div className="streak-detail-count-card">
        <p className="streak-detail-count">{STREAK_DAYS}</p>
        <p className="streak-detail-count-label">일 연속 응답 중</p>
      </div>

      <p className="streak-detail-section-title">이번 주 응답 현황</p>
      <div className="streak-detail-week-row">
        {DEFAULT_WEEKLY_STATUS.map((item) => (
          <div key={item.day} className="streak-detail-day">
            <span className="streak-detail-day-label">{item.day}</span>
            {item.answered ? (
              <span className="streak-detail-check">✓</span>
            ) : (
              <span className="streak-detail-empty" />
            )}
          </div>
        ))}
      </div>

      <div className="streak-detail-info-card">
        <p className="streak-detail-info-title">스트릭 정보</p>
        <p className="streak-detail-info-text">
          스트릭은 AI 안부 전화나 채팅에 연속으로 응답한 일수입니다. 건강 상태를 평가하는 지표가 아니며, 응답 습관의 지속성을 파악하는 데 도움이 됩니다.
        </p>
      </div>

      <Button onClick={() => alert('공유 설정 화면을 준비 중입니다.')}>스트릭 공유 설정</Button>
    </div>
  );
};
