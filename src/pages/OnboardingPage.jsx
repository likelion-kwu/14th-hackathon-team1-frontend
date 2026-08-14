import { useState } from "react";
import { Header } from "../components/common/Header";

import { Step1 } from "../features/onboarding/components/Step1";
import { Step2 } from "../features/onboarding/components/Step2";
import { Step3 } from "../features/onboarding/components/Step3";
import { Step4 } from "../features/onboarding/components/Step4";
import { Step5 } from "../features/onboarding/components/Step5";
import { Step6 } from "../features/onboarding/components/Step6";

import './OnboardingPage.css'

export const OnboardingPage = ({ onComplete }) => { 
  const [currentStep, setCurrentStep] = useState(1); // 현재 온보딩 페이지

  const [formData, setFormData] = useState({
    phoneNumber: '',
    verificationCode:'',
    agreements: {
    record: false,  // 통화 녹음 및 전사 동의 (필수)
    extract: false, // 건강 정보 자동 추출 동의 (필수)
    save: false,    // 건강 기록 저장 동의 (필수)
    share: false    // 친구 상태 공유 동의 (선택)
    },
    settings: {
      startTime: '',
      endTime: '',
      frequency: '',
      categories: {
        sleep: true,
        diet: true,
        exercise: true,
        skin: true
      },
      alerts: {
        missedCall: false,
        weeklySummary: false
      }
    }
  });

  // 다음 스텝으로 이동
  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // 이전 스텝으로 이동
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 폼 데이터 변경 핸들러
  const handleUpdateFormData = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Step 6 최종 [설정 완료, 시작하기] 클릭 시 실행
  const handleFinalSubmit = async () => {
    try {
      console.log('최종 온보딩 등록 데이터 백엔드 전송:', formData);
      // TODO: 백엔드 API 연동 (POST /api/users/init-settings)
      
      if (onComplete) {
        onComplete(formData);
      }
    } catch (error) {
      console.error('설정 저장 에러:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    }
  };

  // 단계별 헤더 타이틀 매핑
  const headerTitles = {
    1: '온보딩',
    2: '서비스 소개 안내',
    3: '전화번호 등록',
    4: '전화번호 인증',
    5: '개인정보 동의',
    6: '통화 설정'
  };

  return (
    <div className="onboarding-container">
      <Header
        title={headerTitles[currentStep]}
        onBack={handlePrevStep}
        showBack={currentStep > 1}
      />

      <main className="onboarding-content">
        {currentStep === 1 && (
            <Step1 onNext={handleNextStep} />
        )}

        {currentStep === 2 && (
            <Step2 onNext={handleNextStep} />
        )}

        {currentStep === 3 && (
            <Step3
                phoneNumber={formData.phoneNumber}
                onChangePhone={(val) => handleUpdateFormData('phoneNumber', val)}
                onNext={handleNextStep}
          />
        )}

        {currentStep === 4 && (
            <Step4
                phoneNumber={formData.phoneNumber}
                code={formData.verificationCode}
                onChangeCode={(val) => handleUpdateFormData('verificationCode', val)}
                onNext={handleNextStep}
                onBackToPhone={handlePrevStep}
            />
        )}

        {currentStep === 5 && (
            <Step5
                agreements={formData.agreements}
                onChangeAgreements={(val) => handleUpdateFormData('agreements', val)}
                onNext={handleNextStep}
                onSkipToHome={() => onComplete && onComplete()}
            />
        )}

        {currentStep === 6 && (
          <Step6
            settings={formData.settings}
            onChangeSettings={(val) => handleUpdateFormData('settings', val)}
            onSubmit={handleFinalSubmit}
            onBack={handlePrevStep}
          />
        )}
      </main>
    </div>
  );
};