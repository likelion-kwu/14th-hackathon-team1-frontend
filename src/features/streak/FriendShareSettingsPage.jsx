import { useState } from 'react';
import { Button } from '../../components/common/Button';
import './FriendShareSettingsPage.css';

const SHARE_ITEM_OPTIONS = [
  { id: 'responded', label: '안부 응답 여부 (전화·채팅 응답했는지)', defaultChecked: true },
  { id: 'streak', label: '응답 스트릭 일수', defaultChecked: true },
  { id: 'recentActivity', label: '최근 활동 상태 (오늘 응답 완료 등)', defaultChecked: false },
  { id: 'sleep', label: '수면 요약 (주간 평균)', defaultChecked: false },
  { id: 'exercise', label: '운동 요약 (주간 평균)', defaultChecked: false }
];

/* 백엔드 API 미연결 시 사용할 임시 데이터 */
const DEFAULT_FRIENDS = [
  { id: 'f1', name: '김민지', status: '공유 중 · 안부 응답 여부, 스트릭 일수', shareActive: true },
  { id: 'f2', name: '이준호', status: '공유 중 · 안부 응답 여부', shareActive: true },
  { id: 'f3', name: '박유진', status: '공유 일시 중단됨', shareActive: false }
];

/**
 * 친구 안부 공유 설정 화면: 공유할 항목 선택 및 연결된 친구별 공유 중단/재연결 관리
 */
export const FriendShareSettingsPage = () => {
  const [checkedItems, setCheckedItems] = useState(
    SHARE_ITEM_OPTIONS.filter((item) => item.defaultChecked).map((item) => item.id)
  );
  const [friends, setFriends] = useState(DEFAULT_FRIENDS);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const toggleItem = (id) => {
    setCheckedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleConfirmAction = () => {
    if (!confirmTarget) return;
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === confirmTarget.id
          ? { ...friend, shareActive: false, status: confirmTarget.mode === 'disconnect' ? '연결 해제됨' : '공유 일시 중단됨' }
          : friend
      )
    );
    setConfirmTarget(null);
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
              className='share-checkbox'
              checked={checkedItems.includes(item.id)}
              onChange={() => toggleItem(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <p className="friend-share-section-title">연결된 친구</p>
      {friends.map((friend) => (
        <div key={friend.id} className="friend-share-card">
          <div className="friend-share-row">
            <div className="friend-share-avatar">Aa</div>
            <div className="friend-share-text">
              <span className="friend-share-name">{friend.name}</span>
              <span className="friend-share-status">{friend.status}</span>
            </div>
            {friend.shareActive ? (
              <Button
                variant="red"
                fullWidth={false}
                onClick={() => setConfirmTarget({ id: friend.id, name: friend.name, mode: 'stop' })}
              >
                공유 중단
              </Button>
            ) : (
              <Button fullWidth={false} onClick={() => setConfirmTarget({ id: friend.id, name: friend.name, mode: 'disconnect' })}>
                연결 해제
              </Button>
            )}
          </div>
        </div>
      ))}

      <p className="friend-share-notice">연결 해제 시 해당 친구는 내 안부 상태를 더 이상 볼 수 없습니다.</p>

      {confirmTarget && (
        <div className="friend-share-modal-backdrop">
          <div className="friend-share-modal-card">
            <p className="friend-share-modal-title">{confirmTarget.mode === 'disconnect' ? '연결 해제' : '공유 중단'}</p>
            <p className="friend-share-modal-desc">
              {confirmTarget.mode === 'disconnect'
                ? `${confirmTarget.name}과의 연결을 해제하면 내 안부 상태가 더 이상 공유되지 않으며, 다시 초대해야 연결할 수 있습니다.`
                : `${confirmTarget.name}에게 안부 상태 공유를 중단합니다. 언제든 다시 공유를 시작할 수 있습니다.`}
            </p>
            <div className="friend-share-modal-actions">
              <Button variant="white" fullWidth={false} onClick={() => setConfirmTarget(null)}>
                취소
              </Button>
              <Button fullWidth={false} onClick={handleConfirmAction}>
                {confirmTarget.mode === 'disconnect' ? '연결 해제' : '공유 중단'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
