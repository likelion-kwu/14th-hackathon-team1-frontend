import { Button } from '../../../components/common/Button';
import './Step5.css';

/**
 * 온보딩 5단계: 개인정보 동의 화면
 * @param {Object} props
 * @param {Object} props.agreements - 동의 항목별 boolean 상태 객체
 * @param {Function} props.onChangeAgreements - 동의 항목 변경 핸들러
 * @param {Function} props.onNext - [통화 설정으로 이동] 버튼 클릭 시 Step 6으로 이동
 * @param {Function} props.onSkipToHome - [홈_대시보드로 이동] 클릭 시 바로 메인 화면 이동
 */

export const Step5 = ({
  agreements,
  onChangeAgreements,
  onNext,
  onSkipToHome
}) => {
  // 개별 체크박스 토글
  const handleToggle = (key) => {
    onChangeAgreements({
      ...agreements,
      [key]: !agreements[key]
    });
  };

  // 모두 동의하기 토글
  const handleAllAgree = () => {
    const allChecked = agreements.record && agreements.extract && agreements.save && agreements.share;
    const nextState = !allChecked;

    onChangeAgreements({
      record: nextState,
      extract: nextState,
      save: nextState,
      share: nextState
    });
  };

  // 필수 항목 3가지 동의 여부 검증
  const isRequiredAgreed = agreements.record && agreements.extract && agreements.save;

  return (
    <div className="step5-container">
      {/* 1. 상단 타이틀 */}
      <div className="step5-title-group">
        <h2 className="step5-main-title">개인정보 동의</h2>
        <p className="step5-sub-title">
          안부는 의료 진단 서비스가 아닙니다. <br/>아래 정보는 생활 습관 기록과 안부 대화에 활용됩니다.
        </p>
      </div>

      {/* 2. 수집 목적 및 이용 안내 카드 세트 */}
      <div className="info-guide-group">
        <h3 className="section-title">수집 목적 및 이용 안내</h3>

        <div className="guide-card">
          <h4 className="guide-card-label">수집 항목</h4>
          <p className="guide-card-content">
            통화 음성, 채팅 내용, 자동 추출된 수면·식사·운동·피부 기록
          </p>
        </div>

        <div className="guide-card">
          <h4 className="guide-card-label">이용 목적</h4>
          <p className="guide-card-content">
            AI 안부 대화 개선, 생활 패턴 대시보드 생성, 생활 습관 피드백 제공
          </p>
        </div>

        <div className="guide-card">
          <h4 className="guide-card-label">보관 기간</h4>
          <p className="guide-card-content">
            서비스 이용 중 보관. 탈퇴 또는 삭제 요청 시 30일 이내 파기.
          </p>
        </div>

        <div className="guide-card">
          <h4 className="guide-card-label">제3자 제공</h4>
          <p className="guide-card-content">
            광고·마케팅 목적의 제3자 제공 및 활용은 하지 않습니다.
          </p>
        </div>
      </div>

      {/* 3. 필수 동의 항목 */}
      <div className="terms-section">
        <h3 className="section-title">필수 동의 항목</h3>

        <div className="term-checkbox-card" onClick={() => handleToggle('record')}>
          <div className="checkbox-header">
            <input
              type="checkbox"
              id="term-record"
              checked={agreements.record}
              onChange={() => {}} // parent onClick handles toggle
              className="term-checkbox"
            />
            <label htmlFor="term-record" className="checkbox-label">
              통화 녹음 및 음성 전사에 동의합니다. (필수)
            </label>
          </div>
          <p className="checkbox-desc">
            AI 전화 수신 시 음성이 텍스트로 전사되어 저장됩니다.
          </p>
        </div>

        <div className="term-checkbox-card" onClick={() => handleToggle('extract')}>
          <div className="checkbox-header">
            <input
              type="checkbox"
              id="term-extract"
              checked={agreements.extract}
              onChange={() => {}}
              className="term-checkbox"
            />
            <label htmlFor="term-extract" className="checkbox-label">
              건강 정보 자동 추출 및 분석에 동의합니다. (필수)
            </label>
          </div>
          <p className="checkbox-desc">
            대화에서 수면·식사·운동·피부 정보를 자동으로 추출합니다.
          </p>
        </div>

        <div className="term-checkbox-card" onClick={() => handleToggle('save')}>
          <div className="checkbox-header">
            <input
              type="checkbox"
              id="term-save"
              checked={agreements.save}
              onChange={() => {}}
              className="term-checkbox"
            />
            <label htmlFor="term-save" className="checkbox-label">
              건강 기록 저장에 동의합니다. (필수)
            </label>
          </div>
          <p className="checkbox-desc">
            추출된 건강 기록은 보관 기간 동안 서버에 안전하게 저장됩니다.
          </p>
        </div>
      </div>

      {/* 4. 선택 동의 항목 */}
      <div className="terms-section">
        <h3 className="section-title">선택 동의 항목</h3>

        <div className="term-checkbox-card" onClick={() => handleToggle('share')}>
          <div className="checkbox-header">
            <input
              type="checkbox"
              id="term-share"
              checked={agreements.share}
              onChange={() => {}}
              className="term-checkbox"
            />
            <label htmlFor="term-share" className="checkbox-label">
              친구에게 안부 상태 공유를 허용합니다. (선택)
            </label>
          </div>
          <p className="checkbox-desc">
            동의하지 않아도 서비스를 이용할 수 있습니다.
          </p>
        </div>
      </div>

      <p className="terms-footer-notice">
        동의를 철회하거나 데이터를 삭제하려면<br/> 설정 &gt; 데이터 관리에서 요청할 수 있습니다.
      </p>

      {/* 5. 하단 버튼 영역 */}
      <div className="step5-footer">
        <Button onClick={handleAllAgree&&onSkipToHome}>
          모두 동의하고 시작하기
        </Button>

        <Button variant="white" onClick={onNext}>
          통화 설정으로 이동
        </Button>

        <button type="button" className="text-link-btn" onClick={onSkipToHome}>
          홈_대시보드로 이동
        </button>
      </div>
    </div>
  );
};