import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CallTimeSettingPage.css';
import { Button } from '../../components/common/Button';
import { getMember, updateNotificationSetting } from '../../api/members';
import { getMemberId } from '../../utils/memberSession';

const DEFAULT_CALL_TIME_SETTINGS = {
  callTimeRange: '21:00-18:00',
  frequency: '3',
  excludeHolidays: true
};

const AMPM_LIST = ['오전', '오후'];
const HOUR_LIST = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTE_LIST = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const FREQUENCY_LIST = ['1', '2', '3', '4', '5', '6', '7'];
const ITEM_HEIGHT = 44;

export const CallTimeSettingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DEFAULT_CALL_TIME_SETTINGS);
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(() => Boolean(getMemberId()));
  const [isSaving, setIsSaving] = useState(false);

  // 피커 모달 제어 상태
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isFreqPickerOpen, setIsFreqPickerOpen] = useState(false);

  // 시간 피커 내부 선택 상태
  const [selectedAmpm, setSelectedAmpm] = useState('오후');
  const [selectedHour, setSelectedHour] = useState('9');
  const [selectedMinute, setSelectedMinute] = useState('00');

  // 빈도 피커 내부 선택 상태
  const [selectedFreq, setSelectedFreq] = useState('3');

  // 스크롤 DOM 참조
  const ampmRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const freqRef = useRef(null);

  // 24시간 형식(HH:mm)을 피커 상태로 파싱
  const parse24ToTimePicker = (timeStr) => {
    if (!timeStr) return;
    const [hStr, mStr] = timeStr.split(':');
    let hour = parseInt(hStr, 10);
    const minute = mStr || '00';
    const ampm = hour >= 12 ? '오후' : '오전';

    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    setSelectedAmpm(ampm);
    setSelectedHour(String(hour));
    setSelectedMinute(minute);
  };

  // 피커 상태를 24시간 형식(HH:mm)으로 변환
  const formatTimePickerTo24 = (ampm, hour, minute) => {
    let h = parseInt(hour, 10);
    if (ampm === '오후' && h < 12) h += 12;
    else if (ampm === '오전' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${minute}`;
  };

  // UI 표시용 시간 문자열
  const getDisplayTime = () => {
    const time24 = formData.callTimeRange.split('-')[0] || '21:00';
    const [hStr, mStr] = time24.split(':');
    let hour = parseInt(hStr, 10);
    const ampm = hour >= 12 ? '오후' : '오전';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${ampm} ${String(hour).padStart(2, '0')}:${mStr || '00'}`;
  };

  // UI 표시용 빈도 문자열
  const getDisplayFrequency = () => {
    if (formData.frequency === '7') return '매일 (주 7회)';
    return `주 ${formData.frequency}회`;
  };

  useEffect(() => {
    const memberId = getMemberId();
    if (!memberId) return;

    getMember(memberId)
      .then((res) => {
        const member = res?.data || res;
        setNotifyEnabled(member.notifyEnabled);
        const time = member.notifyTime?.slice(0, 5) || '21:00';
        setFormData((prev) => ({ ...prev, callTimeRange: `${time}-18:00` }));
        parse24ToTimePicker(time);
      })
      .catch((error) => console.error('통화 시간 설정 조회 오류:', error))
      .finally(() => setIsLoading(false));
  }, []);

  // 시간 피커 열릴 때 스크롤 위치 동기화
  useEffect(() => {
    if (isTimePickerOpen) {
      const ampmIndex = AMPM_LIST.indexOf(selectedAmpm);
      const hourIndex = HOUR_LIST.indexOf(selectedHour);
      const minuteIndex = MINUTE_LIST.indexOf(selectedMinute);

      if (ampmRef.current && ampmIndex !== -1) ampmRef.current.scrollTop = ampmIndex * ITEM_HEIGHT;
      if (hourRef.current && hourIndex !== -1) hourRef.current.scrollTop = hourIndex * ITEM_HEIGHT;
      if (minuteRef.current && minuteIndex !== -1) minuteRef.current.scrollTop = minuteIndex * ITEM_HEIGHT;
    }
  }, [isTimePickerOpen]);

  // 빈도 피커 열릴 때 스크롤 위치 동기화
  useEffect(() => {
    if (isFreqPickerOpen) {
      const freqIndex = FREQUENCY_LIST.indexOf(selectedFreq);
      if (freqRef.current && freqIndex !== -1) {
        freqRef.current.scrollTop = freqIndex * ITEM_HEIGHT;
      }
    }
  }, [isFreqPickerOpen]);

  // 스크롤 이벤트 핸들러
  const handleScroll = (ref, list, setter) => {
    if (!ref.current) return;
    const index = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
    if (list[index] !== undefined) {
      setter(list[index]);
    }
  };

  // 피커 열기
  const handleOpenTimePicker = () => {
    const time24 = formData.callTimeRange.split('-')[0] || '21:00';
    parse24ToTimePicker(time24);
    setIsTimePickerOpen(true);
  };

  const handleOpenFreqPicker = () => {
    setSelectedFreq(formData.frequency);
    setIsFreqPickerOpen(true);
  };

  // 피커 값 적용
  const handleConfirmTimePicker = () => {
    const newTime24 = formatTimePickerTo24(selectedAmpm, selectedHour, selectedMinute);
    setFormData((prev) => ({ ...prev, callTimeRange: `${newTime24}-18:00` }));
    setIsTimePickerOpen(false);
  };

  const handleConfirmFreqPicker = () => {
    setFormData((prev) => ({ ...prev, frequency: selectedFreq }));
    setIsFreqPickerOpen(false);
  };

  const handleToggleHoliday = () => {
    setFormData((prev) => ({
      ...prev,
      excludeHolidays: !prev.excludeHolidays
    }));
  };

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
        <h2 className="call-time-title">통화 시간 변경</h2>

        {/* 1. 선호하는 통화 시간 */}
        <div className="form-group-block">
          <span className="field-guide-text">선호하는 통화 시간</span>
          <label className="field-main-label">통화 시간</label>
          <div className="select-container">
            <button
              type="button"
              className="call-time-select-btn"
              onClick={handleOpenTimePicker}
            >
              <span>{getDisplayTime()}</span>
              <span className="dropdown-arrow-icon"></span>
            </button>
          </div>
        </div>

        {/* 2. 주간 빈도 */}
        <div className="form-group-block">
          <span className="field-guide-text">주간 빈도</span>
          <label className="field-main-label">통화 횟수</label>
          <div className="select-container">
            <button
              type="button"
              className="call-time-select-btn"
              onClick={handleOpenFreqPicker}
            >
              <span>{getDisplayFrequency()}</span>
              <span className="dropdown-arrow-icon"></span>
            </button>
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

        <p className="call-time-notice">
          설정한 시간대 내에서 AI가 정기적으로 전화를 걸어드립니다. <br/>설정 변경은 언제든 가능합니다.
        </p>

        {/* 4. 하단 버튼 영역 */}
        <div className="call-time-actions">
          <Button
            variant="white"
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

      {/* 시간 선택 바텀시트 */}
      {isTimePickerOpen && (
        <div className="bottom-sheet-overlay" onClick={() => setIsTimePickerOpen(false)}>
          <div className="bottom-sheet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle-bar"></div>

            <div className="picker-container">
              <div className="picker-highlight-bar"></div>

              {/* 오전/오후 */}
              <div
                className="picker-column"
                ref={ampmRef}
                onScroll={() => handleScroll(ampmRef, AMPM_LIST, setSelectedAmpm)}
              >
                <div className="picker-padding-spacer"></div>
                {AMPM_LIST.map((ampm) => (
                  <div
                    key={ampm}
                    className={`picker-item ${selectedAmpm === ampm ? 'active' : ''}`}
                    onClick={() => setSelectedAmpm(ampm)}
                  >
                    {ampm}
                  </div>
                ))}
                <div className="picker-padding-spacer"></div>
              </div>

              {/* 시 */}
              <div
                className="picker-column"
                ref={hourRef}
                onScroll={() => handleScroll(hourRef, HOUR_LIST, setSelectedHour)}
              >
                <div className="picker-padding-spacer"></div>
                {HOUR_LIST.map((h) => (
                  <div
                    key={h}
                    className={`picker-item ${selectedHour === h ? 'active' : ''}`}
                    onClick={() => setSelectedHour(h)}
                  >
                    {h}
                  </div>
                ))}
                <div className="picker-padding-spacer"></div>
              </div>

              {/* 분 */}
              <div
                className="picker-column"
                ref={minuteRef}
                onScroll={() => handleScroll(minuteRef, MINUTE_LIST, setSelectedMinute)}
              >
                <div className="picker-padding-spacer"></div>
                {MINUTE_LIST.map((m) => (
                  <div
                    key={m}
                    className={`picker-item ${selectedMinute === m ? 'active' : ''}`}
                    onClick={() => setSelectedMinute(m)}
                  >
                    {m}
                  </div>
                ))}
                <div className="picker-padding-spacer"></div>
              </div>
            </div>

            <div className="bottom-sheet-footer">
              <Button onClick={handleConfirmTimePicker}>확인</Button>
            </div>
          </div>
        </div>
      )}

      {/* 빈도 선택 바텀시트 */}
      {isFreqPickerOpen && (
        <div className="bottom-sheet-overlay" onClick={() => setIsFreqPickerOpen(false)}>
          <div className="bottom-sheet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle-bar"></div>

            <div className="picker-container freq-picker-container">
              <div className="picker-highlight-bar">
                <span className="freq-fixed-label left">주</span>
                <span className="freq-fixed-label right">회</span>
              </div>

              {/* 횟수 숫자 컬럼 */}
              <div
                className="picker-column freq-column"
                ref={freqRef}
                onScroll={() => handleScroll(freqRef, FREQUENCY_LIST, setSelectedFreq)}
              >
                <div className="picker-padding-spacer"></div>
                {FREQUENCY_LIST.map((f) => (
                  <div
                    key={f}
                    className={`picker-item ${selectedFreq === f ? 'active' : ''}`}
                    onClick={() => setSelectedFreq(f)}
                  >
                    {f}
                  </div>
                ))}
                <div className="picker-padding-spacer"></div>
              </div>
            </div>

            <div className="bottom-sheet-footer">
              <Button onClick={handleConfirmFreqPicker}>확인</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};