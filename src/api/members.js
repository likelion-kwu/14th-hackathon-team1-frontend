import { apiRequest } from './client';

// 회원 가입 (닉네임, 전화번호) 
export const createMember = ({ nickname, phone }) =>
  apiRequest('/api/members', { method: 'POST', body: { nickname, phone } });

// 회원 정보 조회
export const getMember = (memberId) => apiRequest(`/api/members/${memberId}`);

// 알림 설정(매일 먼저 연락할 시각, 알림 사용 여부) 변경 — 두 값을 항상 함께 보냄
export const updateNotificationSetting = (memberId, { notifyTime, notifyEnabled }) =>
  apiRequest(`/api/members/${memberId}/notification`, {
    method: 'PATCH',
    body: { notifyTime, notifyEnabled }
  });

// FCM 푸시 토큰 등록/교체
export const updateFcmToken = (memberId, fcmToken) =>
  apiRequest(`/api/members/${memberId}/fcm-token`, {
    method: 'PUT',
    body: { fcmToken }
  });

// 연속 대화 기록(스트릭) 조회
export const getStreak = (memberId) => apiRequest(`/api/members/${memberId}/streak`);
