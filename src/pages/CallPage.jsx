import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import './CallPage.css';

/* 백엔드 API 미연결 시 사용할 임시 데이터 */
const DEFAULT_CALL_SETTINGS = {
  timeRange: '오전 9:00 – 10:00',
  frequency: '매일',
  phoneNumber: '010-****-5678 (인증 완료)',
  categories: { sleep: true, diet: true, exercise: true, skin: true }
};

const CATEGORY_LABELS = { sleep: '수면', diet: '식사', exercise: '운동', skin: '피부' };

/**
 * 전화 탭 기본 화면(AI 안부 전화): 정기 통화 설정 요약과 통화 시작 진입점
 * @param {Object} props
 * @param {Object} [props.callSettings] - 외부(부모/API)에서 주입받는 정기 통화 설정 (없으면 내부 mock 사용)
 */
export const CallPage = ({ callSettings: initialSettings }) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(initialSettings || DEFAULT_CALL_SETTINGS);

  useEffect(() => {
    if (initialSettings) return; // 이미 초기 state로 반영됨

    const fetchCallSettings = async () => {
      setSettings(DEFAULT_CALL_SETTINGS);
    };
    fetchCallSettings();
  }, [initialSettings]);

  const activeCategories = Object.keys(settings.categories).filter(
    (key) => settings.categories[key]
  );

  return (
    <div className="call-page-content">
      <p className="call-main-title">AI 안부 전화</p>
      <p className="call-main-desc">
        AI가 설정한 시간에 먼저 전화를 걸어 안부를 묻고, 수면·식사·운동·피부 상태를 자연스럽게 기록해 드립니다.
        의료 진단이나 처방이 아닌 생활 습관 대화 서비스입니다.
      </p>

      <div className="call-card">
        <p className="call-card-title">정기 통화 설정</p>
        <div className="call-summary-list">
          <div className="call-summary-row">
            <span>통화 시간대</span>
            <span>{settings.timeRange}</span>
          </div>
          <div className="call-summary-row">
            <span>통화 빈도</span>
            <span>{settings.frequency}</span>
          </div>
          <div className="call-summary-row">
            <span>전화번호</span>
            <span>{settings.phoneNumber}</span>
          </div>
        </div>
      </div>

      <div className="call-card">
        <p className="call-card-title">이번 통화에서 확인할 항목</p>
        <div className="call-chip-row">
          {activeCategories.map((key) => (
            <span key={key} className="call-chip">
              {CATEGORY_LABELS[key]}
            </span>
          ))}
        </div>
      </div>

      <div className="call-card">
        <p className="call-card-title">전화를 못 받으셨나요?</p>
        <p className="call-card-desc">
          통화를 받지 못해도 괜찮아요. 채팅에서 같은 안부 질문으로 대화를 이어갈 수 있으며, 이미 나눈 대화 내용은 반복해서 묻지 않습니다.
        </p>
        <Button variant="link" onClick={() => navigate('/call/missed')}>
          부재중 채팅 이어하기
        </Button>
      </div>

      <Button onClick={() => navigate('/call/in-progress')}>지금 통화 시작하기</Button>
    </div>
  );
};
