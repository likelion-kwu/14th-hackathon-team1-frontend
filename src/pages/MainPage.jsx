import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '../components/common/Header';
import { BottomNavBar } from '../components/layout/BottomNavBar';

import './MainPage.css';

const PATH_TITLES = {
  '/': '홈 대시보드',
  '/health/daily' : '일간 건강 기록',
  '/health/weekly' : '주간 건강 기록',
  '/feedbackDetail' : '생활 습관 피드백',

  '/record': '건강 기록 관리',
  '/record/list': '자동 기록 목록',
  '/record/detail' : '기록 상세 및 근거',

  '/call': 'AI 안부 전화',
  '/call/in-progress': '통화 진행 화면',
  '/call/missed': '부재중 알림',
  '/call/chat': '채팅 이어하기',
  '/streak': '소셜 및 스트릭',
  '/streak/detail': '응답 스트릭 현황',
  '/streak/invite': '친구 초대',
  '/streak/share-settings': '친구 안부 공유 설정',
  '/streak/friends': '연결된 친구',
  '/settings': '설정 및 데이터 관리',
  '/settings/call-time': '통화 시간 변경',
  '/settings/phone': '전화번호 변경',
  '/settings/data-management': '데이터 열람 및 삭제',
  '/settings/privacy-policy': '개인정보 처리 방침'
};

// 뒤로가기(<) 버튼을 표시할 경로 목록
const SHOW_BACK_PATHS = [
  '/health/daily', '/health/weekly', '/feedbackDetail',
  '/record/list', '/record/detail',
  '/settings/call-time', '/settings/phone', '/settings/data-management', '/settings/privacy-policy',
  '/call/in-progress', '/call/missed', '/call/chat',
  '/streak/detail', '/streak/invite', '/streak/share-settings', '/streak/friends'
];

export const MainPage = ({ userData, onUpdateUserData }) => {
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
        <Outlet context={{ userData, onUpdateUserData }} />
      </div>

      <BottomNavBar
        currentPath={location.pathname}
        onTabChange={(path) => navigate(path)}
      />
    </div>
  );
};