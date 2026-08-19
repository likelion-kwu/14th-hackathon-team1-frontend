import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import './InviteFriendPage.css';

const SHARE_ITEM_OPTIONS = [
  { id: 'streak', label: '응답 스트릭 (연속 응답 일수)', defaultChecked: true },
  { id: 'lastResponse', label: '마지막 안부 응답 일시', defaultChecked: true },
  { id: 'sleep', label: '수면 상태 요약', defaultChecked: false },
  { id: 'diet', label: '식사 상태 요약', defaultChecked: false },
  { id: 'exercise', label: '운동 상태 요약', defaultChecked: false },
  { id: 'skin', label: '피부 상태 요약', defaultChecked: false }
];

const SHARE_ITEM_LABELS = {
  streak: '응답 스트릭',
  lastResponse: '마지막 응답 일시',
  sleep: '수면 요약',
  diet: '식사 요약',
  exercise: '운동 요약',
  skin: '피부 요약'
};

/**
 * 친구 초대 화면: 친구 연락처 입력 및 공유할 안부 범위 선택 후 초대 메시지 전송
 */
export const InviteFriendPage = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState('');
  const [checkedItems, setCheckedItems] = useState(
    SHARE_ITEM_OPTIONS.filter((item) => item.defaultChecked).map((item) => item.id)
  );

  const toggleItem = (id) => {
    setCheckedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const previewLabels = checkedItems.map((id) => SHARE_ITEM_LABELS[id]).join(', ') || '선택된 항목 없음';

  const handleSendInvite = () => {
    console.log('초대 전송', { contact, checkedItems });
    alert('초대를 보냈어요.');
    navigate('/streak');
  };

  return (
    <div className="invite-friend-content">
      <p className="invite-title">친구 초대</p>
      <p className="invite-desc">신뢰하는 친구에게만 제한된 안부 정보를 공유해요.</p>

      <p className="invite-section-title">친구 연락처</p>
      <div className="invite-field">
        <input
          type="text"
          className="invite-input"
          placeholder="이름 또는 전화번호 입력"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>
      <p className="invite-hint">초대받은 친구는 아래에서 설정한 항목만 볼 수 있어요.</p>

      <p className="invite-section-title">공유할 안부 범위</p>
      <div className="invite-card">
        {SHARE_ITEM_OPTIONS.map((item) => (
          <label key={item.id} className="invite-check-row">
            <input
              type="checkbox"
              checked={checkedItems.includes(item.id)}
              onChange={() => toggleItem(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
      <p className="invite-hint">통화 원문, 전사 내용, 상세 건강 기록은 친구에게 공개되지 않아요.</p>

      <p className="invite-section-title">초대 메시지 미리보기</p>
      <div className="invite-card">
        <p className="invite-preview-line">안부 앱에서 보낸 초대예요.</p>
        <p className="invite-preview-line">저의 안부 상태 일부를 가까운 친구와 나누고 싶어요. 아래 링크로 확인해 보세요.</p>
        <p className="invite-preview-sub">• 공유 항목: {previewLabels}</p>
        <p className="invite-preview-sub">• 통화 내용 및 상세 건강 기록은 공유되지 않아요.</p>
      </div>

      <p className="invite-hint">초대를 수락해야만 상태가 공유됩니다. 언제든지 공유를 중단할 수 있어요.</p>

      <Button onClick={handleSendInvite}>친구에게 초대 보내기</Button>
    </div>
  );
};
