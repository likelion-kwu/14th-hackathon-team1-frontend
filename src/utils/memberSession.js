const MEMBER_ID_KEY = 'wellcall_member_id';

/** 가입 시 발급받은 memberId를 가져옵니다. 없으면 null. */
export const getMemberId = () => {
  const stored = localStorage.getItem(MEMBER_ID_KEY);
  return stored ? Number(stored) : null;
};

/** 가입 응답의 id를 저장합니다. 이후 모든 API 요청에 이 값을 씁니다. */
export const setMemberId = (id) => {
  localStorage.setItem(MEMBER_ID_KEY, String(id));
};

export const clearMemberId = () => {
  localStorage.removeItem(MEMBER_ID_KEY);
};
