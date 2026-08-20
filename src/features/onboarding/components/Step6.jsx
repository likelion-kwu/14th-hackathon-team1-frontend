import { Button } from '../../../components/common/Button';
import './Step6.css';

/**
 * 온보딩 6단계: 통화 설정 화면
 * @param {Object} props
 * @param {Object} props.settings - 통화 설정 상태 객체
 * @param {Function} props.onChangeSettings - 통화 설정 변경 핸들러
 * @param {Function} props.onSubmit - [설정 완료, 시작하기] 최종 제출 핸들러
 * @param {Function} props.onBack - [이전 단계로 돌아가기] 클릭 시 Step 5로 이동
 * @param {boolean} props.isSubmitting - 회원 생성 요청 진행 여부
 */

export const Step6 = ({
    settings,
    onChangeSettings,
    onSubmit,
    onBack,
    isSubmitting = false
    }) => {
        
  // Select Box 및 필드 일반 변경
  const handleChange = (field, value) => {
    onChangeSettings({
      ...settings,
      [field]: value
    });
  };

  // 기록할 건강 항목 체크박스 토글
  const handleCategoryToggle = (key) => {
    onChangeSettings({
      ...settings,
      categories: {
        ...settings.categories,
        [key]: !settings.categories[key]
      }
    });
  };

  // 알림 선호 토글 스위치 변경
  const handleAlertToggle = (key) => {
    onChangeSettings({
      ...settings,
      alerts: {
        ...settings.alerts,
        [key]: !settings.alerts[key]
      }
    });
  };

  return (
    <div className="step6-container">
      {/* 1. 상단 타이틀 */}
      <div className="step6-title-group">
        <h2 className="step6-main-title">통화 설정</h2>
        <p className="step6-sub-title">
          AI 안부 전화를 받을 조건과 기록 범위를 정해 주세요.
        </p>
      </div>

      {/* 2. 통화 가능 시간대 Select Box */}
      <h3 className="setting-section-title">통화 가능 시간대</h3>
      <div className="setting-section-card">
        <div className="select-field-group">
          <label className="select-label">시작 시간</label>

          <select
            className="setting-select"
            value={settings.startTime || ''}
            onChange={(e) => handleChange('startTime', e.target.value)}
          >
            <option value="" disabled>Select...</option>            <option value="18:00">오후 06:00</option>
            <option value="19:00">오후 07:00</option>
            <option value="20:00">오후 08:00</option>
            <option value="21:00">오후 09:00</option>
            <option value="22:00">오후 10:00</option>
          </select>
        </div>

        <div className="select-field-group">
          <label className="select-label">종료 시간</label>
          <select
            className="setting-select"
            value={settings.endTime || ''}
            onChange={(e) => handleChange('endTime', e.target.value)}
          >
            <option value="" disabled>Select...</option>
            <option value="20:00">오후 08:00</option>
            <option value="21:00">오후 09:00</option>
            <option value="22:00">오후 10:00</option>
            <option value="23:00">오후 11:00</option>
          </select>
        </div>
      </div>

      {/* 3. 안부 전화 빈도 Select Box */}
      <h3 className="setting-section-title">안부 전화 빈도</h3>
      <div className="setting-section-card">
        <div className="select-field-group">
          <label className="select-label">전화 빈도</label>
          <select
            className="setting-select"
            value={settings.frequency || ''}
            onChange={(e) => handleChange('frequency', e.target.value)}
          >
            <option value="" disabled>Select...</option>
            <option value="DAILY">매일 1회</option>
            <option value="WEEKDAY">평일만 (월~금)</option>
            <option value="WEEKEND">주말만 (토, 일)</option>
            <option value="BIWEEKLY">주 2~3회</option>
          </select>
        </div>
        <p className="setting-card-notice">
          설정한 빈도에 맞춰 AI가 먼저 전화를 겁니다.
        </p>
      </div>
      
      {/* 4. 기록할 건강 항목 체크박스 */}
      <h3 className="setting-section-title">기록할 건강 항목</h3>
      <div className="setting-section-card">
        
        <div className="category-checkbox-group">
          <label className="checkbox-item" onClick={() => handleCategoryToggle('sleep')}>
            <input
              type="checkbox"
              checked={settings.categories?.sleep ?? true}
              onChange={() => {}}
              className="setting-checkbox"
            />
            <span className="checkbox-text">수면</span>
          </label>

          <label className="checkbox-item" onClick={() => handleCategoryToggle('diet')}>
            <input
              type="checkbox"
              checked={settings.categories?.diet ?? true}
              onChange={() => {}}
              className="setting-checkbox"
            />
            <span className="checkbox-text">식사</span>
          </label>

          <label className="checkbox-item" onClick={() => handleCategoryToggle('exercise')}>
            <input
              type="checkbox"
              checked={settings.categories?.exercise ?? true}
              onChange={() => {}}
              className="setting-checkbox"
            />
            <span className="checkbox-text">운동</span>
          </label>

          <label className="checkbox-item" onClick={() => handleCategoryToggle('skin')}>
            <input
              type="checkbox"
              checked={settings.categories?.skin ?? true}
              onChange={() => {}}
              className="setting-checkbox"
            />
            <span className="checkbox-text">피부</span>
          </label>
        </div>
        <p className="setting-card-notice">
          선택한 항목에 대해서만 대화 후 자동 기록됩니다.
        </p>
      </div>
     
      {/* 5. 알림 선호 토글 스위치 */}
      <h3 className="setting-section-title">알림 선호</h3>
      <div className="setting-section-card-toggle">
        <div className="toggle-item-row">
          <span className="toggle-label">부재중 통화 채팅 알림 받기</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.alerts?.missedCall ?? false}
              onChange={() => handleAlertToggle('missedCall')}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="toggle-item-row">
          <span className="toggle-label">주간 생활 패턴 요약 알림 받기</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.alerts?.weeklySummary ?? false}
              onChange={() => handleAlertToggle('weeklySummary')}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* 6. 의료 진단 서비스 안내 경고 박스 */}
      <div className="step6-warning-box">
        <span className="warning-box-icon">⚠️ 이 서비스는 의료 진단 서비스가 아닙니다.</span>
        <p className="warning-box-text">
          AI 안부 전화와 기록은 건강한 생활 습관 파악을 돕기 위한 것이며,<br/>
 질병 진단·치료·처방을 제공하지 않습니다. <br/>
건강에 우려가 있을 경우 전문 의료 상담을 받으세요.
        </p>
      </div>

      {/* 7. 하단 제출 버튼 세트 */}
      <div className="step6-footer">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          시작하기
        </Button>
        <button type="button" className="text-link-btn" onClick={onBack}>
          이전 단계로 돌아가기
        </button>
      </div>
    </div>
  );
};
