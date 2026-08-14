import './BottomNavBar.css';

/**
 * 하단 글로벌 네비게이션 바 컴포넌트
 * @param {Object} props
 * @param {string} props.activeTab - 현재 활성화된 탭 ID ('home' | 'records' | 'call' | 'streak' | 'settings')
 * @param {Function} props.onTabChange - 탭 클릭 핸들러
 */
export const BottomNavBar = ({ activeTab = 'home', onTabChange }) => {
  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'records', label: '기록' },
    { id: 'call', label: '전화' },
    { id: 'streak', label: '스트릭' },
    { id: 'settings', label: '설정' },
  ];

  return (
    <nav className="bottom-nav-bar">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`nav-item-btn ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange && onTabChange(item.id)}
          >
            <div className={`nav-icon-placeholder ${isActive ? 'active' : ''}`} />
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};