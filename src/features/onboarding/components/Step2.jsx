import { Button } from '../../../components/common/Button';
import './Step2.css';

/**
 * 온보딩 2단계: 서비스 소개 안내 화면
 * @param {Object} props
 * @param {Function} props.onNext - [전화번호 등록하고 시작하기] 버튼 클릭 시 Step 3으로 이동
 */
export const Step2 = ({ onNext }) => {
  return (
    <div className="step2-container">
      {/* 1. 메인 헤더 타이틀 */}
      <div className="step2-title-group">
        <h2 className="step2-main-title"><span style={{'color': '#7CE5FA'}}>HEY</span>가 처음이신가요?</h2>
        <p className="step2-sub-title">대화만 해도 건강이 기록됩니다</p>
      </div>

      {/* 2. 이렇게 동작해요 박스 */}
      <div className="step2-section-card">
        <h3 className="section-card-title">이렇게 동작해요</h3>

        <div className="step-item-list">
          {/* 순서 1 */}
          <div className="step-item">
            <div className="step-item-header">
              <span className="step-number">①</span>
              <h4 className="step-item-title">AI가 먼저 전화해요</h4>
            </div>
            <p className="step-item-desc">
              설정한 시간에 AI가 먼저 안부 전화를 걸어요. <br/> 자연스럽게 대화하면 돼요.
            </p>
          </div>

          {/* 순서 2 */}
          <div className="step-item">
            <div className="step-item-header">
              <span className="step-number">②</span>
              <h4 className="step-item-title">대화가 건강 기록이 돼요</h4>
            </div>
            <p className="step-item-desc">
              대화가 자동으로 기록되어 대시보드에 쌓여요.
            </p>
          </div>

          {/* 순서 3 */}
          <div className="step-item">
            <div className="step-item-header">
              <span className="step-number">③</span>
              <h4 className="step-item-title">근거를 직접 확인해요</h4>
            </div>
            <p className="step-item-desc">
              기록된 모든 내용은 어떤 대화에서 만들어졌는지 확인하고<br/>수정·삭제할 수 있어요.
            </p>
          </div>
        </div>
      </div>

      {/* 3. 개인정보 및 동의 안내 박스 */}
      <div className="step2-info-card">
        <h3 className="info-card-title">개인정보 및 동의 안내</h3>
        <div>
          <p className="info-card-detail">통화 녹음·전사 및 건강 정보 분석은 별도 동의 후 진행되며<br/>항목별로 선택할 수 있어요.</p>
          <p className="info-card-detail">친구와 공유하는 상태는 사용자가 직접 범위를 정하며<br/>동의 없이 제3자에게 제공되지 않아요.</p>
          <p className="info-card-detail">수집된 데이터의 보관 기간과 삭제 방법은 설정에서<br/>언제든 확인하고 요청할 수 있어요.</p>
        </div>
      </div>

      {/* 4. 의료 진단 서비스가 아닙니다 경고 박스 */}
      <div className="step2-warning-card">
        <div className="warning-content">
          <span className="warning-icon"></span>
          <h4 className="warning-title">⚠️ 의료 진단 서비스가 아닙니다</h4>
          <p className="warning-desc1">
            안부는 건강 우려를 진단하거나 치료를 처방하지 않아요. <br/>걱정되는 증상이 있다면 반드시 의료 전문가와 상담하세요.
          </p>
        </div>
      </div>

      {/* 5. 하단 CTA 버튼 */}
      <div className="step2-footer">
        <Button onClick={onNext}>
          전화번호 등록하고 시작하기
        </Button>
      </div>
    </div>
  );
};