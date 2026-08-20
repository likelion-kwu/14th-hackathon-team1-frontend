import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import './DataManagementPage.css';

// 백엔드 API 연동용 Mock 데이터 구조
const DEFAULT_DATA_MANAGEMENT = {
  guide: {
    title: '데이터 수집 및 보관 안내',
    items: '통화 녹음·전사, 채팅 대화, 자동 생성 건강 기록',
    period: '마지막 활동일로부터 최대 3년',
    notice: '삭제 요청 후 영업일 기준 7일 이내 처리되며, 처리 완료 시 알림으로 안내됩니다.',
    disclaimer: '이 서비스는 의료 진단 서비스가 아닙니다.'
  },
  storedDataList: [
    {
      id: 'CALL_LOGS',
      title: '통화 기록',
      summary: '총 24건 · 최근 2025년 7월 14일',
      modalMessage: '저장된 통화 녹음 및 전사 기록 전체를 삭제 요청합니다. 처리 후 복구할 수 없습니다.'
    },
    {
      id: 'CHAT_LOGS',
      title: '채팅 대화 기록',
      summary: '총 38건 · 최근 2025년 7월 14일',
      modalMessage: '저장된 AI 채팅 대화 기록 전체를 삭제 요청합니다. 처리 후 복구할 수 없습니다.'
    },
    {
      id: 'HEALTH_LOGS',
      title: '자동 생성 건강 기록',
      summary: '총 61건 · 최근 2025년 7월 14일',
      modalMessage: '대화로부터 자동 생성된 건강 기록 전체를 삭제 요청합니다. 처리 후 복구할 수 없습니다.'
    }
  ],
  deletionStatusList: [
    {
      id: 1,
      title: '통화 기록 삭제 요청',
      date: '2025년 6월 20일',
      statusText: '처리 완료',
      statusType: 'COMPLETED'
    },
    {
      id: 2,
      title: '건강 기록 삭제 요청',
      date: '2025년 7월 2일',
      statusText: '처리 중',
      statusType: 'PENDING'
    }
  ]
};

export const DataManagementPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(DEFAULT_DATA_MANAGEMENT);
  const [selectedTarget, setSelectedTarget] = useState(null); // 삭제 대상 데이터
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: 백엔드 API 연동 (GET /api/users/data-management)
    const fetchDataManagement = async () => {
      try {
        setIsLoading(true);
        // const res = await fetch('/api/users/data-management');
        // const json = await res.json();
        // setData(json);
      } catch (error) {
        //console.error('데이터 열람 정보 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataManagement();
  }, []);

  // 삭제 모달 열기
  const handleOpenDeleteModal = (targetItem) => {
    setSelectedTarget(targetItem);
  };

  // 삭제 요청 확정 처리
  const handleConfirmDeleteRequest = async () => {
    if (!selectedTarget) return;

    try {
      // TODO: 백엔드 API 연동 (POST /api/users/data/delete-request, { type: selectedTarget.id })
      //console.log('삭제 요청 전송 타입:', selectedTarget.id);

      // 삭제 처리 현황에 신규 요청 추가
      const newStatus = {
        id: Date.now(),
        title: `${selectedTarget.title} 삭제 요청`,
        date: '2025년 7월 14일',
        statusText: '처리 중',
        statusType: 'PENDING'
      };

      setData((prev) => ({
        ...prev,
        deletionStatusList: [newStatus, ...prev.deletionStatusList]
      }));

      alert(`${selectedTarget.title} 삭제 요청이 정상적으로 접수되었습니다.`);
      setSelectedTarget(null);
    } catch (error) {
      //console.error('삭제 요청 접수 오류:', error);
      alert('삭제 요청 처리 중 문제가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="data-manage-loading">
        <p>데이터 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="data-manage-container">
      <main className="data-manage-content">
        {/* 상단 타이틀 */}
        <h2 className="data-manage-title">데이터 열람 및 삭제</h2>

        {/* 1. 데이터 수집 및 보관 안내 카드 */}
        <section className="data-guide-card">
          <h3 className="guide-card-title">{data.guide.title}</h3>
          
          <div className="guide-row">
            <span className="guide-label">수집 항목:</span>
            <span className="guide-value">{data.guide.items}</span>
          </div>

          <div className="guide-row">
            <span className="guide-label">보관 기간:</span>
            <span className="guide-value">{data.guide.period}</span>
          </div>

          <p className="guide-notice-text">{data.guide.notice}</p>
          <p className="guide-disclaimer-text">{data.guide.disclaimer}</p>
        </section>

        {/* 2. 보관 중인 데이터 */}
        <section className="data-section-group">
          <h3 className="section-group-title">보관 중인 데이터</h3>

          <div className="stored-card-list">
            {data.storedDataList.map((item) => (
              <div key={item.id} className="stored-data-card">
                <div className="stored-text-col">
                  <h4 className="stored-title">{item.title}</h4>
                  <p className="stored-summary">{item.summary}</p>
                </div>
                <div className="stored-btn-wrapper">
                  <Button
                    variant='red'
                    className="custom-btn-red"
                    onClick={() => handleOpenDeleteModal(item)}
                  >
                    삭제 요청
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 삭제 처리 현황 */}
        <section className="data-section-group">
          <h3 className="section-group-title">삭제 처리 현황</h3>

          <div className="status-card-list">
            {data.deletionStatusList.map((status) => (
              <div key={status.id} className="deletion-status-card">
                <div className="status-text-col">
                  <h4 className="deletion-title">{status.title}</h4>
                  <p className="deletion-date">요청일 {status.date}</p>
                </div>
                <span className={`status-badge ${status.statusType.toLowerCase()}`}>
                  {status.statusText}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 고지 및 뒤로가기 링크 */}
        <p className="data-manage-footer-notice">
          동의 없이 제3자에게 제공되거나 광고에 활용되지 않습니다.
        </p>

        <div className="back-link-box">
          <button
            type="button"
            className="link-btn-back"
            onClick={() => navigate(-1)}
          >
            설정 및 데이터 관리로 돌아가기
          </button>
        </div>
      </main>

      {/* 4. 통화/데이터 기록 삭제 요청 모달 */}
      {selectedTarget && (
        <div className="modal-backdrop" onClick={() => setSelectedTarget(null)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-heading">{selectedTarget.title} 삭제 요청</h3>
            <p className="modal-main-text">{selectedTarget.modalMessage}</p>
            <p className="modal-sub-text">요청 후 영업일 기준 7일 이내에 처리됩니다.</p>

            <div className="modal-action-row">
              <Button
                variant="white"
                fullWidth={false}
                onClick={() => setSelectedTarget(null)}
              >
                취소
              </Button>
              <Button
                variant="red"
                fullWidth={false}
                className="custom-btn-red"
                onClick={handleConfirmDeleteRequest}
              >
                삭제 요청
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};