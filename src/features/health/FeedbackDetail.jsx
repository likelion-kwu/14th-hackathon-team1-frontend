import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedbackDetail.css';

// 백엔드 API 연동을 위한 Mock 데이터 구조
const DEFAULT_FEEDBACK_DATA = {
  period: '2025년 7월 7일 – 13일 · 자동 분석',
  weeklySummary: [
    { label: '수면', value: '평균 6.2시간' },
    { label: '식사', value: '3회/일 규칙적' },
    { label: '운동', value: '4일 기록' },
    { label: '피부', value: '2회 언급' }
  ],
  summaryNotice: '전체 항목이 이번 주 대화에서 자동 수집되었습니다.',
  patterns: [
    {
      id: 'sleep',
      icon: '😴',
      title: '수면 시간이 주중보다 주말에 짧았어요',
      desc: '토·일 평균 5.4시간 → 평일 6.7시간',
      detailLog: '주말 늦은 취침 및 수면 부족 패턴 감지'
    },
    {
      id: 'diet',
      icon: '🥗',
      title: '점심 식사를 거른 날이 3일 확인됐어요',
      desc: '화·수·금 대화에서 언급 됨',
      detailLog: '점심 시간대 식사 미진행 기록'
    },
    {
      id: 'exercise',
      icon: '🏃',
      title: '운동 빈도가 지난주보다 늘었어요',
      desc: '지난주 2일 → 이번 주 4일',
      detailLog: '가벼운 산책 및 유산소 운동 빈도 상승'
    },
    {
      id: 'skin',
      icon: '🌿',
      title: '피부 건조 증상이 두 차례 언급됐어요',
      desc: '걱정되신다면 피부과 상담을 권해드려요',
      detailLog: '대화 중 건조감 및 당김 증상 2회 언급'
    }
  ],
  aiNotice: {
    title: 'AI 분석 안내',
    content: '이 피드백은 대화에서 수집된 생활 정보를 바탕으로 한 비의료적 참고 정보입니다. 의료적 진단이나 치료를 대체하지 않으며, 건강 우려가 있을 경우 전문 의료기관 상담을 권장합니다.'
  }
};

export const FeedbackDetail = ({ feedbackData: initialData }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData || DEFAULT_FEEDBACK_DATA);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setIsLoading(false);
      return;
    }

    // TODO: 백엔드 API 연동 (GET /api/feedback/weekly)
    const fetchFeedbackData = async () => {
      try {
        setIsLoading(true);
        // const res = await fetch('/api/feedback/weekly');
        // const json = await res.json();
        // setData(json);
        setData(DEFAULT_FEEDBACK_DATA);
      } catch (error) {
        console.error('피드백 조회 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbackData();
  }, [initialData]);

  if (isLoading) {
    return (
      <div className="feedback-loading-box">
        <p>피드백을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="feedback-detail-container">
      <main className="feedback-detail-content">
        {/* 상단 타이틀 영역 */}
        <section className="feedback-title-section">
          <h2 className="feedback-main-title">이번 주 생활 습관 피드백</h2>
          <p className="feedback-period-text">{data.period}</p>
        </section>

        {/* 1. 주간 요약 카드 */}
        <section className="feedback-summary-card">
          <h3 className="card-heading-title">주간 요약</h3>
          
          <div className="summary-chip-list">
            {data.weeklySummary.map((item, index) => (
              <div key={index} className="summary-chip-row">
                <span className="summary-chip-label">{item.label}</span>
                <span className="summary-chip-badge">{item.value}</span>
              </div>
            ))}
          </div>

          <p className="summary-footer-notice">{data.summaryNotice}</p>
        </section>

        {/* 2. 반복 패턴 · 변화 추이 리스트 */}
        <section className="feedback-pattern-section">
          <h3 className="section-heading-title">반복 패턴 · 변화 추이</h3>

          <div className="pattern-card-list">
            {data.patterns.map((item) => (
              <div key={item.id} className="pattern-item-card">
                <div className="pattern-card-left">
                  <span className="pattern-icon">{item.icon}</span>
                  <div className="pattern-text-group">
                    <h4 className="pattern-title">{item.title}</h4>
                    <p className="pattern-desc">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. AI 분석 안내 카드 */}
        <section className="ai-notice-card">
          <h4 className="ai-notice-title">{data.aiNotice.title}</h4>
          <p className="ai-notice-content">{data.aiNotice.content}</p>
        </section>
      </main>
    </div>
  );
};