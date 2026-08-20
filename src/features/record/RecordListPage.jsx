import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHealthRecordsRange } from '../../api/healthRecords';
import { getMemberId } from '../../utils/memberSession';
import './RecordListPage.css';

const TYPE_LABELS = {
  SLEEP: '수면',
  MEAL: '식사',
  EXERCISE: '운동',
  SKIN: '피부',
  MOOD: '기분',
  WATER: '수분',
  OTHER: '기타'
};

const confidenceLabel = (record) => {
  if (record.status === 'EXTRACTED') return '확인 필요';
  if (record.confidence >= 0.8) return '높음';
  if (record.confidence >= 0.5) return '보통';
  return '낮음';
};

const confidenceStatusType = (record) => {
  if (record.status === 'EXTRACTED') return 'warning';
  if (record.confidence >= 0.8) return 'high';
  if (record.confidence >= 0.5) return 'medium';
  return 'low';
};

export const RecordListPage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(() => Boolean(getMemberId()));
  const [loadError, setLoadError] = useState(() =>
    getMemberId() ? '' : '회원 정보가 없어요. 온보딩을 먼저 완료해주세요.'
  );

  useEffect(() => {
    const memberId = getMemberId();
    if (!memberId) {
      return;
    }

    // from/to 생략 시 최근 7일 조회 (기간 조회는 백엔드 구현 전이여서 고정)
    getHealthRecordsRange(memberId)
      .then((data) => setRecords(data))
      .catch((error) => {
        //console.error('기간 건강 기록 조회 오류', error);
        setLoadError('건강 기록을 불러오지 못했어요.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleCardClick = (item) => {
    navigate('/record/detail', {
      state: {
        recordId: item.id,
        category: TYPE_LABELS[item.type] || item.type,
        date: item.recordedDate,
        summary: item.summary,
        confidence: confidenceLabel(item),
        evidence: item.evidence,
        status: item.status
      }
    });
  };

  const dateOptions = [...new Set(records.map((r) => r.recordedDate))];

  const filteredRecords = records.filter((item) => {
    const categoryLabel = TYPE_LABELS[item.type] || item.type;
    const matchCategory = selectedCategory === 'ALL' || categoryLabel === selectedCategory;
    const matchDate = selectedDate === 'ALL' || item.recordedDate === selectedDate;
    return matchCategory && matchDate;
  });

  return (
    <div className="record-list-page-container">
      <main className="record-list-page-content">
        <section className="record-list-header">
          <h2 className="record-list-title">자동 건강 기록</h2>
          <p className="record-list-desc">
            AI 통화·채팅에서 추출된 기록입니다. 의료 진단이 아닙니다.
          </p>
        </section>

        <section className="record-filter-group">
          <div className="filter-select-wrapper">
            <label className="filter-label">날짜</label>
            <select
              className="filter-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="ALL">전체</option>
              {dateOptions.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label className="filter-label">항목</label>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">전체</option>
              <option value="수면">수면</option>
              <option value="식사">식사</option>
              <option value="운동">운동</option>
              <option value="피부">피부</option>
            </select>
          </div>
        </section>

        <section className="auto-record-card-list">
          {isLoading && <p className="card-summary">기록을 불러오는 중입니다...</p>}
          {loadError && <p className="card-summary">{loadError}</p>}

          {!isLoading &&
            filteredRecords.map((item) => (
              <div
                key={item.id}
                className="auto-record-card"
                onClick={() => handleCardClick(item)}
                role="button"
                tabIndex={0}
              >
                <div className="card-top-row">
                  <span className="card-category">{TYPE_LABELS[item.type] || item.type}</span>
                  <span className={`confidence-badge badge-${confidenceStatusType(item)}`}>
                    {confidenceLabel(item)}
                  </span>
                </div>

                <div className="card-bottom-row">
                  <p className="card-summary">{item.summary}</p>
                  <span className="card-date">{item.recordedDate}</span>
                </div>
              </div>
            ))}

          {!isLoading && !loadError && filteredRecords.length === 0 && (
            <div className="empty-record-box">
              <p>해당 조건에 일치하는 기록이 없습니다.</p>
            </div>
          )}
        </section>

        <p className="record-list-disclaimer">
          기록은 대화 내용을 바탕으로 자동 생성되며 의료적 판단을 포함하지 않습니다.
        </p>
      </main>
    </div>
  );
};
