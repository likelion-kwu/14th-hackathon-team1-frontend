import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CallTimeSettingPage.css';
import { Button } from '../../components/common/Button';
import { getMember, updateNotificationSetting } from '../../api/members';
import { getMemberId } from '../../utils/memberSession';

// 기본 값 (서버에서 못 불러왔을 때만 사용)
const DEFAULT_CALL_TIME_SETTINGS = {
  callTimeRange: '09:00-18:00',
  frequency: '3',
  excludeHolidays: true
};

export const CallTimeSettingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DEFAULT_CALL_TIME_SETTINGS);
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(() => Boolean(getMemberId()));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const memberId = getMemberId();
    if (!memberId) {
      return;
    }

    getMember(memberId)
      .then((member) => {
        setNotifyEnabled(member.notifyEnabled);
        // 서버는 시각 하나만 관리해서, 저장된 시각을 시작 시간으로 보여줍니다
        const time = member.notifyTime?.slice(0, 5);
        if (time) {
          setFormData((prev) => ({ ...prev, callTimeRange: `${time}-18:00` }));
        }
      })
      .catch((error) => console.error('통화 시간 설정 조회 오류:', error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleHoliday = () => {
    setFormData((prev) => ({
      ...prev,
      excludeHolidays: !prev.excludeHolidays
    }));
  };

  // 설정 저장 핸들러
  const handleSave = async () => {
    const memberId = getMemberId();
    if (!memberId) {
      alert('회원 정보가 없어요. 온보딩을 먼저 완료해주세요.');
      return;
    }
    setIsSaving(true);
    try {
      const notifyTime = formData.callTimeRange.split('-')[0];
      await updateNotificationSetting(memberId, { notifyTime, notifyEnabled });
      alert('통화 시간 설정이 저장되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('통화 시간 저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="call-time-loading-box">
        <p>설정을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="call-time-container">
      <main className="call-time-content">
        {/* 상단 타이틀 */}
        <h2 className="call-time-title">통화 시간 변경</h2>

        {/* 1. 선호하는 통화 시간 */}
        <div className="form-group-block">
          <span className="field-guide-text">선호하는 통화 시간</span>
          <label className="field-main-label">통화 시간</label>
          <div className="select-container">
            <select
              className="call-time-select"
              value={formData.callTimeRange}
              onChange={(e) => handleChange('callTimeRange', e.target.value)}
            >
              <option value="" disabled>Select...</option>
              <option value="09:00-18:00">평일 오전 9시 – 오후 6시</option>
              <option value="09:00-12:00">오전 9시 – 오후 12시</option>
              <option value="13:00-18:00">오후 1시 – 오후 6시</option>
              <option value="18:00-21:00">저녁 6시 – 밤 9시</option>
            </select>
          </div>
        </div>

        {/* 2. 주간 빈도 */}
        <div className="form-group-block">
          <span className="field-guide-text">주간 빈도</span>
          <label className="field-main-label">통화 횟수</label>
          <div className="select-container">
            <select
              className="call-time-select"
              value={formData.frequency}
              onChange={(e) => handleChange('frequency', e.target.value)}
            >
              <option value="" disabled>Select...</option>
              <option value="1">주 1회</option>
              <option value="2">주 2회</option>
              <option value="3">주 3회</option>
              <option value="5">주 5회 (평일 매일)</option>
              <option value="7">매일</option>
            </select>
          </div>
        </div>

        {/* 3. 공휴일 제외 토글 */}
        <div className="form-group-block">
          <span className="field-guide-text">공휴일 제외</span>
          <div className="toggle-row-between">
            <span className="toggle-item-title">공휴일 제외</span>
            <label className="switch-wrapper">
              <input
                type="checkbox"
                checked={formData.excludeHolidays}
                onChange={handleToggleHoliday}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="call-time-notice">
          설정한 시간대 내에서 AI가 정기적으로 전화를 걸어드립니다. <br/>설정 변경은 언제든 가능합니다.
        </p>

        {/* 4. 하단 버튼 영역 */}
        <div className="call-time-actions">
          <Button
            variant='white'
            className="btn-cancel"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button
            className="btn-save"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '저장 중…' : '저장'}
          </Button>
        </div>
      </main>
    </div>
  );
};