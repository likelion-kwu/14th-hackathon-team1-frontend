import { apiRequest } from './client';

// 대화 시작 (오늘 진행 중인 대화가 있으면 그 대화를 반환) 
export const startConversation = (memberId, type = 'CHAT') =>
  apiRequest('/api/conversations', { method: 'POST', body: { memberId, type } });

// 대화 목록 조회 (date 생략 시 전체 최신순) 
export const getConversations = (memberId, date) =>
  apiRequest('/api/conversations', { params: { memberId, date } });

// 대화 상세 조회
export const getConversation = (conversationId) => apiRequest(`/api/conversations/${conversationId}`);

// 대화 메시지 목록 조회 (sequenceNo 오름차순)
export const getMessages = (conversationId) => apiRequest(`/api/conversations/${conversationId}/messages`);

// 사용자 발화 전송 → 저장된 사용자 메시지 + AI 응답 메시지를 함께 반환 
export const sendMessage = (conversationId, content) =>
  apiRequest(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: { content }
  });

// 대화 종료 (이미 종료된 대화에 다시 보내도 안전)
export const completeConversation = (conversationId) =>
  apiRequest(`/api/conversations/${conversationId}/complete`, { method: 'PATCH' });
