import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { getStoredCallRecords } from '../utils/callRecordStorage';
import './RecordPage.css';

// 백엔드 API 연동을 위한 Mock 데이터 구조
const DEFAULT_RECORD_DATA = {
  description: 'AI 안부 전화와 채팅 대화에서 자동으로 추출된 기록입니다.',
  weeklyRecords: [
    {
      id: 'rec_1',
      category: '수면',
      summaryText: '7시간 30분 · 오늘',
      status: 'NORMAL',
      actionText: '근거 확인 →'
    },
    {
      id: 'rec_2',
      category: '식사',
      summaryText: '아침·점심 섭취 · 오늘',
      status: 'NORMAL',
      actionText: '근거 확인 →'
    },
    {
      id: 'rec_3',
      category: '운동',
      summaryText: '걷기 30분 · 어제',
      status: 'NORMAL',
      actionText: '근거 확인 →'
    },
    {
      id: 'rec_4',
      category: '피부',
      summaryText: '건조함 호소 · 2일 전',
      status: 'NORMAL',
      actionText: '근거 확인 →'
    },
    {
      id: 'rec_5',
      category: '수면',
      summaryText: '확인 필요 · 3일 전',
      status: 'NEED_CHECK',
      actionText: '확인 필요 →'
    }
  ],
  guidance: {
    title: '기록 수정 및 삭제 안내',
    content: '기록 내용이 실제와 다를 경우 직접 수정하거나 삭제할 수 있습니다. 수정·삭제된 기록은 대시보드와 생활 패턴 피드백에 반영됩니다.',
    notice: '이 서비스는 의료 진단을 제공하지 않습니다.'
  }
};

export const RecordPage = ({ userData }) => {
  const navigate = useNavigate();
  const callRecords = getStoredCallRecords().map((record) => ({
    id: record.id,
    category: record.category,
    summaryText: `${record.content} · 오늘`,
    status: 'NORMAL',
    actionText: '근거 확인 →',
    question: record.question,
    answer: record.answer,
    confidence: record.confidence
  }));
  const [recordData, setRecordData] = useState({
    ...DEFAULT_RECORD_DATA,
    weeklyRecords: [...callRecords, ...DEFAULT_RECORD_DATA.weeklyRecords]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: 백엔드 API 연동 (GET /api/records/recent-weekly)
    const fetchRecordData = async () => {
      try {
        setIsLoading(true);
        // const res = await fetch('/api/records/recent-weekly');
        // const data = await res.json();
        // setRecordData(data);
      } catch (error) {
        console.error('건강 기록 관리 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordData();
  }, []);

  // 카드 클릭 시 상세 페이지(/record/detail)로 이동하며 recordId 전달
  const handleNavigateToDetail = (recordItem) => {
    navigate('/record/detail', {
      state: {
        recordId: recordItem.id,
        category: recordItem.category,
        question: recordItem.question,
        answer: recordItem.answer,
        confidence: recordItem.confidence
      }
    });
  };

  // 전체 기록 보기 버튼 클릭 시 목록 페이지(/record/list)로 이동
  const handleNavigateToList = () => {
    navigate('/record/list');
  };

  if (isLoading) {
    return (
      <div className="record-loading-box">
        <p>기록을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="record-page-container">
      <main className="record-page-content">
        {/* 상단 타이틀 영역 */}
        <section className="record-header-section">
          <h2 className="record-main-title">건강 기록 관리</h2>
          <p className="record-main-desc">{recordData.description}</p>
        </section>

        {/* 이번 주 기록 카드 목록 */}
        <section className="record-list-section">
          <h3 className="section-title">이번 주 기록</h3>

          <div className="record-card-group">
            {recordData.weeklyRecords.map((item) => {
              const isNeedCheck = item.status === 'NEED_CHECK';
              return (
                <div
                  key={item.id}
                  className={`record-summary-card ${isNeedCheck ? 'need-check' : ''}`}
                  onClick={() => handleNavigateToDetail(item)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-left-info">
                    <h4 className="card-category-name">{item.category}</h4>
                    <p className="card-summary-desc">{item.summaryText}</p>
                  </div>

                  <span className={`card-action-link ${isNeedCheck ? 'highlight' : ''}`}>
                    {item.actionText}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 안내 카드 박스 */}
        <section className="record-info-box">
          <h4 className="info-box-title">{recordData.guidance.title}</h4>
          <p className="info-box-desc">{recordData.guidance.content}</p>
          <span className="info-box-disclaimer">{recordData.guidance.notice}</span>
        </section>

        {/* 전체 기록 보기 버튼 */}
        <div className="record-footer-action">
          <Button variant="black" onClick={handleNavigateToList}>
            전체 기록 보기
          </Button>
        </div>
      </main>
    </div>
  );
};