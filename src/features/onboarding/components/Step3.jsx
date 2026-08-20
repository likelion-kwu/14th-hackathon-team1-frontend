import { useRef, useState } from 'react';
import { Button } from '../../../components/common/Button';
import './Step3.css';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../../services/firebase/firebase';

/**
 * 온보딩 3단계: 전화번호 등록 화면
 * @param {Object} props
 * @param {string} props.phoneNumber - 입력된 전화번호 값
 * @param {Function} props.onChangePhone - 전화번호 변경 핸들러
 * @param {string} props.nickname - 입력된 닉네임 값
 * @param {Function} props.onChangeNickname - 닉네임 변경 핸들러
 * @param {Function} props.onNext - 다음 단계(Step 4: 인증 번호 입력)로 이동하는 함수
 */
export const Step3 = ({ phoneNumber, onChangePhone, nickname, onChangeNickname, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // DOM 직접 참조용 ref
  const recaptchaRef = useRef(null);

  // 010-1234-5678 -> +821012345678 변환 함수
  const formatE164 = (phone) => {
    const raw = phone.replace(/[^0-9]/g, '');
    if (raw.startsWith('0')) {
      return `+82${raw.slice(1)}`;
    }
    return `+82${raw}`;
  };
  
  // 전화번호 입력 시 자동 하이픈(-) 포맷팅 처리
  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 추출
    let formattedValue = rawValue;

    if (rawValue.length > 3 && rawValue.length <= 7) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else if (rawValue.length > 7) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    }

    onChangePhone(formattedValue);
  };

  // 전화번호 11자리(010-0000-0000) 검증 유효성
  const isValidPhone = phoneNumber.replace(/[^0-9]/g, '').length >= 10;
  const isValidNickname = nickname.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPhone || !isValidNickname || loading) return;

    setLoading(true);
    setErrorMsg('');

    try {
      // 기존 verifier 인스턴스가 남아있으면 정리
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      // 1. auth 인스턴스, 2. 컨테이너 (ref.current 또는 'recaptcha-container'), 3. 옵션
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        recaptchaRef.current || 'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            // reCAPTCHA 성공 시 콜백
          },
          'expired-callback': () => {
            setErrorMsg('보안 인증이 만료되었습니다. 다시 시도해주세요.');
          }
        }
      );

      // 명시적으로 렌더링 호출
      await window.recaptchaVerifier.render();

      const formattedPhone = formatE164(phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      onNext(confirmationResult);
    } catch (err) {
      console.error('SMS 발송 실패:', err);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (_) {}
        window.recaptchaVerifier = null;
      }
      
      if (err.code === 'auth/invalid-phone-number') {
        setErrorMsg('유효하지 않은 전화번호 형식입니다.');
      } else if (err.code === 'auth/quota-exceeded') {
        setErrorMsg('SMS 발송 한도를 초과했습니다. 테스트 번호를 사용해주세요.');
      } else {
        setErrorMsg(`인증 오류 (${err.code || 'UNKNOWN'}): 번호 및 설정을 확인해주세요.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step3-container" id="recaptcha-container" ref={recaptchaRef}>
      {/* 1. 상단 타이틀 */}
      <div className="step3-title-group">
        <h2 className="step3-main-title">전화번호 등록</h2>
        <p className="step3-sub-title">안부 전화를 받을 번호를 입력해주세요</p>
      </div>

      {/* 2. 전화번호 입력 폼 */}
      <form onSubmit={handleSubmit} className="step3-form">
        <div className="input-field-group">
          <label htmlFor="nickname" className="input-label">
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            className="phone-input"
            value={nickname}
            onChange={(e) => onChangeNickname(e.target.value)}
            maxLength={50}
            disabled={loading}
          />
        </div>

        <div className="input-field-group">
          <label htmlFor="phoneNumber" className="input-label">
            전화번호
          </label>
          <input
            id="phoneNumber"
            type="tel"
            className="phone-input"
            value={phoneNumber}
            onChange={handleInputChange}
            maxLength={13}
            disabled={loading}
          />
          <span className="input-example">예: 010-0000-0000</span>
        </div>

        {/* 3. 안내 박스 */}
        <div className="step3-info-card">
          <h4 className="info-card-header">안내</h4>
          <p className="info-card-text">
            등록한 번호로 AI 안부 전화를 발신합니다. <br/>인증 절차를 통해 번호 소유를 확인합니다.
          </p>
        </div>

        {errorMsg && <p className="error-text" style={{ color: 'red', fontSize: '14px' }}>{errorMsg}</p>}

        {/* 4. 하단 다음 버튼 */}
        <div className="step3-footer">
          <Button type="submit" disabled={!isValidPhone || !isValidNickname}>
            인증번호 받기
          </Button>
        </div>
      </form>
    </div>
  );
};