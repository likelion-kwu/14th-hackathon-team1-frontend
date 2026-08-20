import { Button } from '../../../components/common/Button'
import Logo from '../../../assets/images/HEY_onboarding.png'
import './Step1.css'

export const Step1 = ({onNext}) => {
    return(
        <div className='step1-container'>
            <div className='step1-image-box'>
                <img className='step1-logo' src={ Logo } alt='안부 일러스트'/>
            </div>

            <div className="step1-title-group">
                <p className="step1-subtitle">
                매일 한 통의 전화가 나의 건강 기록이 됩니다
                </p>
            </div>

            <div className="step1-feature-list">
                <div className="step1-feature-item">
                    <div className="feature-icon">📞</div>
                    <div className="feature-text-group">
                        <h3 className="feature-title">AI 안부 전화</h3>
                        <p className="feature-desc">
                        설정한 시간에 AI가 먼저 전화를 걸어 안부를 묻습니다
                        </p>
                    </div>
                </div>

                <div className="step1-feature-item">
                    <div className="feature-icon">📋</div>
                    <div className="feature-text-group">
                        <h3 className="feature-title">자동 건강 기록</h3>
                        <p className="feature-desc">
                        대화 내용이 수면·식사·운동·피부 기록으로 자동 저장됩니다
                        </p>
                    </div>
                </div>

                <div className="step1-feature-item">
                    <div className="feature-icon">🔐</div>
                    <div className="feature-text-group">
                        <h3 className="feature-title">내 데이터는 내가 관리</h3>
                        <p className="feature-desc">
                        기록 열람, 수정, 삭제를 언제든 직접 할 수 있습니다
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. 하단 고지사항 및 시작하기 버튼 */}
            <div className="step1-footer">
                <p className="step1-disclaimer">
                이 서비스는 의료 진단 서비스가 아닙니다
                </p>
                <Button onClick={onNext}>시작하기</Button>
            </div>
        </div>
    )
}