import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { getMember, updateNotificationSetting } from '../api/members';
import { getMemberId } from '../utils/memberSession';
import './SettingPage.css';

// 백엔드에 아직 없는 항목(빈도, 동의 세부 항목)을 위한 기본값
const DEFAULT_SETTINGS_DATA = {
  callSettings: {
    availableTime: '설정 안 됨',
    frequency: '주 3회'
  },
  phoneInfo: {
    phoneNumber: '',
    isVerified: true
  },
  agreements: {
    recordAndTranscription: true,
    healthAnalysisAndSave: true
  },
  isCallReceptionActive: true
};

export const SettingPage = ({ userData }) => {
  const navigate = useNavigate();

  // 설정 데이터 상태
  const [settings, setSettings] = useState(DEFAULT_SETTINGS_DATA);
  const [isLoading, setIsLoading] = useState(() => Boolean(getMemberId()));
  const [notifyTime, setNotifyTime] = useState('21:00');

  // 모달 제어 상태
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isStopCallModalOpen, setIsStopCallModalOpen] = useState(false);

  useEffect(() => {
    const memberId = getMemberId();
    if (!memberId) {
      return;
    }

    getMember(memberId)
      .then((member) => {
        setNotifyTime(member.notifyTime?.slice(0, 5) || '21:00');
        setSettings((prev) => ({
          ...prev,
          callSettings: {
            ...prev.callSettings,
            availableTime: member.notifyTime ? `매일 ${member.notifyTime.slice(0, 5)}` : '설정 안 됨'
          },
          phoneInfo: { ...prev.phoneInfo, phoneNumber: member.phone },
          isCallReceptionActive: member.notifyEnabled
        }));
      })
      .catch((error) => console.error('설정 데이터 로드 실패:', error))
      .finally(() => setIsLoading(false));
  }, []);

  // AI 전화 수신 토글 핸들러
  const handleToggleCallReception = async () => {
    const memberId = getMemberId();
    if (!memberId) return;
    const nextState = !settings.isCallReceptionActive;
    setSettings((prev) => ({ ...prev, isCallReceptionActive: nextState }));
    try {
      await updateNotificationSetting(memberId, { notifyTime, notifyEnabled: nextState });
    } catch (error) {
      console.error('알림 설정 변경 오류:', error);
      setSettings((prev) => ({ ...prev, isCallReceptionActive: !nextState }));
    }
  };

  // 1. 동의 철회 확정 핸들러
  const handleConfirmWithdraw = async () => {
    try {
      // TODO: 백엔드 API 연동 (POST /api/users/consent/withdraw)
      console.log('동의 철회 요청 전송');
      alert('동의 철회 요청이 정상적으로 접수되었습니다.');
      setIsWithdrawModalOpen(false);
    } catch (error) {
      console.error('동의 철회 요청 오류:', error);
      alert('요청 처리 중 오류가 발생했습니다.');
    }
  };

  // 2. AI 전화 수신 중단 확정 핸들러
  const handleConfirmStopCall = async () => {
    const memberId = getMemberId();
    try {
      if (memberId) {
        await updateNotificationSetting(memberId, { notifyTime, notifyEnabled: false });
      }
      setSettings((prev) => ({
        ...prev,
        isCallReceptionActive: false
      }));
      alert('AI 전화 수신이 중단되었습니다.');
      setIsStopCallModalOpen(false);
    } catch (error) {
      console.error('수신 중단 처리 오류:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="settings-loading-box">
        <p>설정 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="setting-page-container">
      <main className="setting-page-content">
        {/* 상단 타이틀 */}
        <h2 className="setting-page-title">설정 및 데이터 관리</h2>

        {/* 1. 통화 설정 */}
        <section className="setting-group-section">
          <h3 className="setting-group-title">통화 설정</h3>

          <div className="setting-info-card">
            <div className="card-row-between">
              <span className="info-field-label">통화 가능 시간</span>
            </div>
            <p className="info-field-value">{settings.callSettings.availableTime}</p>

            <span className="info-field-label mt-12">통화 빈도</span>
            <p className="info-field-value">{settings.callSettings.frequency}</p>
          </div>

          <div
            className="setting-nav-card"
            onClick={() => navigate('/settings/call-time')}
            role="button"
            tabIndex={0}
          >
            <span className="nav-card-label">통화 시간 상세 설정</span>
            <span className="nav-arrow">→</span>
          </div>
        </section>

        {/* 2. 전화번호 */}
        <section className="setting-group-section">
          <h3 className="setting-group-title">전화번호</h3>

          <div className="setting-info-card">
            <div className="card-row-between">
              <span className="info-field-label">등록 번호</span>
              {settings.phoneInfo.isVerified && (
                <span className="verified-badge">인증 완료</span>
              )}
            </div>
            <p className="info-field-value">{settings.phoneInfo.phoneNumber || userData?.phoneNumber || '등록된 번호 없음'}</p>

            <div className="card-row-end mt-12">
              <button
                type="button"
                className="link-action-btn underline"
                onClick={() => navigate('/settings/phone')}
              >
                전화번호 변경
              </button>
            </div>
          </div>
        </section>

        {/* 3. 데이터 관리 */}
        <section className="setting-group-section">
          <h3 className="setting-group-title">데이터 관리</h3>

          <div
            className="setting-nav-card double-line"
            onClick={() => navigate('/settings/data-management')}
            role="button"
            tabIndex={0}
          >
            <div className="nav-text-group">
              <span className="nav-main-text">통화·채팅 기록 및 건강 기록 열람</span>
              <span className="nav-sub-text">기록 삭제 요청 및 처리 상태 확인</span>
            </div>
            <span className="nav-arrow">→</span>
          </div>

          <div
            className="setting-nav-card double-line mt-16"
            onClick={() => navigate('/settings/privacy-policy')}
            role="button"
            tabIndex={0}
          >
            <div className="nav-text-group">
              <span className="nav-main-text">개인정보 처리 방침</span>
              <span className="nav-sub-text">수집 목적·보관 기간·삭제 방법 안내</span>
            </div>
            <span className="nav-arrow">→</span>
          </div>
        </section>

        {/* 4. 동의 및 수신 관리 */}
        <section className="setting-group-section">
          <h3 className="setting-group-title">동의 및 수신 관리</h3>

          <div className="setting-info-card">
            <h4 className="card-inner-heading">현재 동의 상태</h4>

            <div className="status-row">
              <span className="status-label">통화 녹음 및 전사</span>
              <span className="status-val">
                {settings.agreements.recordAndTranscription ? '동의함' : '미동의'}
              </span>
            </div>

            <div className="status-row">
              <span className="status-label">건강 정보 분석 및 저장</span>
              <span className="status-val">
                {settings.agreements.healthAnalysisAndSave ? '동의함' : '미동의'}
              </span>
            </div>

            <div className="status-row">
              <span className="status-label">AI 전화 수신</span>
              <div className="toggle-wrapper">
                <span className="toggle-sub-label">AI 전화 수신</span>
                <label className="switch-ui">
                  <input
                    type="checkbox"
                    checked={settings.isCallReceptionActive}
                    onChange={handleToggleCallReception}
                  />
                  <span className="slider-round"></span>
                </label>
              </div>
            </div>
          </div>

          <Button
          className='btn-withdraw'
            variant='red'
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            동의 철회 요청
          </Button>
        </section>

        {/* 5. AI 전화 수신 중단 */}
        <section className="setting-group-section">
          <h3 className="setting-group-title">AI 전화 수신 중단</h3>

          <div className="setting-info-card">
            <p className="notice-line">수신 중단 시 다음 예약 통화부터 발신되지 않습니다.</p>
            <p className="notice-line">언제든지 설정에서 다시 활성화할 수 있습니다.</p>
          </div>

          <Button
            className="btn-stop-call"
            onClick={() => setIsStopCallModalOpen(true)}
          >
            AI 전화 수신 중단
          </Button>
        </section>

        {/* 하단 고지 문구 */}
        <p className="setting-disclaimer">
          이 서비스는 의료 진단을 제공하지 않습니다. 건강 우려 사항은 전문 의료 상담을 받으세요.
        </p>
      </main>

      {/* 모달 1. 동의 철회 확인 모달 */}
      {isWithdrawModalOpen && (
        <div className="modal-overlay" onClick={() => setIsWithdrawModalOpen(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">동의 철회 요청</h3>
            <p className="modal-sub-message">
              동의를 철회하면 AI 안부 전화와 건강 기록 수집이 중단됩니다. 기존에 저장된 데이터는 열람 및 삭제 메뉴에서 관리할 수 있습니다.
            </p>
            <div className="modal-button-group">
              <Button
                variant='white'
                className="modal-btn cancel"
                onClick={() => setIsWithdrawModalOpen(false)}
              >
                취소
              </Button>
              <Button
                variant='red'
                className="modal-btn danger"
                onClick={handleConfirmWithdraw}
              >
                철회 요청
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 모달 2. AI 전화 수신 중단 확인 모달 */}
      {isStopCallModalOpen && (
        <div className="modal-overlay" onClick={() => setIsStopCallModalOpen(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">AI 전화 수신 중단</h3>
            <p className="modal-sub-message">
              다음 예약 통화부터 발신이 중단됩니다. <br/>언제든지 설정에서 다시 켤 수 있습니다.
            </p>
            <div className="modal-button-group">
              <Button
                variant='white'
                className="modal-btn cancel"
                onClick={() => setIsStopCallModalOpen(false)}
              >
                취소
              </Button>
              <Button
                variant='red'
                onClick={handleConfirmStopCall}
              >
                수신 중단
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};