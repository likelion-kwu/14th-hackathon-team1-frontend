import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/HEY_onboarding.png'
import './ConnectedFriendsPage.css';

/* 백엔드 API 미연결 시 사용할 임시 데이터 */
const DEFAULT_FRIENDS = [
  { name: '김민지', activity: '마지막 활동 8시간 전', shareActive: true },
  { name: '이준호', activity: null, shareActive: true },
  { name: '박유진', activity: '현재 활동중', shareActive: false }
];

/**
 * 연결된 친구 목록 화면: 친구별 최근 활동 상태 확인 및 친구별 공유 설정 진입점
 */
export const ConnectedFriendsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="connected-friends-content">
      <p className="connected-friends-title">연결된 친구</p>

      {DEFAULT_FRIENDS.map((friend) => (
        <div key={friend.name} className="connected-friend-card">
          <div className="connected-friend-row">
            <div className="connected-friend-avatar">
              <img className='hey-icon' src={logo}/>
            </div>
            <div className="connected-friend-text">
              <span className="connected-friend-name">{friend.name}</span>
              {friend.activity && <span className="connected-friend-activity">{friend.activity}</span>}
            </div>
            <button
              type="button"
              className="connected-friend-view-btn"
              onClick={() => navigate('/streak/share-settings', { state: { name: friend.name, shareActive: friend.shareActive } })}
            >
              보기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
