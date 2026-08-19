import { useState } from 'react';
import './App.css'
import { OnboardingPage } from './pages/OnboardingPage'
import { MainPage } from './pages/MainPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { RecordPage } from './pages/RecordPage';
import { CallPage } from './pages/CallPage';
import { StreakPage } from './pages/StreakPage';
import { SettingPage } from './pages/SettingPage';
import { DailyHealthPage } from './features/health/DailyHealthPage';
import { WeeklyHealthPage } from './features/health/WeeklyHealthPage';
import { FeedbackDetail } from './features/health/FeedbackDetail';
import { RecordListPage } from './features/record/RecordListPage';
import { RecordDetailPage } from './features/record/RecordDetailPage';
import { CallTimeSettingPage } from './features/settings/CallTimeSettingPage';
import { PhoneSettingPage } from './features/settings/PhoneSettingPage';

function App() {
  // 온보딩 완료 핸들러
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  const [userProfile, setUserProfile] = useState(null);

  const handleOnboardingComplete = (completedData) => {
    console.log('온보딩 완료 - 저장된 데이터:', completedData);
    setUserProfile(completedData);
    setIsOnboardingCompleted(true);
  };

  const handleUpdateUserData = (updatedData) => {
    setUserProfile(updatedData);
  }

  return (
    <Routes>
      {/* 온보딩 페이지 */}
      <Route
        path="/onboarding"
        element={<OnboardingPage onComplete={handleOnboardingComplete} />}
      />

      {/* 대시보드 공통 레이아웃 */}
      <Route
        path="/"
        element={
          !isOnboardingCompleted ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <MainPage userData={userProfile} onUpdateUserData={handleUpdateUserData} />
          )
        }
      >
        <Route index element={<HomePage userData={userProfile} />} />
        <Route path="record" element={<RecordPage userData={userProfile} />} />
        <Route path="call" element={<CallPage userData={userProfile} />} />
        <Route path="streak" element={<StreakPage userData={userProfile} />} />
        <Route path="settings" element={<SettingPage userData={userProfile} />} />
      
        <Route path='health/daily' element={<DailyHealthPage />} />
        <Route path='health/weekly' element={<WeeklyHealthPage />} />
        <Route path='feedbackDetail' element={<FeedbackDetail/>} />

        <Route path='record/list' element={<RecordListPage/>} />
        <Route path='record/detail' element={<RecordDetailPage/>} />
      
        <Route path='settings/call-time' element={<CallTimeSettingPage/>} />
        <Route path='settings/phone' element={<PhoneSettingPage/>} />
      </Route>

      {/* 기타 잘못된 접근 시 홈으로 이동 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
