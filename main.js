gsap.registerPlugin(ScrollTrigger);

// 1. Анімація для Бургер Меню
const burgerBtn = document.querySelector('.burger-btn');
const siteHeader = document.querySelector('.site-header');
const menuTimeline = gsap.timeline({ paused: true });

menuTimeline
    .to('.menu-bg', { duration: 0.8, scaleY: 1, ease: 'power4.inOut' })
    .to('.full-screen-menu', { autoAlpha: 1, duration: 0.1 }, "-=0.8")
    .to('.menu-links a', {
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    }, "-=0.4");

let isMenuOpen = false;

burgerBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    burgerBtn.classList.toggle('active');
    
    if (isMenuOpen) {
        burgerBtn.classList.add('menu-open'); // Зробити лінії чорними на білому фоні меню
        menuTimeline.play();
    } else {
        burgerBtn.classList.remove('menu-open');
        menuTimeline.reverse();
    }
});

document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        burgerBtn.classList.remove('active');
        burgerBtn.classList.remove('menu-open');
        menuTimeline.reverse();
    });
});

// 2. Логіка Pinned секцій (Тільки перші екрани)
const fullscreenPanels = gsap.utils.toArray('.fullscreen-panel');

fullscreenPanels.forEach((panel, i) => {
    if (i < fullscreenPanels.length - 1) {
        ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            pin: true,
            pinSpacing: false
        });
    }

    const content = panel.querySelector('.gsap-reveal');
    gsap.fromTo(content, 
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1.5, ease: "power3.out",
            scrollTrigger: {
                trigger: panel,
                start: "top 60%", 
                toggleActions: "play none none reverse"
            }
        }
    );

    if (i < fullscreenPanels.length - 1) {
        gsap.to(panel.querySelector('.bg-overlay'), {
            background: "rgba(0, 0, 0, 0.8)",
            scrollTrigger: {
                trigger: fullscreenPanels[i + 1],
                start: "top bottom",
                end: "top top",
                scrub: true
            }
        });
    }
});

// 3. ЗМІНА КОЛЬОРУ ХЕДЕРА НА СВІТЛИХ СЕКЦІЯХ (Надійний метод)
// Ми визначаємо секцію .split-section як тригер. Коли вона досягає верху, хедер стає світлим.
ScrollTrigger.create({
    trigger: ".split-section", 
    start: "top 80px", // Коли верх світлої секції доходить до хедера
    end: "max", // Тримає до кінця сторінки
    onEnter: () => siteHeader.classList.add('scrolled-light'),
    onLeaveBack: () => siteHeader.classList.remove('scrolled-light')
});

// 4. Анімація появи (Fade Up) для решти секцій (Split, Masonry, Контакти)
const fadeUpElements = gsap.utils.toArray('.fade-up');

fadeUpElements.forEach(element => {
    gsap.fromTo(element, 
        { y: 60, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%", // Анімація почнеться, коли елемент з'явиться в полі зору
                toggleActions: "play none none none" 
            }
        }
    );
});

// 5. Анімація FAQ Акордеону (GSAP)
const faqItems = document.querySelectorAll('.faq-item');
let activeItem = null; // Зберігаємо поточний відкритий елемент

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    // Початковий стан: висота 0, прозорість 0
    gsap.set(answer, { height: 0, opacity: 0 });

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Якщо є відкритий елемент і це не той, на який щойно клікнули — закриваємо його
        if (activeItem && activeItem !== item) {
            activeItem.classList.remove('active');
            gsap.to(activeItem.querySelector('.faq-answer'), { 
                duration: 0.5, 
                height: 0, 
                opacity: 0, 
                ease: 'power3.inOut' 
            });
            // Повертаємо іконку хрестика назад у плюс
            gsap.to(activeItem.querySelector('.faq-icon'), { 
                rotation: 0, 
                duration: 0.4, 
                ease: 'power2.inOut' 
            });
        }

        // Логіка для поточного елемента
        if (!isOpen) {
            // Відкриваємо
            item.classList.add('active');
            gsap.to(answer, { 
                duration: 0.6, 
                height: 'auto', 
                opacity: 1, 
                ease: 'power3.out' 
            });
            // Крутимо іконку на 45 градусів (плюс стає хрестиком)
            gsap.to(icon, { 
                rotation: 45, 
                duration: 0.4, 
                ease: 'power2.inOut' 
            });
            activeItem = item;
        } else {
            // Закриваємо поточний (якщо клікнули по ньому ж)
            item.classList.remove('active');
            gsap.to(answer, { 
                duration: 0.5, 
                height: 0, 
                opacity: 0, 
                ease: 'power3.inOut' 
            });
            gsap.to(icon, { 
                rotation: 0, 
                duration: 0.4, 
                ease: 'power2.inOut' 
            });
            activeItem = null;
        }
    });
});