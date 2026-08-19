export const API_BASE_URL = 'http://52.79.79.220:8080';


 // 백엔드 공통 실패 응답을 담는 에러 객체
export class ApiError extends Error {
  constructor(code, message, fieldErrors) {
    super(message || '요청 처리 중 오류가 발생했습니다.');
    this.name = 'ApiError';
    this.code = code;
    this.fieldErrors = fieldErrors || [];
  }
}

const buildUrl = (path, params) => {
  const url = new URL(API_BASE_URL + path);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
};


// 성공 시 data 를 그대로 반환하고, 실패 시 ApiError 를 throw 합니다.
 
export const apiRequest = async (path, { method = 'GET', body, params } = {}) => {
  const res = await fetch(buildUrl(path, params), {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const json = await res.json();

  if (!json.success) {
    throw new ApiError(json.error?.code, json.error?.message, json.error?.fieldErrors);
  }
  return json.data;
};
