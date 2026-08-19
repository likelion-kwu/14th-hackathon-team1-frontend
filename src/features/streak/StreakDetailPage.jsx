import { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { getStreak } from '../../api/members';
import { getMemberId } from '../../utils/memberSession';
import './StreakDetailPage.css';

/**
 * 응답 스트릭 현황 화면: 연속 응답 일수와 최고 기록
 */
export const StreakDetailPage = () => {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    const memberId = getMemberId();
    if (!memberId) return;

    getStreak(memberId)
      .then(setStreak)
      .catch((error) => console.error('스트릭 조회 오류', error));
  }, []);

  return (
    <div className="streak-detail-content">
      <p className="streak-detail-section-title">응답 스트릭</p>
      <div className="streak-detail-count-card">
        <p className="streak-detail-count">{streak ? streak.currentStreak : '–'}</p>
        <p className="streak-detail-count-label">일 연속 응답 중</p>
      </div>

      <p className="streak-detail-section-title">최고 기록</p>
      <div className="streak-detail-count-card">
        <p className="streak-detail-count">{streak ? streak.longestStreak : '–'}</p>
        <p className="streak-detail-count-label">
          {streak?.lastActiveDate ? `마지막 응답: ${streak.lastActiveDate}` : '아직 응답 기록이 없어요'}
        </p>
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
