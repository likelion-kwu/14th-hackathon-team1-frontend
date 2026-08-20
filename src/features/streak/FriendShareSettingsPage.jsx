import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import logo from '../../assets/images/HEY_onboarding.png'
import './FriendShareSettingsPage.css';

const SHARE_ITEM_OPTIONS = [
  { id: 'responded', label: '안부 응답 여부', defaultChecked: true },
  { id: 'streak', label: '응답 스트릭 일수', defaultChecked: true },
  { id: 'recentActivity', label: '최근 활동 상태', defaultChecked: false },
  { id: 'sleep', label: '수면 기록', defaultChecked: false },
  { id: 'meal', label: '식사 기록', defaultChecked: false },
  { id: 'exercise', label: '운동 기록', defaultChecked: false },
  { id: 'skin', label: '피부 기록', defaultChecked: false }
];

/* 백엔드 API 미연결 시 사용할 임시 데이터 (친구별 공유 기록/스트릭) */
const DEFAULT_FRIEND_RECORDS = [
  { category: '수면', summary: '7시간 30분 · 오늘' },
  { category: '식사', summary: '아침·점심 섭취 · 오늘' },
  { category: '운동', summary: '걷기 30분 · 어제' },
  { category: '피부', summary: '건조함 호소 · 2일 전' },
  { category: '수면', summary: '확인 필요 · 3일 전' }
];

const DEFAULT_WEEKLY_STATUS = [
  { day: '월', answered: true },
  { day: '화', answered: true },
  { day: '수', answered: true },
  { day: '목', answered: true },
  { day: '금', answered: true },
  { day: '토', answered: false },
  { day: '일', answered: false }
];

/**
 * 친구 안부 공유 설정 화면: 특정 친구 한 명에 대한 공유 항목 설정 + 그 친구의 기록/스트릭 확인 + 삭제까지 한 화면에서 처리
 */
export const FriendShareSettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const friendName = location.state?.name || '친구';

  const [checkedItems, setCheckedItems] = useState(
    SHARE_ITEM_OPTIONS.filter((item) => item.defaultChecked).map((item) => item.id)
  );
  const [shareActive, setShareActive] = useState(location.state?.shareActive ?? true);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const toggleItem = (id) => {
    setCheckedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleConfirmShareToggle = () => {
    setShareActive(confirmTarget === 'resume');
    setConfirmTarget(null);
  };

  const handleSave = () => {
    alert('공유 설정이 저장되었어요.');
  };

  const handleConfirmRemove = () => {
    setShowRemoveModal(false);
    navigate('/streak/friends');
  };

  return (
    <div className="friend-share-content">
      <p className="friend-share-title">친구 안부 공유 설정</p>

      <p className="friend-share-section-title">공유할 항목 선택</p>
      <div className="friend-share-card">
        <p className="friend-share-notice">
          어떤 정보를 친구에게 공유할지 직접 선택하세요. 통화 내용과 상세 건강 기록은 공유되지 않습니다.
        </p>
      </div>
      <div className="friend-share-check-list">
        {SHARE_ITEM_OPTIONS.map((item) => (
          <label key={item.id} className="friend-share-check-row">
            <input
              type="checkbox"
              checked={checkedItems.includes(item.id)}
              onChange={() => toggleItem(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <p className="friend-share-section-title">연결된 친구</p>
      <div className="friend-share-card">
        <div className="friend-share-row">
          <div className="friend-share-avatar">
            <img className='hey-icon' src={logo}/>
          </div>
          <div className="friend-share-text">
            <span className="friend-share-name">{friendName}</span>
            <span className="friend-share-status">{shareActive ? '공유 중' : '공유 중단'}</span>
          </div>
          {shareActive ? (
            <Button variant="red" fullWidth={false} onClick={() => setConfirmTarget('stop')}>
              공유 중단
            </Button>
          ) : (
            <Button variant="resume" fullWidth={false} onClick={() => setConfirmTarget('resume')}>
              공유 재개
            </Button>
          )}
        </div>
      </div>
      <p className="friend-share-notice">연결 해제 시 해당 친구는 내 안부 상태를 더 이상 볼 수 없습니다.</p>

      <p className="friend-share-section-title">{friendName}님의 기록</p>
      <p className="friend-share-subsection-title">이번 주 기록</p>
      {DEFAULT_FRIEND_RECORDS.map((item, idx) => (
        <div key={idx} className="friend-share-card">
          <span className="friend-record-category">{item.category}</span>
          <span className="friend-record-summary">{item.summary}</span>
        </div>
      ))}

      <p className="friend-share-section-title">응답 스트릭</p>
      {shareActive ? (
        <>
          <div className="friend-share-card friend-streak-count-card">
            <p className="friend-streak-count">12</p>
            <p className="friend-streak-count-label">일 연속 응답 중 🔥</p>
          </div>
          <p className="friend-share-subsection-title">이번 주 응답 현황</p>
          <div className="friend-weekly-row">
            {DEFAULT_WEEKLY_STATUS.map((item) => (
              <div key={item.day} className="friend-weekly-day">
                <span className="friend-weekly-day-label">{item.day}</span>
                {item.answered ? (
                  <span className="friend-weekly-check">✓</span>
                ) : (
                  <span className="friend-weekly-empty" />
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="friend-share-notice">상대방이 공유하지 않음</p>
          <p className="friend-share-subsection-title">이번 주 응답 현황</p>
        </>
      )}

      <Button onClick={handleSave}>저장</Button>
      <Button variant="red" onClick={() => setShowRemoveModal(true)}>
        친구 삭제
      </Button>

      {confirmTarget && (
        <div className="friend-share-modal-backdrop">
          <div className="friend-share-modal-card">
            <p className="friend-share-modal-title">{confirmTarget === 'resume' ? '공유 재개' : '공유 중단'}</p>
            <p className="friend-share-modal-desc">
              {confirmTarget === 'resume'
                ? `${friendName}에게 안부 상태 공유를 다시 시작합니다.`
                : `${friendName}에게 안부 상태 공유를 중단합니다. 언제든 다시 공유를 시작할 수 있습니다.`}
            </p>
            <div className="friend-share-modal-actions">
              <Button variant="white" fullWidth={false} onClick={() => setConfirmTarget(null)}>
                취소
              </Button>
              <Button fullWidth={false} onClick={handleConfirmShareToggle}>
                {confirmTarget === 'resume' ? '공유 재개' : '공유 중단'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div className="friend-share-modal-backdrop">
          <div className="friend-share-modal-card">
            <p className="friend-share-modal-title">친구 삭제</p>
            <p className="friend-share-modal-desc">
              {friendName}님을 친구 목록에서 삭제하면 서로의 안부 상태가 더 이상 공유되지 않습니다.
            </p>
            <div className="friend-share-modal-actions">
              <Button variant="white" fullWidth={false} onClick={() => setShowRemoveModal(false)}>
                취소
              </Button>
              <Button variant="red" fullWidth={false} onClick={handleConfirmRemove}>
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
