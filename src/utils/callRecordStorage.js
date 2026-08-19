const STORAGE_KEY = 'wellcall_call_records';
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};

const formatDateLabel = (date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAY_LABELS[date.getDay()]})`;
};

/**
 * localStorage에 저장된 통화 기반 건강 기록 전체를 가져옵니다. (최신순)
 */
export const getStoredCallRecords = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * id로 저장된 기록 하나를 조회합니다.
 */
export const getStoredCallRecordById = (id) => getStoredCallRecords().find((record) => record.id === id);

/**
 * id로 저장된 기록 하나를 삭제합니다.
 */
export const deleteStoredCallRecord = (id) => {
  const updated = getStoredCallRecords().filter((record) => record.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * 통화 중 얻은 질문/답변 목록을 건강 기록 형태로 변환해 localStorage에 추가합니다.
 * @param {{category: string, question: string, answer: string}[]} qnaEntries
 */
export const saveCallRecordsFromQna = (qnaEntries) => {
  const now = new Date();
  const newRecords = qnaEntries
    .filter((entry) => entry.answer && entry.answer.trim().length > 0)
    .map((entry, index) => ({
      id: `call-${now.getTime()}-${index}`,
      category: entry.category,
      content: entry.answer.trim(),
      date: formatDate(now),
      dateLabel: formatDateLabel(now),
      confidence: entry.answer.trim().length < 6 ? '확인 필요' : '보통',
      confidenceNote: 'AI 안부 전화 실시간 음성 인식으로 추출됨',
      question: entry.question,
      answer: entry.answer.trim()
    }));

  if (newRecords.length === 0) return getStoredCallRecords();

  const updated = [...newRecords, ...getStoredCallRecords()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
