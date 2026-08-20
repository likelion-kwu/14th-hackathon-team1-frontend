import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "../components/common/Header";
import { Step1 } from "../features/onboarding/components/Step1";
import { Step2 } from "../features/onboarding/components/Step2";
import { Step3 } from "../features/onboarding/components/Step3";
import { Step4 } from "../features/onboarding/components/Step4";
import { Step5 } from "../features/onboarding/components/Step5";
import { Step6 } from "../features/onboarding/components/Step6";
// import { createMember, updateFcmToken } from "../api/members";
import { createMember, updateNotificationSetting } from "../api/members";
import { getMemberId, setMemberId } from "../utils/memberSession";
//import { requestNotificationPermission } from "../utils/browserPermissions";
import { ApiError } from "../api/client";

import Logo from '../assets/images/HEY_onboarding.png'

import './OnboardingPage.css'

export const OnboardingPage = ({ onComplete }) => { 
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 현재 온보딩 페이지
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSplash, setIsSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1.5초(1500ms) 후 페이드아웃 애니메이션 시작
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1500);

    // 2.0초(2000ms) 후 스플래시 DOM 완전히 제거
    const removeTimer = setTimeout(() => {
      setIsSplash(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
  const existingMemberId = getMemberId();
  if (existingMemberId) {
    navigate('/', { replace: true });
    return;
  }
}, [navigate]);

  const [formData, setFormData] = useState({
    nickname: '',
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
    if (currentStep === 3) {
      setCurrentStep(5);
    } else if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // 이전 스텝으로 이동
  const handlePrevStep = () => {
    if (currentStep === 5) {
      setCurrentStep(3);
    } else if (currentStep > 1) {
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

  // 온보딩 완료 후 상태 업데이트 및 홈(/) 이동 처리 공통 함수
  const handleFinish = (data) => {
    if (onComplete) {
      onComplete(data);
    }
    // 온보딩 완료 후 홈으로 이동 (뒤로가기 방지를 위해 replace: true 적용)
    navigate('/', { replace: true });
  };

  // [설정 완료, 시작하기] 클릭 시 실행
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 1. 브라우저 권한 요청 및 FCM 토큰 획득
      // const fcmToken = await requestNotificationPermission();

      // 2. 멤버 생성 및 localStorage 저장
      const member = await createMember({
        nickname: formData.nickname,
        phone: formData.phoneNumber
      });
      setMemberId(member.id);

      // 3. FCM 토큰 서버 등록 (토큰이 있는 경우)
      // if (fcmToken) {
      //   const res = await updateFcmToken(member.id, fcmToken);
      //   console.log('✅ FCM 토큰 등록 성공 응답:', res); // 추가된 확인 코드
      // }

      // 4. 알림 시간 설정이 있다면 업데이트
      if (formData.settings.startTime) {
        await updateNotificationSetting(member.id, {
          notifyTime: formData.settings.startTime,
          notifyEnabled: true
        });
      }

      handleFinish(formData);
    } catch (error) {
      if (error instanceof ApiError && error.code === 'CONFLICT') {
        alert('이미 가입된 전화번호입니다.');
      } else if (error instanceof ApiError && error.code === 'VALIDATION_FAILED') {
        alert(error.fieldErrors?.[0]?.message || '입력값을 다시 확인해주세요.');
      } else {
        console.error('회원가입 에러:', error);
        alert('설정 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
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
      {isSplash && (
        <div className={`splash-overlay ${isFadingOut ? 'fade-out' : ''}`}>
          <img src={Logo} alt="HEY" className="splash-logo-img" />
        </div>
      )}

      {currentStep > 1 && (
        <Header
          title={headerTitles[currentStep]}
          onBack={handlePrevStep}
          showBack={currentStep > 1}
        />
      )}

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
                nickname={formData.nickname}
                onChangeNickname={(val) => handleUpdateFormData('nickname', val)}
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
                onSkipToHome={handleFinalSubmit}
                isSubmitting={isSubmitting}
            />
        )}

        {currentStep === 6 && (
          <Step6
            settings={formData.settings}
            onChangeSettings={(val) => handleUpdateFormData('settings', val)}
            onSubmit={handleFinalSubmit}
            onBack={handlePrevStep}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
    </div>
  );
};
