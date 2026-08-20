import { Button } from '../../../components/common/Button';
import './Step3.css';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidPhone && isValidNickname) {
      onNext();
    }
  };

  return (
    <div className="step3-container">
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