import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '../components/common/Header';
import { BottomNavBar } from '../components/layout/BottomNavBar';

import './MainPage.css';

const PATH_TITLES = {
  '/': '홈 대시보드',
  '/record': '건강 기록 관리',
  '/call': '통화 진행 화면',
  '/streak': '소셜 및 스트릭',
  '/settings': '설정 및 데이터 관리',
  '/health/daily' : '일간 건강 기록',
  '/health/weekly' : '주간 건강 기록'
};

// 뒤로가기(<) 버튼을 표시할 경로 목록
const SHOW_BACK_PATHS = ['/health/daily', '/health/weekly'];

export const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. 현재 경로에 해당하는 타이틀 매핑 (없을 경우 기본값 '홈')
  const currentTitle = PATH_TITLES[location.pathname] || '홈';

  // 2. 현재 경로가 SHOW_BACK_PATHS에 포함되어 있는지 확인
  const isBackVisible = SHOW_BACK_PATHS.includes(location.pathname);

  // 3. 뒤로가기 버튼 클릭 핸들러 (이전 페이지로 이동)
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="main-page-container">
      <Header title={currentTitle} showBack={isBackVisible} onBack={handleBack} />
      
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