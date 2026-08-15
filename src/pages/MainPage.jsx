import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '../components/common/Header';
import { BottomNavBar } from '../components/layout/BottomNavBar';

import './MainPage.css';

const PATH_TITLES = {
  '/': '홈 대시보드',
  '/record': '건강 기록 관리',
  '/call': '통화 진행 화면',
  '/streak': '소셜 및 스트릭',
  '/settings': '설정 및 데이터 관리'
};

export const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTitle = PATH_TITLES[location.pathname] || '홈';

  return (
    <div className="main-page-container">
      <Header title={currentTitle} showBack={false} />
      
      <div className="main-tab-content">
        <Outlet />
      </div>

      <BottomNavBar
        currentPath={location.pathname}
        onTabChange={(path) => navigate(path)}
      />
    </div>
  );
};