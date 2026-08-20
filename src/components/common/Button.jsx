import './Button.css'

/**
 * 공통 버튼 컴포넌트
 * @param {Object} props
 * @param {React.ReactNode} props.children - 버튼 내부 텍스트 및 요소
 * @param {'black' | 'white' | 'red' | 'link'} [props.variant='black'] - 버튼 배경 및 스타일 (검정, 흰색, 빨강, 텍스트 링크)
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - 버튼 타입
 * @param {boolean} [props.fullWidth=true] - 너비 100% 채움 여부
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 * @param {Function} [props.onClick] - 클릭 이벤트 핸들러
 * @param {string} [props.className=''] - 추가 CSS 클래스명
 */

export const Button = ({
  children,
  variant = 'black',
  type = 'button',
  fullWidth = true,
  disabled = false,
  onClick,
  className = ''
}) => {
  // variant 종류: 'black' | 'white' | 'red' | 'link'(밑줄 텍스트 링크)
  const buttonClasses = [
    'common-btn',
    `btn-${variant}`,
    variant === 'link' ? 'btn-auto' : (fullWidth ? 'btn-full' : 'btn-auto'),
    disabled ? 'btn-disabled' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};