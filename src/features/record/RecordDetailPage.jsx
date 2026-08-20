import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { confirmHealthRecord } from '../../api/healthRecords';
import './RecordDetailPage.css';

/**
 * 기록 상세 및 근거 화면
 * 백엔드에는 기록 수정/삭제 API가 아직 없어서, 지금은 "기록 확인"(status → CONFIRMED)만 실제로 연결해놓았습니다
 */
export const RecordDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state || {};

  const [status, setStatus] = useState(record.status || 'EXTRACTED');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await confirmHealthRecord(record.recordId);
      setStatus('CONFIRMED');
    } catch (error) {
      //console.error('기록 확인 오류:', error);
      alert('확인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="record-detail-container">
      <main className="record-detail-content">
        <section className="detail-header-section">
          <h2 className="detail-main-title">{record.category} 기록</h2>
          <p className="detail-date-text">{record.date || record.recordedDate}</p>
        </section>

        <section className="detail-summary-card">
          <h3 className="card-inner-title">기록 요약</h3>

          <div className="summary-info-grid">
            <div className="summary-info-row">
              <span className="info-label">항목</span>
              <span className="info-value">{record.category}</span>
            </div>
            <div className="summary-info-row">
              <span className="info-label">기록 내용</span>
              <span className="info-value content-highlight">{record.summary}</span>
            </div>
            <div className="summary-info-row">
              <span className="info-label">기록 날짜</span>
              <span className="info-value">{record.date || record.recordedDate}</span>
            </div>
            <div className="summary-info-row confidence-row">
              <span className="info-label">추출 확신도</span>
              <div className="confidence-col">
                <span className="confidence-badge-pill">{record.confidence}</span>
              </div>
            </div>
            <div className="summary-info-row">
              <span className="info-label">상태</span>
              <span className="info-value">{status === 'CONFIRMED' ? '확인 완료' : '확인 필요'}</span>
            </div>
          </div>
        </section>

        <section className="detail-evidence-section">
          <h3 className="section-heading-title">대화 근거</h3>

          <div className="evidence-card-list">
            <div className="evidence-item-card">
              <p className="evidence-dialogue-text">
                {(record.evidence || '근거 정보가 없어요.').split('\n').map((line, idx, arr) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
        </section>

        <p className="detail-disclaimer-text">
          이 기록은 AI 안부 대화에서 자동 추출되었습니다.<br />
          의료 진단이 아니며 참고 목적으로만 사용하세요.
        </p>

        <div className="detail-action-buttons">
          <Button
            variant="black"
            onClick={handleConfirm}
            disabled={status === 'CONFIRMED' || isConfirming}
          >
            {status === 'CONFIRMED' ? '확인 완료' : isConfirming ? '처리 중…' : '기록 확인'}
          </Button>
          <Button variant="white" fullWidth={false} onClick={() => navigate(-1)}>
            뒤로
          </Button>
        </div>
      </main>
    </div>
  );
};
