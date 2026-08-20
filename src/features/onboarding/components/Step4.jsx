import { useState, useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import './Step4.css';
import { auth } from '../../../services/firebase/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

/**
 * 온보딩 4단계: 전화번호 인증 화면
* @param {Object} props
 * @param {string} props.phoneNumber - 이전 단계에서 입력받은 전화번호
 * @param {string} props.code - 인증 코드 상태값
 * @param {Function} props.onChangeCode - 인증 코드 변경 핸들러
 * @param {Object} props.confirmationResult - Firebase가 발급한 인증 확인 객체
 * @param {Function} props.onSetConfirmationResult - 재발송 시 새 confirmationResult를 갱신하는 핸들러
 * @param {Function} props.onNext - 인증 성공 후 회원가입 처리 및 다음 단계로 이동
 * @param {Function} props.onBackToPhone - 번호 변경 버튼 클릭 시 Step 3으로 이동
 */
export const Step4 = ({
  phoneNumber,
  code,
  onChangeCode,
  confirmationResult,
  onSetConfirmationResult,
  onNext,
  onBackToPhone,
}) => {
  // 카운트다운 타이머 (3분 = 180초)
  const [timeLeft, setTimeLeft] = useState(180);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 남은 시간 'MM:SS' 포맷 변환
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 인증 코드 숫자 6자리만 입력 제한
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 6) {
      onChangeCode(value);
    }
  };

  // E.164 포맷 변환
  const formatE164 = (phone) => {
    const raw = phone.replace(/[^0-9]/g, '');
    return raw.startsWith('0') ? `+82${raw.slice(1)}` : `+82${raw}`;
  };

  // 인증 코드 재발신
  const handleResend = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg('');

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'resend-recaptcha-container', {
          size: 'invisible',
          callback: () => {},
        });
      }

      const formattedPhone = formatE164(phoneNumber);
      const newConfirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      if (onSetConfirmationResult) {
        onSetConfirmationResult(newConfirmationResult);
      }
      setTimeLeft(180);
      onChangeCode('');
      alert('인증 코드가 재발송되었습니다.');
    } catch (err) {
      console.error('재발송 실패:', err);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      setErrorMsg('인증 코드 재발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증 완료 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6 || timeLeft <= 0 || loading) return;

    setLoading(true);
    setErrorMsg('');

    try {
      if (!confirmationResult) {
        throw new Error('인증 세션이 유효하지 않습니다. 번호 입력을 다시 진행해주세요.');
      }

      // Firebase 인증 코드 확인
      const userCredential = await confirmationResult.confirm(code);
      const user = userCredential.user;

      // 인증 성공 시 Firebase 사용자 정보와 함께 onNext 호출 (회원가입 API 연결 단계로)
      onNext(user);
    } catch (err) {
      console.error('인증 코드 검증 실패:', err);
      setErrorMsg('인증 코드가 올바르지 않거나 만료되었습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isCodeValid = code.length === 6 && timeLeft > 0;

  return (
    <div className="step4-container">
      {/* 1. 상단 타이틀 */}
      <div className="step4-title-group">
        <h2 className="step4-main-title">전화번호 인증</h2>
        <p className="step4-sub-title">등록한 번호로 인증 코드를 발송했습니다</p>
      </div>

      <form onSubmit={handleSubmit} className="step4-form">
        {/* 2. 인증 코드 입력 박스 */}
        <div className="verify-card">
          <label htmlFor="verifyCode" className="verify-label">
            인증 코드 입력
          </label>
          <div className="input-with-timer">
            <input
              id="verifyCode"
              type="text"
              inputMode="numeric"
              className="verify-input"
              placeholder="인증 코드 (숫자 6자리)"
              value={code}
              onChange={handleCodeChange}
              maxLength={6}
              disabled={loading}
              autoFocus
            />
          </div>
          <p className={`timer-text ${timeLeft === 0 ? 'expired' : ''}`}>
            {timeLeft > 0 ? `남은 시간: ${formatTime(timeLeft)}` : '인증 시간이 만료되었습니다.'}
          </p>
        </div>

        {errorMsg && <p className="error-text" style={{ color: 'red', fontSize: '14px' }}>{errorMsg}</p>}

        {/* 3. 인증 코드 재발신 박스 */}
        <div className="resend-card">
          <p className="resend-text">전화를 받지 못하셨나요?</p>
          <Button variant="white" onClick={handleResend} fullWidth={false} className="resend-btn" disabled={loading}>
            인증 코드 재발신
          </Button>
        </div>

        {/* 4. 하단 버튼 영역 */}
        <div className="step4-footer">
          <Button className='verify-btn' type="submit" disabled={!isCodeValid || loading}>
            인증 완료
          </Button>
          <Button className='verify-btn' variant="white" onClick={onBackToPhone} disabled={loading}>
            번호 변경
          </Button>
        </div>
      </form>
    </div>
  );
};