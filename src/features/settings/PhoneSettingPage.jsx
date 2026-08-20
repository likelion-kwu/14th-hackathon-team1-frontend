import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './PhoneSettingPage.css';
import { Button } from '../../components/common/Button';
import { getMember } from '../../api/members';
import { getMemberId } from '../../utils/memberSession';

export const PhoneSettingPage = () => {
  const navigate = useNavigate();
  // MainPage의 Outlet context로부터 userData와 업데이트 함수 수신
  const { userData, onUpdateUserData } = useOutletContext() || {};

  // 현재 등록된 번호 (서버에서 조회, 실패 시 로컬 온보딩 값으로 대체)
  const [currentRegisteredPhone, setCurrentRegisteredPhone] = useState(userData?.phoneNumber || '');

  useEffect(() => {
    const memberId = getMemberId();
    if (!memberId) return;
    getMember(memberId)
      .then((member) => setCurrentRegisteredPhone(member.phone))
      .catch((error) => console.error('회원 정보 조회 오류:', error));
  }, []);

  // 폼 상태 관리
  const [newPhone, setNewPhone] = useState('');
  const [authMethod, setAuthMethod] = useState('SMS'); // 'SMS' | 'VOICE'
  const [authCode, setAuthCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // 전화번호 포맷팅 (-)
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    let formatted = rawValue;
    if (rawValue.length > 3 && rawValue.length <= 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else if (rawValue.length > 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    }
    setNewPhone(formatted);
    setIsVerified(false); // 번호 변경 시 인증 초기화
  };

  // 인증번호 발송 요청
  const handleSendCode = () => {
    const cleanNumber = newPhone.replace(/[^0-9]/g, '');
    if (cleanNumber.length < 10) {
      alert('올바른 전화번호를 입력해 주세요.');
      return;
    }
    // TODO: 백엔드 API 연동 (POST /api/auth/send-code)
    setIsCodeSent(true);
    alert(`${authMethod === 'SMS' ? '문자' : '음성'}로 인증번호가 발송되었습니다.`);
  };

  // 인증번호 검증 확인
  const handleVerifyCode = () => {
    if (authCode.length < 4) {
      alert('인증번호를 올바르게 입력해 주세요.');
      return;
    }
    // TODO: 백엔드 API 연동 (POST /api/auth/verify-code)
    setIsVerified(true);
    alert('전화번호 인증이 완료되었습니다.');
  };

  // 최종 저장 핸들러
  const handleSave = async () => {
    if (!isVerified) {
      alert('새 전화번호 인증을 먼저 완료해 주세요.');
      return;
    }

    try {
      // TODO: 백엔드 API 연동 (PATCH /api/users/phone, { phoneNumber: newPhone })
      console.log('새 전화번호 변경 요청:', newPhone);

      // 상위 전역/부모 상태 업데이트
      if (onUpdateUserData) {
        onUpdateUserData({
          ...userData,
          phoneNumber: newPhone
        });
      }

      alert('전화번호가 성공적으로 변경되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('전화번호 변경 오류:', error);
      alert('전화번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="phone-setting-container">
      <main className="phone-setting-content">
        {/* 상단 타이틀 */}
        <h2 className="phone-setting-title">전화번호 변경</h2>
        <p className="phone-setting-desc">AI 안부 전화를 수신할 번호를 등록하세요.</p>

        {/* 1. 현재 등록된 번호 카드 */}
        <div className="phone-form-block">
          <span className="field-group-label">현재 등록된 번호</span>
          <div className="current-phone-card">
            <div className="phone-info-left">
              <span className="current-phone-text">{currentRegisteredPhone}</span>
              <span className="verified-status-text">인증 완료</span>
            </div>
            <Button
                variant='white'
                onClick={() => document.getElementById('newPhoneInput')?.focus()}
            >
              변경
            </Button>
          </div>
        </div>

        {/* 2. 새 번호 입력 */}
        <div className="phone-form-block">
          <span className="field-group-label">새 번호 입력</span>
          <label className="field-sub-label" htmlFor="newPhoneInput">새 전화번호</label>
          <div className="input-with-button-row">
            <input
              id="newPhoneInput"
              type="tel"
              className="phone-text-input"
              value={newPhone}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              maxLength={13}
            />
          </div>
          <span className="field-sub-guide">
            국가번호 포함 형식으로 입력하세요. (예: +82-10-1234-5678)
          </span>
        </div>

        {/* 3. 인증 방법 선택 칩 */}
        <div className="phone-form-block">
          <label className="field-sub-label">인증 방법 선택</label>
          <div className="auth-chip-group">
            <button
              type="button"
              className={`auth-chip ${authMethod === 'SMS' ? 'active' : ''}`}
              onClick={() => setAuthMethod('SMS')}
            >
              문자 인증
            </button>
            <button
              type="button"
              className={`auth-chip ${authMethod === 'VOICE' ? 'active' : ''}`}
              onClick={() => setAuthMethod('VOICE')}
            >
              음성 인증
            </button>
            <Button
                variant='white'
              className="btn-request-code"
              onClick={handleSendCode}
            >
              인증 요청
            </Button>
          </div>
        </div>

        {/* 4. 인증 안내 박스 */}
        <div className="auth-guide-box">
          <span className="auth-guide-title">인증 안내</span>
          <ul className="auth-guide-list">
            <li>새 번호 입력 후 '인증 요청' 버튼을 클릭하세요</li>
            <li>문자 또는 음성으로 6자리 인증번호를 받을 수 있습니다</li>
            <li>인증이 완료되어야 해당 번호로 AI 전화를 받을 수 있습니다</li>
          </ul>
        </div>

        {/* 5. 인증번호 입력 */}
        <div className="phone-form-block">
          <label className="field-sub-label" htmlFor="authCodeInput">인증번호 입력</label>
          <input
            id="authCodeInput"
            type="text"
            className="phone-text-input"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            placeholder="인증번호 6자리"
            maxLength={6}
          />
          <Button
            className={`btn-verify-submit ${isVerified ? 'verified' : ''}`}
            onClick={handleVerifyCode}
          >
            {isVerified ? '인증 완료됨' : '인증 확인'}
          </Button>
        </div>

        {/* 데이터 보호 안내 문구 */}
        <div className="data-protection-block">
          <span className="protection-title">데이터 보호</span>
          <p className="protection-desc">
            등록된 전화번호와 인증 상태는 암호화되어 보관되며, 동의 없이 제3자와 공유되지 않습니다.
          </p>
        </div>

        {/* 하단 취소/저장 버튼 */}
        <div className="phone-page-actions">
          <Button
            variant='white'
            className="btn-action-cancel"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button
            className="btn-action-save"
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </main>
    </div>
  );
};