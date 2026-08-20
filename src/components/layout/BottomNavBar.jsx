import './BottomNavBar.css';

const HomeIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const RecordIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-10 14H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm8 8h-6v-2h6v2zm0-4h-6v-2h6v2zm0-4h-6V7h6v2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c0-.55-.45-1-.99-1z" />
  </svg>
);

const StreakIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.61 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM12 20c-3.31 0-6-2.69-6-6 0-1.53.5-3.04 1.4-4.25.1.84.45 1.62 1.01 2.23.95 1.04 2.33 1.68 3.83 1.68 2.04 0 3.76-1.27 4.45-3.07C17.49 12.18 18 13.62 18 14c0 3.31-2.69 6-6 6z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.484.484 0 0014 2h-4c-.25 0-.46.18-.49.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.63 8.47c-.12.21-.08.47.12.61L4.78 10.6c-.05.31-.08.63-.08.94s.03.63.08.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

export const BottomNavBar = ({ currentPath = '/', onTabChange }) => {
  const navItems = [
    {
      path: '/',
      label: '홈',
      icon: <HomeIcon />,
      // 홈 탭으로 처리할 하위 경로 목록
      matchPaths: ['/', '/health/daily', '/health/weekly', '/feedbackDetail'],
    },
    {
      path: '/record',
      label: '기록',
      icon: <RecordIcon />,
      matchPaths: ['/record', 'record/list', 'record/detail'],
    },
    {
      path: '/call',
      label: '전화',
      icon: <PhoneIcon />,
      matchPaths: ['/call', 'call/in-progress', 'call/missed', 'call/chat'],
    },
    {
      path: '/streak',
      label: '스트릭',
      icon: <StreakIcon />,
      matchPaths: ['/streak', 'streak/detail', 'streak/invite', 'streak/share-settings'],
    },
    {
      path: '/settings',
      label: '설정',
      icon: <SettingsIcon />,
      matchPaths: ['/settings', 'settings/phone', 'settings/call-time', 'settings/data-management', 'settings/privacy-policy'],
    },
  ];

  // 활성화 여부 판별 함수
  const checkIsActive = (item) => {
    const normalizedCurrent = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;

    return item.matchPaths.some((prefix) => {
      if (prefix === '/') {
        return normalizedCurrent === '/';
      }
      return normalizedCurrent.startsWith(prefix);
    });
  };

  return (
    <nav className="bottom-nav-bar">
      {navItems.map((item) => {
        const isActive = checkIsActive(item);

        return (
          <button
            key={item.path}
            type="button"
            className={`nav-item-btn ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange && onTabChange(item.path)}
          >
            <div className="nav-icon-wrap">
              {item.icon}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};