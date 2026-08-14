import './Header.css';

export const Header = ({ title, onBack, showBack = true }) => {
  return (
    <header className="common-header">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="header-back-btn"
          aria-label="뒤로가기"
        >
          &lt;
        </button>
      )}
      {title && <h1 className="header-title">{title}</h1>}
    </header>
  );
};