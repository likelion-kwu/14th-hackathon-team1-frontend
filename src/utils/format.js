export const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // 숫자만 추출
  const cleaned = phone.replace(/[^0-9]/g, '');

  // 11자리 (010-xxxx-xxxx)
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-****-${cleaned.slice(7)}`;
  }
  // 10자리 (010-xxx-xxxx 또는 지역번호)
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-***-${cleaned.slice(6)}`;
  }

  // 하이픈이 이미 포함된 일반적인 형식 대체
  return phone.replace(/^(\d{3})-?(\d{3,4})-?(\d{4})$/, '$1-****-$3');
};