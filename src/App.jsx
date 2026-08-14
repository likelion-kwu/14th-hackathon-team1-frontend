import { useState } from 'react';
import './App.css'
import { OnboardingPage } from './pages/OnboardingPage'
import { MainPage } from './pages/MainPage';

function App() {
  // 온보딩 완료 핸들러
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  const [userProfile, setUserProfile] = useState(null);

  const handleOnboardingComplete = (completedData) => {
    console.log('온보딩 완료 - 저장된 데이터:', completedData);
    setUserProfile(completedData);
    setIsOnboardingCompleted(true);
  };

  return (
    <div>
      {!isOnboardingCompleted ? (
        /* 온보딩 페이지 실행 */
        <OnboardingPage onComplete={handleOnboardingComplete} />
      ) : (
        <MainPage userData={userProfile} />
      )}
    </div>
  )
}

export default App
