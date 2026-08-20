import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { getTodayHealthRecords } from '../api/healthRecords';
import { getMemberId } from '../utils/memberSession';
import './RecordPage.css';

const TYPE_LABELS = {
  SLEEP: '수면',
  MEAL: '식사',
  EXERCISE: '운동',
  SKIN: '피부',
  MOOD: '기분',
  WATER: '수분',
  OTHER: '기타'
};

const GUIDANCE = {
  title: '기록 확인 안내',
  content: '기록 내용이 실제와 다를 경우 확인 처리를 통해 반영할 수 있습니다.',
  notice: '이 서비스는 의료 진단을 제공하지 않습니다.'
};

export const RecordPage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(() => Boolean(getMemberId()));
  const [loadError, setLoadError] = useState(() =>
    getMemberId() ? '' : '회원 정보가 없어요. 온보딩을 먼저 완료해주세요.'
  );

  useEffect(() => {
    const memberId = getMemberId();
    if (!memberId) {
      return;
    }

    getTodayHealthRecords(memberId)
      .then((data) => setRecords(data))
      .catch((error) => {
        //console.error('오늘의 건강 기록 조회 오류', error);
        setLoadError('건강 기록을 불러오지 못했어요.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleNavigateToDetail = (record) => {
    navigate('/record/detail', {
      state: {
        recordId: record.id,
        category: TYPE_LABELS[record.type] || record.type,
        summary: record.summary,
        confidence: record.confidence,
        evidence: record.evidence,
        recordedDate: record.recordedDate,
        status: record.status
      }
    });
  };

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
        <section className="record-header-section">
          <h2 className="record-main-title">건강 기록 관리</h2>
          <p className="record-main-desc">AI 안부 전화와 채팅 대화에서 자동으로 추출된 기록입니다.</p>
        </section>

        <section className="record-list-section">
          <h3 className="section-title">오늘의 기록</h3>

          {loadError && <p className="card-summary-desc">{loadError}</p>}
          {!loadError && records.length === 0 && (
            <p className="card-summary-desc">오늘 아직 추출된 건강 기록이 없어요.</p>
          )}

          <div className="record-card-group">
            {records.map((item) => {
              const isNeedCheck = item.status === 'EXTRACTED';
              return (
                <div
                  key={item.id}
                  className={`record-summary-card ${isNeedCheck ? 'need-check' : ''}`}
                  onClick={() => handleNavigateToDetail(item)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-left-info">
                    <h4 className="card-category-name">{TYPE_LABELS[item.type] || item.type}</h4>
                    <p className="card-summary-desc">{item.summary}</p>
                  </div>

                  <span className={`card-action-link ${isNeedCheck ? 'highlight' : ''}`}>
                    {isNeedCheck ? '확인 필요 →' : '근거 확인 →'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="record-info-box">
          <h4 className="info-box-title">{GUIDANCE.title}</h4>
          <p className="info-box-desc">{GUIDANCE.content}</p>
          <span className="info-box-disclaimer">{GUIDANCE.notice}</span>
        </section>

        <div className="record-footer-action">
          <Button variant="black" onClick={handleNavigateToList}>
            전체 기록 보기
          </Button>
        </div>
      </main>
    </div>
  );
};
