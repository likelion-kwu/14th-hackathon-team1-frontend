import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodayHealthRecords } from '../api/healthRecords';
import { getMember, getStreak } from '../api/members';
import { getDailySummary } from '../api/summaries';
import { getMemberId } from '../utils/memberSession';
import './HomePage.css';

const STATUS_ITEMS = [
  { type: 'SLEEP', label: '수면' },
  { type: 'MEAL', label: '식사' },
  { type: 'EXERCISE', label: '운동' },
  { type: 'SKIN', label: '피부' }
];

const formatNotifyTime = (notifyTime) => {
  if (!notifyTime) return '통화 시간을 설정해 주세요.';
  return `매일 ${notifyTime.slice(0, 5)} 예정`;
};

const formatLastRecordedAt = (records) => {
  const latest = records
    .map((record) => record.recordedAt)
    .filter(Boolean)
    .sort((left, right) => new Date(right) - new Date(left))[0];

  if (!latest) return '오늘 기록이 아직 없어요.';

  return `마지막 기록 ${new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(latest))}`;
};

export const HomePage = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loadError, setLoadError] = useState(() =>
    getMemberId() ? '' : '회원 정보가 없어요. 온보딩을 먼저 완료해주세요.'
  );

  useEffect(() => {
    const memberId = getMemberId();
    if (!memberId) {
      return;
    }

    let isMounted = true;

    const loadDashboard = async () => {
      const [memberResult, recordsResult, streakResult, summaryResult] = await Promise.allSettled([
        getMember(memberId),
        getTodayHealthRecords(memberId),
        getStreak(memberId),
        getDailySummary(memberId)
      ]);

      if (!isMounted) return;

      if (memberResult.status !== 'fulfilled') {
        setLoadError('홈 데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
        return;
      }

      const records = recordsResult.status === 'fulfilled' ? recordsResult.value : [];
      const streak = streakResult.status === 'fulfilled' ? streakResult.value : null;
      const dailySummary = summaryResult.status === 'fulfilled' ? summaryResult.value : null;

      setDashboard({
        member: memberResult.value,
        records,
        streak,
        dailySummary
      });
    };

    loadDashboard().catch((error) => {
      console.error('홈 데이터 조회 오류', error);
      if (isMounted) {
        setLoadError('홈 데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loadError) {
    return (
      <div className="home-content-inner">
        <p className="loading-text">{loadError}</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="home-content-inner">
        <p className="loading-text">홈 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  const { member, records, streak, dailySummary } = dashboard;
  const recordsByType = new Map(records.map((record) => [record.type, record]));

  return (
    <div className="home-page-container">
      <main className="home-page-content">
        <h2 className="home-greeting-title">
          안녕하세요, {member.nickname}님. <br/>오늘은 어떻게 지내고 계신가요?
        </h2>

        <section className="dashboard-card status-card">
          <h3 className="card-header-title">오늘의 안부 상태</h3>
          <div className="status-grid">
            {STATUS_ITEMS.map(({ type, label }) => (
              <div key={type} className="status-item">
                <span className="status-label">{label}</span>
                <span className="status-value">{recordsByType.get(type)?.summary || '-'}</span>
              </div>
            ))}
          </div>
          <div className="status-footer">
            <span className="status-time-text">{formatLastRecordedAt(records)}</span>
          </div>
        </section>

        <section className="dashboard-section">
          <h3 className="section-heading">건강 기록</h3>
          <div className="record-card" onClick={() => navigate('/record')} role="button" tabIndex={0}>
            <div className="record-card-text">
              <h4 className="record-card-title">오늘 기록</h4>
              <p className="record-card-desc">
                {records.length > 0 ? `오늘 추출된 건강 기록 ${records.length}건` : '오늘 기록이 아직 없어요.'}
              </p>
            </div>
            <button type="button" className="link-text-btn" onClick={() => navigate('/record')}>보기</button>
          </div>
          <div className="record-card" onClick={() => navigate('/streak')} role="button" tabIndex={0}>
            <div className="record-card-text">
              <h4 className="record-card-title">연속 안부</h4>
              <p className="record-card-desc">
                {streak ? `${streak.currentStreak}일째 이어가고 있어요.` : '연속 기록을 불러오지 못했어요.'}
              </p>
            </div>
            <button type="button" className="link-text-btn" onClick={() => navigate('/streak')}>보기</button>
          </div>
        </section>

        {dailySummary && (
          <section className="dashboard-section">
            <h3 className="section-heading">오늘의 AI 요약</h3>
            <div className="feedback-card">
              <p className="feedback-paragraph">{dailySummary.summary}</p>
              <span className="feedback-sub-notice">대화 {dailySummary.conversationCount}건을 바탕으로 생성됐어요.</span>
            </div>
          </section>
        )}

        <section className="dashboard-section">
          <h3 className="section-heading">AI 안부 통화</h3>
          <div className="call-info-card">
            <div className="call-info-text">
              <h4 className="call-info-title">다음 안부 통화</h4>
              <p className="call-info-desc">
                {member.notifyEnabled ? formatNotifyTime(member.notifyTime) : '알림이 꺼져 있어요.'}
              </p>
            </div>
            <button type="button" className="link-text-btn" onClick={() => navigate('/settings/call-time')}>설정</button>
          </div>
        </section>

        <section className="dashboard-section">
          <h3 className="section-heading">바로가기</h3>
          <div className="shortcut-group">
            <button type="button" className="shortcut-chip-btn" onClick={() => navigate('/record')}>기록 관리</button>
            <button type="button" className="shortcut-chip-btn" onClick={() => navigate('/streak')}>스트릭</button>
            <button type="button" className="shortcut-chip-btn" onClick={() => navigate('/settings')}>설정</button>
          </div>
        </section>
      </main>
    </div>
  );
};
