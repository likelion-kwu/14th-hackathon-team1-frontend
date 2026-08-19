import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredCallRecords } from '../../utils/callRecordStorage';
import './RecordListPage.css';

// 백엔드 API 연동을 위한 Mock 데이터 구조
const DEFAULT_AUTO_RECORDS = [
  {
    id: 'rec_101',
    category: '수면',
    summary: '7시간 30분 취침, 기상 6시 40분',
    confidence: '확인 필요', // '확인 필요' | '높음' | '보통' | '낮음'
    statusType: 'warning',   // 'warning' | 'high' | 'medium' | 'low'
    date: '2025.07.14'
  },
  {
    id: 'rec_102',
    category: '식사',
    summary: '아침 오트밀, 점심 샐러드 섭취',
    confidence: '높음',
    statusType: 'high',
    date: '2025.07.14'
  },
  {
    id: 'rec_103',
    category: '운동',
    summary: '저녁 30분 걷기',
    confidence: '높음',
    statusType: 'high',
    date: '2025.07.13'
  },
  {
    id: 'rec_104',
    category: '피부',
    summary: '볼 부위 건조함 언급',
    confidence: '보통',
    statusType: 'medium',
    date: '2025.07.13'
  },
  {
    id: 'rec_105',
    category: '수면',
    summary: '늦게 잠들었다고 응답',
    confidence: '확인 필요',
    statusType: 'warning',
    date: '2025.07.12'
  },
  {
    id: 'rec_106',
    category: '식사',
    summary: '저녁 식사 거름',
    confidence: '높음',
    statusType: 'high',
    date: '2025.07.12'
  },
  {
    id: 'rec_107',
    category: '운동',
    summary: '정보 없음 — 확인 필요',
    confidence: '낮음',
    statusType: 'low',
    date: '2025.07.11'
  }
];

const CONFIDENCE_STATUS_TYPE = {
  '높음': 'high',
  '보통': 'medium',
  '낮음': 'low',
  '확인 필요': 'warning'
};

export const RecordListPage = () => {
  const navigate = useNavigate();
  const callRecords = getStoredCallRecords().map((record) => ({
    id: record.id,
    category: record.category,
    summary: record.content,
    confidence: record.confidence,
    statusType: CONFIDENCE_STATUS_TYPE[record.confidence] || 'medium',
    date: record.date,
    question: record.question,
    answer: record.answer
  }));
  const [records, setRecords] = useState([...callRecords, ...DEFAULT_AUTO_RECORDS]);
  const [selectedDate, setSelectedDate] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: 백엔드 API 연동 시 주석 해제 (GET /api/records/auto-list)
    /*
    const fetchAutoRecords = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/records/auto-list?category=${selectedCategory}&date=${selectedDate}`);
        const data = await res.json();
        setRecords(data);
      } catch (error) {
        console.error('자동 기록 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAutoRecords();
    */
  }, [selectedDate, selectedCategory]);

  // 카드 클릭 시 상세 페이지로 이동하며 데이터 전달
  const handleCardClick = (item) => {
    navigate('/record/detail', {
      state: {
        recordId: item.id,
        category: item.category,
        date: item.date,
        summary: item.summary,
        confidence: item.confidence,
        question: item.question,
        answer: item.answer
      }
    });
  };

  // 필터링 적용
  const filteredRecords = records.filter((item) => {
    const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchDate = selectedDate === 'ALL' || item.date === selectedDate;
    return matchCategory && matchDate;
  });

  return (
    <div className="record-list-page-container">
      <main className="record-list-page-content">
        {/* 상단 타이틀 영역 */}
        <section className="record-list-header">
          <h2 className="record-list-title">자동 건강 기록</h2>
          <p className="record-list-desc">
            AI 통화·채팅에서 추출된 기록입니다. 의료 진단이 아닙니다.
          </p>
        </section>

        {/* 필터 선택 드롭다운 영역 */}
        <section className="record-filter-group">
          <div className="filter-select-wrapper">
            <label className="filter-label">날짜</label>
            <select
              className="filter-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="ALL">Select...</option>
              <option value="2025.07.14">2025.07.14</option>
              <option value="2025.07.13">2025.07.13</option>
              <option value="2025.07.12">2025.07.12</option>
              <option value="2025.07.11">2025.07.11</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label className="filter-label">항목</label>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">Select...</option>
              <option value="수면">수면</option>
              <option value="식사">식사</option>
              <option value="운동">운동</option>
              <option value="피부">피부</option>
            </select>
          </div>
        </section>

        {/* 자동 기록 카드 목록 */}
        <section className="auto-record-card-list">
          {filteredRecords.map((item) => (
            <div
              key={item.id}
              className="auto-record-card"
              onClick={() => handleCardClick(item)}
              role="button"
              tabIndex={0}
            >
              <div className="card-top-row">
                <span className="card-category">{item.category}</span>
                <span className={`confidence-badge badge-${item.statusType}`}>
                  {item.confidence}
                </span>
              </div>

              <div className="card-bottom-row">
                <p className="card-summary">{item.summary}</p>
                <span className="card-date">{item.date}</span>
              </div>
            </div>
          ))}

          {filteredRecords.length === 0 && (
            <div className="empty-record-box">
              <p>해당 조건에 일치하는 기록이 없습니다.</p>
            </div>
          )}
        </section>

        {/* 하단 면책 문구 */}
        <p className="record-list-disclaimer">
          기록은 대화 내용을 바탕으로 자동 생성되며 의료적 판단을 포함하지 않습니다.
        </p>
      </main>
    </div>
  );
};