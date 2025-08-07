// 滚动动画控制器
class ScrollAnimationController {
    constructor() {
        this.animatedElements = document.querySelectorAll('.scroll-animate');
        this.init();
    }

    init() {
        // 创建交叉观察器
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // 观察所有需要动画的元素
        this.animatedElements.forEach(element => {
            this.observer.observe(element);
        });

        // 添加其他交互效果
        this.addInteractiveEffects();
    }

    addInteractiveEffects() {
        // 按钮波纹效果
        const rippleButtons = document.querySelectorAll('.btn-ripple');
        rippleButtons.forEach(button => {
            button.addEventListener('click', this.createRipple);
        });

        // 标题悬浮效果
        const titleElements = document.querySelectorAll('.title-underline');
        titleElements.forEach(title => {
            title.addEventListener('mouseenter', () => {
                title.style.transform = 'translateX(5px)';
            });
            title.addEventListener('mouseleave', () => {
                title.style.transform = 'translateX(0)';
            });
        });

        // 卡片3D倾斜效果
        const cards = document.querySelectorAll('.achievement-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', this.handleCardTilt);
            card.addEventListener('mouseleave', this.resetCardTilt);
        });
    }

    createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleCardTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }

    resetCardTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// 页面加载完成后初始化动画控制器
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimationController();
    
    // 添加页面加载动画
    document.body.classList.add('page-loaded');
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// 添加CSS动画关键帧
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .page-loaded {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);