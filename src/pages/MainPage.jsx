import { useState } from 'react';
import { Header } from '../components/common/Header';
import { BottomNavBar } from '../components/layout/BottomNavBar';

import { HomePage } from './HomePage';
import { RecordPage } from './RecordPage';
import { CallPage } from './CallPage';
import { StreakPage } from './StreakPage';
import { SettingPage } from './SettingPage';

import './MainPage.css';

const TAB_TITLES = {
  home: '홈 대시보드',
  records: '건강 기록 관리',
  call: '통화 진행 화면',
  streak: '소셜 및 스트릭',
  settings: '설정 및 데이터 관리'
};

export const MainPage = ({ userData }) => {
  // 현재 활성화된 하단 탭 상태 ('home' | 'records' | 'call' | 'streak' | 'settings')
  const [activeTab, setActiveTab] = useState('home');

  // 바로가기 버튼이나 카드 클릭 시 탭 이동 핸들러
  const handleNavigate = (destinationTab) => {
    if (TAB_TITLES[destinationTab]) {
      setActiveTab(destinationTab);
    }
  };

  return (
    <div className="main-page-container">
      <Header title={TAB_TITLES[activeTab]} showBack={false} />

      {/* 선택 페이지 컴포넌트만 렌더링 */}
      <div className="main-tab-content">
        {activeTab === 'home' && (
          <HomePage userData={userData} onNavigate={handleNavigate} />
        )}
        {activeTab === 'records' && (
          <RecordPage userData={userData} />
        )}
        {activeTab === 'call' && (
          <CallPage userData={userData} />
        )}
        {activeTab === 'streak' && (
          <StreakPage userData={userData} />
        )}
        {activeTab === 'settings' && (
          <SettingPage userData={userData} />
        )}
      </div>

      {/* 3. 하단 고정 네비게이션 바 */}
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};