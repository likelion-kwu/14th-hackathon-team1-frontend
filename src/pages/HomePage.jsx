import React, { useState, useEffect } from 'react';
import './HomePage.css';

/* 백엔드 API 미연결 시 사용할 임시 데이터 */
const DEFAULT_DASHBOARD_DATA = {
  userName: '사용자',
  todayStatus: {
    sleep: '7시간 30분',
    diet: '3회',
    exercise: '30분',
    skin: '보통',
    lastCallTime: '오늘 오전 9:02'
  },
  recordsSummary: [
    {
      id: 'daily',
      title: '일간 기록',
      description: '오늘의 기록 확인',
      destination: 'dailyRecords'
    },
    {
      id: 'weekly',
      title: '주간 기록',
      description: '이번 주 건강 흐름 한눈에 보기',
      destination: 'weeklyRecords'
    }
  ],
  weeklyFeedback: {
    summary: '수면 시간이 평균보다 40분 늘었어요.\n식사 규칙성도 꾸준히 유지되고 있습니다.',
    notice: '이 피드백은 의료 진단이 아닙니다.',
    detailDestination: 'feedbackDetail'
  },
  nextCall: {
    scheduledTime: '내일 오전 9:00 예정',
    actionText: '전화 설정',
    destination: 'callSettings'
  },
  shortcuts: [
    { id: 'records', label: '기록 관리', destination: 'records' },
    { id: 'streak', label: '스트릭', destination: 'streak' },
    { id: 'settings', label: '설정', destination: 'settings' }
  ]
};

// 건강 상태 라벨 매핑 테이블
const STATUS_LABEL_MAP = [
  { key: 'sleep', label: '수면' },
  { key: 'diet', label: '식사' },
  { key: 'exercise', label: '운동' },
  { key: 'skin', label: '피부' }
];

/**
 * 홈 대시보드 페이지 컴포넌트
 * @param {Object} props
 * @param {Object} props.userData - 온보딩 또는 전역에서 전달받은 사용자 정보
 * @param {Object} props.dashboardData - 외부(부모/API)에서 주입받는 대시보드 데이터 (없을 경우 내부 mock 또는 fetch 데이터 사용)
 * @param {Function} props.onNavigate - 페이지 또는 탭 이동 핸들러
 */
export const HomePage = ({
  userData,
  dashboardData: initialData,
  onNavigate
}) => {
  // 대시보드 데이터 상태 관리
  const [data, setData] = useState(initialData || DEFAULT_DASHBOARD_DATA);
  const [isLoading, setIsLoading] = useState(!initialData);
  //const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // 부모로부터 dashboardData가 들어오면 바로 상태 업데이트
    if (initialData) {
      setData(initialData);
      setIsLoading(false);
      return;
    }

    // TODO: 백엔드 API 연동 시 아래 패턴 사용 (GET /api/dashboard)
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // const res = await fetch('/api/dashboard');
        // const result = await res.json();
        // setData(result);

        // API 연동 전 임시 데이터 로드 시뮬레이션
        setData(DEFAULT_DASHBOARD_DATA);
      } catch (err) {
        console.error('대시보드 데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [initialData]);

//   const handleTabChange = (tabId) => {
//     setActiveTab(tabId);
//     if (onNavigate) {
//       onNavigate(tabId);
//     }
//   };

  const {
    todayStatus = {},
    recordsSummary = [],
    weeklyFeedback = {},
    nextCall = {},
    shortcuts = []
  } = data;

  if (isLoading) {
    return (
      <div className="home-content-inner">
        <p className="loading-text">대시보드 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="home-page-container">

      {/* 2. 대시보드 본문 스크롤 영역 */}
      <main className="home-page-content">
        {/* 상단 환영 메시지 */}
        <h2 className="home-greeting-title">
          안녕하세요, 오늘도 잘 지내고 계신가요?
        </h2>

        {/* 1. 오늘의 안부 상태 섹션 */}
        <section className="dashboard-card status-card">
          <h3 className="card-header-title">오늘의 안부 상태</h3>

          <div className="status-grid">
            {STATUS_LABEL_MAP.map(({ key, label }) => (
              <div key={key} className="status-item">
                <span className="status-label">{label}</span>
                <span className="status-value">
                  {todayStatus[key] || '-'}
                </span>
              </div>
            ))}
          </div>

          <div className="status-footer">
            <span className="status-time-text">
              마지막 안부 대화: {todayStatus.lastCallTime || '기록 없음'}
            </span>
          </div>
        </section>

        {/* 2. 건강 기록 섹션 */}
        <section className="dashboard-section">
          <h3 className="section-heading">건강 기록</h3>
          {recordsSummary.map((item) => (
            <div
              key={item.id}
              className="record-card"
              onClick={() => onNavigate && onNavigate(item.destination)}
              role="button"
              tabIndex={0}
            >
              <div className="record-card-text">
                <h4 className="record-card-title">{item.title}</h4>
                <p className="record-card-desc">{item.description}</p>
              </div>
              <button
                type="button"
                className="link-text-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate && onNavigate(item.destination);
                }}
              >
                보기
              </button>
            </div>
          ))}
        </section>

        {/* 3. 생활 습관 피드백 섹션 */}
        {weeklyFeedback && (
          <section className="dashboard-section">
            <h3 className="section-heading">생활 습관 피드백</h3>

            <div className="feedback-card">
              <h4 className="feedback-card-title">이번 주 피드백</h4>
              <p className="feedback-paragraph">
                {weeklyFeedback.summary?.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < weeklyFeedback.summary.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
              {weeklyFeedback.notice && (
                <span className="feedback-sub-notice">
                  {weeklyFeedback.notice}
                </span>
              )}

              <button
                type="button"
                className="feedback-link-btn"
                onClick={() =>
                  onNavigate && onNavigate(weeklyFeedback.detailDestination || 'feedbackDetail')
                }
              >
                피드백 자세히 보기
              </button>
            </div>
          </section>
        )}

        {/* 4. AI 안부 전화 섹션 */}
        {nextCall && (
          <section className="dashboard-section">
            <h3 className="section-heading">AI 안부 전화</h3>

            <div className="call-info-card">
              <div className="call-info-text">
                <h4 className="call-info-title">다음 안부 전화</h4>
                <p className="call-info-desc">
                  {nextCall.scheduledTime || '설정된 일정이 없습니다.'}
                </p>
              </div>
              <button
                type="button"
                className="link-text-btn"
                onClick={() => onNavigate && onNavigate(nextCall.destination || 'callSettings')}
              >
                {nextCall.actionText || '설정'}
              </button>
            </div>
          </section>
        )}

        {/* 5. 바로가기 섹션 */}
        {shortcuts.length > 0 && (
          <section className="dashboard-section">
            <h3 className="section-heading">바로가기</h3>

            <div className="shortcut-group">
              {shortcuts.map((shortcut) => (
                <button
                  key={shortcut.id}
                  type="button"
                  className="shortcut-chip-btn"
                  onClick={() => onNavigate && onNavigate(shortcut.destination)}
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};