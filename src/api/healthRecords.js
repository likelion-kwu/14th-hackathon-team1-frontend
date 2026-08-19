import { apiRequest } from './client';

// 오늘(KST)의 건강 기록 전체 조회 
export const getTodayHealthRecords = (memberId) =>
  apiRequest('/api/health-records/today', { params: { memberId } });

// 기간 건강 기록 조회 (from/to 생략 시 최근 7일) — 백엔드 구현 전, 현재는 고정 예시를 반환
export const getHealthRecordsRange = (memberId, from, to) =>
  apiRequest('/api/health-records', { params: { memberId, from, to } });

// 건강 기록 확인 처리 (status → CONFIRMED) — 백엔드 구현 전, 현재는 고정 예시를 반환
export const confirmHealthRecord = (healthRecordId) =>
  apiRequest(`/api/health-records/${healthRecordId}/confirm`, { method: 'PATCH' });
