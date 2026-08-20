import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import './WeeklyHealthPage.css';

const DEFAULT_WEEKLY_DATA = {
  insight: {
    title: '주간 요약 인사이트',
    summary: '이번 주 수면 시간이 지난주보다 평균 40분 늘었어요. 식사 규칙성도 양호합니다.',
    notice: '이 피드백은 의료 진단이 아닙니다.'
  },
  trends: [
    { id: 'sleep', title: '수면', stat: '이번 주 평균 7.2시간', chartPlaceholder: 'Image' },
    { id: 'diet', title: '식사', stat: '규칙적 3회 · 4일', chartPlaceholder: 'Image' },
    { id: 'exercise', title: '운동', stat: '이번 주 3회 확인', chartPlaceholder: 'Image' },
    { id: 'skin', title: '피부', stat: '특이사항 1건', chartPlaceholder: 'Image' }
  ],
  evidenceLogs: [
    { id: 1, title: '수면', date: ' 화요일 대화', quote: '"어젯밤 8시간 정도 잔 것 같아요"' },
    { id: 2, title: '식사', date: ' 목요일 대화', quote: '"점심은 든든하게 먹었어요"' },
    { id: 3, title: '운동', date: ' 수요일 대화', quote: '"오늘 30분 걷기 했어요"' },
    { id: 4, title: '피부', date: ' 금요일 대화', quote: '"볼 쪽이 약간 당기는 느낌이에요"' }
  ],
  feedbackDetail: {
    category: '반복 패턴 분석',
    content: '수면 시간이 주중보다 주말에 1시간 이상 길어지는 패턴이 3주째 지속되고 있습니다.',
    notice: '· 의료 전문가 상담이 필요하다고 느껴지면 가까운 의료기관을 이용해 주세요.'
  }
};

export const WeeklyHealthPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(DEFAULT_WEEKLY_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: 백엔드 API 연동 시 주석 해제 (GET /api/records/weekly)
    /*
    const fetchWeeklyRecord = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/records/weekly');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('주간 기록 조회 오류:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeeklyRecord();
    */
  }, []);

  return (
    <div className="weekly-page-container">
      <main className="weekly-page-content">
        {/* 1. 이번 주 건강 기록 (인사이트) */}
        <section className="weekly-section">
          <h2 className="weekly-main-title">이번 주 건강 기록</h2>
          <div className="insight-card">
            <h4 className="insight-title">{data.insight.title}</h4>
            <p className="insight-summary">{data.insight.summary}</p>
            <span className="insight-notice">{data.insight.notice}</span>
          </div>
        </section>

        {/* 2. 항목별 변화 추이 */}
        <section className="weekly-section">
          <h3 className="weekly-main-title">항목별 변화 추이</h3>
          <div className="trend-card-list">
            {data.trends.map((item) => (
              <div key={item.id} className="trend-card">
                <div className="trend-card-header">
                  <span className="trend-title">{item.title} </span>
                  <span className="trend-stat">{item.stat}</span>
                </div>
                <div className="trend-chart-box">
                  {/* 향후 Recharts 라이브러리 또는 이미지 연동 영역 */}
                  <span className="chart-placeholder">{item.chartPlaceholder}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 근거 기록 */}
        <section className="weekly-section">
          <h3 className="section-title">근거 기록</h3>
          <div className="evidence-list">
            {data.evidenceLogs.map((log) => (
            <div key={log.id} className="evidence-card">
                <div className="evidence-text-group">
                  <h4 className="evidence-title">{log.title}</h4>
                  <p className="evidence-quote">{log.quote}</p>
                </div>
            </div>
            ))}
          </div>
        </section>

        {/* 4. 피드백 상세 */}
        <section className="weekly-section">
          <h3 className="section-title">피드백 상세</h3>
          <div className="feedback-box">
            <span className="feedback-badge">{data.feedbackDetail.category}</span>
            <p className="feedback-content">{data.feedbackDetail.content}</p>
            <span className="feedback-notice">{data.feedbackDetail.notice}</span>
            <div className="feedback-btn-wrap">
              <Button onClick={() => navigate('/feedbackDetail')}>
                피드백 상세 보기
              </Button>
            </div>
          </div>
        </section>

        {/* 이전 화면으로 돌아가기 버튼 */}
        <div className="back-link-wrapper">
          <button type="button" className="text-back-link" onClick={() => navigate(-1)}>
            이전 화면으로 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
};