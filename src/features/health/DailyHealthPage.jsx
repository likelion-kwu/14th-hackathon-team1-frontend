import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import './DailyHealthPage.css';

// 백엔드 API 임시 데이터 구조
const DEFAULT_DAILY_DATA = {
  date: '2025년 1월 15일 (수)',
  summary: {
    sleep: '7시간 20분',
    diet: '3회 기록됨',
    exercise: '30분 산책',
    skin: '건조함 보고됨'
  },
  details: [
    {
      id: 'sleep',
      icon: '🌙',
      title: '수면',
      value: '7시간 20분',
      description: '어젯밤 11시 30분에 취침, 오전 6시 50분 기상',
      source: 'AI 안부 대화에서 확인된 기록'
    },
    {
      id: 'diet',
      icon: '🍽️',
      title: '식사',
      value: '3회',
      description: '아침 죽, 점심 김치찌개, 저녁 샌드위치',
      source: 'AI 안부 대화에서 확인된 기록'
    },
    {
      id: 'exercise',
      icon: '🏃',
      title: '운동',
      value: '30분 산책',
      description: '점심 이후 공원 산책 30분 진행',
      source: 'AI 안부 대화에서 확인된 기록'
    },
    {
      id: 'skin',
      icon: '✨',
      title: '피부',
      value: '건조함',
      description: '오늘 피부가 많이 당기고 건조하다고 전달함',
      source: 'AI 안부 대화에서 확인된 기록'
    }
  ],
  conversationLogs: [
    {
      id: 1,
      title: '오전 안부 전화 · 오전 9:12',
      extractedText: '수면·식사·피부 기록 추출됨',
      confidence: '확신도: 높음'
    },
    {
      id: 2,
      title: '오후 채팅 이어하기 · 오후 1:45',
      extractedText: '운동·식사 기록 추출됨',
      confidence: '확신도: 보통'
    },
    {
      id: 3,
      title: '저녁 안부 전화 · 오후 7:30',
      extractedText: '식사·피부 기록 추출됨',
      confidence: '확신도: 높음'
    }
  ],
  warning: {
    title: '확인 필요 항목',
    description: '저녁 식사 내용이 불명확하게 확인되었습니다. 기록이 정확한지 검토해 주세요.'
  }
};

export const DailyHealthPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(DEFAULT_DAILY_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: 백엔드 API 연동 시 주석 해제 (GET /api/records/daily)
    /*
    const fetchDailyRecord = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/records/daily');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('일간 기록 조회 오류:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDailyRecord();
    */
  }, []);

  return (
    <div className="daily-page-container">
      <main className="daily-page-content">
        {/* 상단 타이틀 및 날짜 */}
        <div className="daily-title-header">
          <h2 className="daily-main-title">오늘의 건강 기록</h2>
          <span className="daily-date-text">{data.date}</span>
        </div>

        {/* 1. 일간 요약 카드 */}
        <section className="daily-summary-card">
          <h3 className="card-sub-title">일간 요약</h3>
          <div className="summary-list">
            <div className="summary-row">
              <span className="summary-label">수면</span>
              <span className="summary-value">{data.summary.sleep}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">식사</span>
              <span className="summary-value">{data.summary.diet}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">운동</span>
              <span className="summary-value">{data.summary.exercise}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">피부</span>
              <span className="summary-value">{data.summary.skin}</span>
            </div>
          </div>
        </section>

        {/* 2. 항목별 기록 리스트 */}
        <section className="daily-section">
          <h3 className="card-sub-title">항목별 기록</h3>
          <div className="category-card-list">
            {data.details.map((item) => (
              <div key={item.id} className="category-item-card">
                <div className="category-item-header">
                  <div className="category-icon-title">
                    <span className="category-icon">{item.icon}</span>
                    <span className="category-title">{item.title}</span>
                  </div>
                  <span className="category-value">{item.value}</span>
                </div>
                <p className="category-desc">{item.description}</p>
                <span className="category-source">{item.source}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 대화 근거 확인 */}
        <section className="daily-section-card">
          <h3 className="card-sub-title">대화 근거 확인</h3>
          <div className="log-card-list">
            {data.conversationLogs.map((log) => (
              <div key={log.id} className="log-item-card">
                <h4 className="log-title">{log.title}</h4>
                <p className="log-extract">{log.extractedText}</p>
                <span className="log-confidence">{log.confidence}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 확인 필요 항목 경고 박스 */}
        {data.warning && (
          <section className="daily-warning-card">
            <div className="warning-header">
              <span className="warning-icon">▲</span>
              <h4 className="warning-title">{data.warning.title}</h4>
            </div>
            <p className="warning-desc">{data.warning.description}</p>
            <div className="warning-btn-wrap">
              <Button variant="white" onClick={() => alert('검토 화면으로 이동')}>
                기록 검토하기
              </Button>
            </div>
          </section>
        )}

        {/* 하단 고지 문구 */}
        <p className="daily-disclaimer">
          이 기록은 AI 안부 대화를 바탕으로 자동 생성되었으며, 의료 진단 서비스가 아닙니다.
        </p>
      </main>
    </div>
  );
};