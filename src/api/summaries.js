import { apiRequest } from './client';

// 일일 대화 요약 조회 (date 생략 시 오늘)
export const getDailySummary = (memberId, date) =>
  apiRequest('/api/summaries/daily', { params: { memberId, date } });

// 주간 대화 요약 조회 (periodStart 생략 시 이번 주 월요일)
export const getWeeklySummary = (memberId, periodStart) =>
  apiRequest('/api/summaries/weekly', { params: { memberId, periodStart } });

// 월간 대화 요약 조회 (periodStart 생략 시 이번 달 1일)
export const getMonthlySummary = (memberId, periodStart) =>
  apiRequest('/api/summaries/monthly', { params: { memberId, periodStart } });

// 종합 리포트 조회 (회원당 1건)
export const getOverallReport = (memberId) => apiRequest('/api/summaries/overall', { params: { memberId } });

// 종합 리포트 생성 또는 갱신 요청
export const generateOverallReport = (memberId) =>
  apiRequest('/api/ai-analyses/overall-report', { method: 'POST', params: { memberId } });

// AI 분석 작업 상태 조회 (status 가 SUCCESS 가 되면 관련 결과 조회 API 에 데이터가 있음)
export const getAiAnalysisStatus = (conversationId, taskType) =>
  apiRequest('/api/ai-analyses', { params: { conversationId, taskType } });
