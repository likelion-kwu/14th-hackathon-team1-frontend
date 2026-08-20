import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { getStreak } from '../api/members';
import { getMemberId } from '../utils/memberSession';
import './StreakPage.css';

/**
 * 스트릭 탭 기본 화면: 응답 스트릭 요약 및 친구와 함께 기능
 */
export const StreakPage = () => {
  const navigate = useNavigate();
  const [streakDays, setStreakDays] = useState(null);
  const shareItems = '스트릭, 응답 여부';

  useEffect(() => {
    const memberId = getMemberId();
    if (!memberId) return;

    getStreak(memberId)
      .then((data) => setStreakDays(data.currentStreak))
      .catch((error) => console.error('스트릭 조회 오류', error));
  }, []);

  return (
    <div className="streak-page-content">
      <p className="streak-main-title">소셜 &amp; 스트릭</p>

      <p className="streak-section-title">응답 스트릭</p>
      <button type="button" className="streak-card streak-card-clickable" onClick={() => navigate('/streak/detail')}>
        <div className="streak-card-row">
          <div className="streak-card-text">
            <span className="streak-card-label">연속 응답</span>
            <span className="streak-card-value">
              {streakDays === null ? '불러오는 중…' : `${streakDays}일째 이어가는 중 🔥`}
            </span>
          </div>
          <Button variant="link" onClick={() => navigate('/streak/detail')}>
            자세히 보기
          </Button>
        </div>
        <p className="streak-card-note">오늘 안부에 응답하면 스트릭이 유지돼요</p>
      </button>

      <p className="streak-section-title">친구와 함께</p>
      <div className="streak-card">
        <div className="streak-card-row">
          <div className="streak-card-text">
            <span className="streak-card-label">친구 초대</span>
            <span className="streak-card-sub">신뢰하는 친구에게 초대장을 보내세요</span>
          </div>
          <Button className='streak-invite-btn' onClick={() => navigate('/streak/invite')}>초대하기</Button>
        </div>
      </div>

      <div className="streak-card">
        <div className="streak-card-row">
          <div className="streak-card-text">
            <span className="streak-card-label">안부 공유 설정</span>
            <span className="streak-card-sub">공유 중인 항목: {shareItems}</span>
          </div>
          <Button variant="link" onClick={() => navigate('/streak/friends')}>
            설정
          </Button>
        </div>
        <p className="streak-card-note">통화 내용·건강 상세 기록은 공유되지 않아요</p>
      </div>

      <div className="streak-card">
        <p className="streak-card-note">
          스트릭은 건강 상태의 우수성을 평가하거나 순위를 매기지 않아요. 꾸준히 안부를 나누는 습관 자체를 응원합니다.
        </p>
      </div>

      <Button variant="link" onClick={() => navigate(-1)}>
        이전으로
      </Button>
    </div>
  );
};
