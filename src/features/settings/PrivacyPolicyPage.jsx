import './PrivacyPolicyPage.css';

const PRIVACY_SECTIONS = [
  {
    id: 1,
    title: '수집하는 정보',
    subLabel: '안부 안내',
    bullets: [
      '음성 통화 기록 및 전사본',
      '자동 생성된 수면, 식사, 운동, 피부 기록'
    ]
  },
  {
    id: 2,
    title: '수집 목적',
    subLabel: '안부 안내',
    bullets: [
      '정기 안부 전화 제공',
      '사용자 건강 기록 자동 생성',
      '생활 패턴 분석 및 피드백 제공'
    ]
  },
  {
    id: 3,
    title: '데이터 보관 기간',
    subLabel: '안부 안내',
    bullets: [
      '음성 녹음 및 전사: 삭제 요청 시까지 보관',
      '자동 생성 건강 기록: 최근 3년 보관'
    ]
  },
  {
    id: 4,
    title: '데이터 삭제 방법',
    subLabel: '안부 안내',
    bullets: [
      '특정 기록: 기록 상세 화면의 삭제 버튼으로 요청',
      '음성 전사: 설정 > 데이터 열람 및 삭제 메뉴에서 전체 삭제 요청'
    ]
  },
  {
    id: 5,
    title: '제3자 공개 금지',
    subLabel: '안부 안내',
    bullets: [
      '개인정보는 동의 없이 제3자에게 제공되지 않습니다.',
      '친구 안전망 공유 동의 시 사전 지정된 항목만 공유됩니다.'
    ]
  },
  {
    id: 6,
    title: '의료 진단이 아닙니다',
    subLabel: '안부 안내',
    bullets: [
      '이 서비스는 의료진단을 제공하지 않습니다.',
      '건강 우려 신호가 감지될 경우 전문 의료기관의 상담을 권장합니다.'
    ]
  },
  {
    id: 7,
    title: '개인정보 요청 및 이의 제기',
    subLabel: '안부 안내',
    bullets: [
      '자신의 데이터 열람 요청: 설정 > 데이터 열람 및 삭제',
      '삭제 요청: 각 기록 상세 또는 데이터 관리 메뉴 이용'
    ]
  }
];

export const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-page-container">
      <main className="privacy-page-content">
        {/* 상단 타이틀 영역 */}
        <section className="privacy-header-section">
          <h2 className="privacy-main-title">개인정보 처리 방침</h2>
          <p className="privacy-main-desc">
            안부 서비스는 사용자 동의하에 건강 기록을 수집하며, 투명한 정책으로 운영됩니다.
          </p>
        </section>

        {/* 정책 카드 리스트 */}
        <section className="privacy-card-list">
          {PRIVACY_SECTIONS.map((section) => (
            <div key={section.id} className="privacy-policy-card">
              <h3 className="policy-card-title">{section.title}</h3>
              {/* <span className="policy-sub-label">{section.subLabel}</span> */}
              
              <ul className="policy-bullet-list">
                {section.bullets.map((bullet, idx) => (
                  <li key={idx} className="policy-bullet-item">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* 하단 고지 정보 */}
        <footer className="privacy-page-footer">
          <p className="footer-update-text">마지막 업데이트: 2026년 1월</p>
          <p className="footer-notice-text">정책 변경 시 설정 화면에서 사전 안내됩니다.</p>
        </footer>
      </main>
    </div>
  );
};