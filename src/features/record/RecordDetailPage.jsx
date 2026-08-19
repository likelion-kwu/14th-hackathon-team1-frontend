import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import './RecordDetailPage.css';

// 기본 Mock 데이터 구조
const DEFAULT_DETAIL_DATA = {
  id: 'rec_101',
  title: '수면 기록',
  date: '2025년 1월 14일 (화)',
  summary: {
    category: '수면',
    content: '오후 11시 취침 · 오전 7시 기상 (8시간)',
    recordDate: '2025년 1월 14일',
    confidence: '높음',
    confidenceDesc: '대화 내용이 명확함'
  },
  evidenceList: [
    {
      id: 1,
      tag: '근거 1',
      source: 'AI 안부 전화 · 오전 9:12',
      dialogue: '"어젯밤엔 좀 일찍 주무셨어요?"\n"네, 11시쯤 누웠어요. 오늘 아침엔 7시에 일어났고요."'
    },
    {
      id: 2,
      tag: '근거 2',
      source: 'AI 안부 전화 · 오전 9시 14분',
      dialogue: '"주무실 때 중간에 깨진 않으셨어요?"\n"한 번 정도 깼는데 금방 다시 잠들었어요."'
    },
    {
      id: 3,
      tag: '근거 3',
      source: '채팅 이어하기 · 오전 9시 31분',
      dialogue: '잠에서 깨는 횟수가 1회로 기록되었습니다.\n확인 필요 상태 — 추가 응답 기반'
    }
  ]
};

export const RecordDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 이전 페이지에서 넘어온 파라미터 (없을 경우 기본 Mock 사용)
  const recordState = location.state || {};
  const [data, setData] = useState(DEFAULT_DETAIL_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // 수정 모달 입력 폼 상태
  const [editForm, setEditForm] = useState({
    category: DEFAULT_DETAIL_DATA.summary.category,
    content: DEFAULT_DETAIL_DATA.summary.content,
    memo: ''
  });

  useEffect(() => {
    // TODO: 백엔드 API 연동 (GET /api/records/detail?id=${recordState.recordId})
    const currentCategory = recordState.category || DEFAULT_DETAIL_DATA.summary.category;
    const currentContent = recordState.summary || DEFAULT_DETAIL_DATA.summary.content;
    const currentConfidence = recordState.confidence || DEFAULT_DETAIL_DATA.summary.confidence;

    setData((prev) => ({
      ...prev,
      title: `${currentCategory} 기록`,
      summary: {
        ...prev.summary,
        category: currentCategory,
        content: currentContent,
        confidence: currentConfidence
      }
    }));

    setEditForm({
      category: currentCategory,
      content: currentContent,
      memo: ''
    });
  }, [recordState]);

  // 기록 수정 저장 핸들러
  const handleSaveEdit = async () => {
    try {
      // TODO: 백엔드 API 연동 (PATCH /api/records/${data.id}, { content: editContent })
      console.log('수정된 내용 백엔드 전송:', editForm);

      setData((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          category: editForm.category,
          content: editForm.content,
          memo: editForm.memo
        }
      }));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('기록 수정 오류:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  // 기록 삭제 핸들러
  const handleDeleteRecord = async () => {
    if (window.confirm('정말 이 기록을 삭제하시겠습니까?')) {
      try {
        // TODO: 백엔드 API 연동 (DELETE /api/records/${data.id})
        console.log('기록 삭제 요청 ID:', data.id);
        alert('기록이 삭제되었습니다.');
        navigate('/record/list', { replace: true });
      } catch (error) {
        console.error('기록 삭제 오류:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="detail-loading-box">
        <p>기록 상세 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="record-detail-container">
      <main className="record-detail-content">
        {/* 상단 타이틀 */}
        <section className="detail-header-section">
          <h2 className="detail-main-title">{data.title}</h2>
          <p className="detail-date-text">{data.date}</p>
        </section>

        {/* 1. 기록 요약 카드 */}
        <section className="detail-summary-card">
          <h3 className="card-inner-title">기록 요약</h3>
          
          <div className="summary-info-grid">
            <div className="summary-info-row">
              <span className="info-label">항목</span>
              <span className="info-value">{data.summary.category}</span>
            </div>
            <div className="summary-info-row">
              <span className="info-label">기록 내용</span>
              <span className="info-value content-highlight">{data.summary.content}</span>
            </div>
            <div className="summary-info-row">
              <span className="info-label">기록 날짜</span>
              <span className="info-value">{data.summary.recordDate}</span>
            </div>
            <div className="summary-info-row confidence-row">
              <span className="info-label">추출 확신도</span>
              <div className="confidence-col">
                <span className="confidence-badge-pill">{data.summary.confidence}</span>
                <span className="confidence-sub-text">{data.summary.confidenceDesc}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 대화 근거 카드 리스트 */}
        <section className="detail-evidence-section">
          <h3 className="section-heading-title">대화 근거</h3>

          <div className="evidence-card-list">
            {data.evidenceList.map((item) => (
              <div key={item.id} className="evidence-item-card">
                <div className="evidence-card-header">
                  <span className="evidence-source">{item.source}</span>
                  <span className="evidence-tag">{item.tag}</span>
                </div>
                <p className="evidence-dialogue-text">
                  {item.dialogue.split('\n').map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < item.dialogue.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 면책 안내 문구 */}
        <p className="detail-disclaimer-text">
          이 기록은 AI 안부 대화에서 자동 추출되었습니다.<br />
          의료 진단이 아니며 참고 목적으로만 사용하세요.
        </p>

        {/* 3. 하단 액션 버튼 세트 */}
        <div className="detail-action-buttons">
          <Button variant="black" onClick={() => setIsEditModalOpen(true)}>
            기록 수정
          </Button>
          <Button variant="red" onClick={() => setIsDeleteModalOpen(true)}>
            기록 삭제
          </Button>
        </div>
      </main>

      {/* 4. 기록 수정 모달 */}
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">기록 수정</h3>

            <div className="modal-field-group">
              <label className="modal-field-label">항목</label>
              <select
                className="modal-select"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              >
                <option value="수면">수면</option>
                <option value="식사">식사</option>
                <option value="운동">운동</option>
                <option value="피부">피부</option>
              </select>
            </div>

            <div className="modal-field-group">
              <label className="modal-field-label">기록 내용</label>
              <input
                type="text"
                className="modal-input"
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                placeholder="기록 내용을 입력하세요"
              />
            </div>

            <div className="modal-field-group">
              <label className="modal-field-label">메모 (선택)</label>
              <input
                type="text"
                className="modal-input"
                value={editForm.memo}
                onChange={(e) => setEditForm({ ...editForm, memo: e.target.value })}
                placeholder="추가 메모를 입력하세요"
              />
            </div>

            <p className="modal-notice-text">
              수정된 내용은 대시보드와 생활 패턴 피드백에 반영됩니다.
            </p>

            <div className="modal-actions-row">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => setIsEditModalOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="modal-btn-save"
                onClick={handleSaveEdit}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 기록 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">기록 삭제</h3>
            
            <p className="modal-delete-prompt">
              이 {data.summary.category} 기록을 삭제하시겠습니까?
            </p>

            <p className="modal-delete-desc">
              삭제 후에는 대시보드와 생활 패턴 피드백에서 제외됩니다. 원본 대화 데이터는 데이터 관리 설정에서 별도로 처리할 수 있습니다.
            </p>

            <div className="modal-actions-row">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="modal-btn-delete"
                onClick={handleDeleteRecord}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};