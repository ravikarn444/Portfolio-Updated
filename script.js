document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate hamburger to X (optional enhancement)
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });


    // --- 2. Sticky Navigation on Scroll ---
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- 3. Scroll Animations (Intersection Observer) ---
    // Select all elements that have a fade-in class
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');

    const observerOptions = {
        root: null, // use the viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If element is in view, add the 'visible' class
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // Trigger initial hero animation manually for elements already in viewport
    setTimeout(() => {
        document.querySelectorAll('.hero-content.fade-in-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // --- 4. Smooth Scrolling for Anchor Links (Fallback if CSS scroll-behavior fails) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Skip if target is just '#'
            if (targetId === '#') return;

            e.preventDefault();

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust for fixed header height
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Adjust detection offset (e.g. 1/3 of screen height)
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current) && current !== '') {
                item.classList.add('active');
            }
        });
    });

    // --- 6. Software Icon Upload Preview ---
    const uploadInputs = document.querySelectorAll('.slot-upload-input');

    uploadInputs.forEach(input => {
        input.addEventListener('change', function (e) {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                const slot = this.closest('.software-slot');
                const previewContainer = slot.querySelector('.preview-container');
                const nameSpan = slot.querySelector('.software-name');

                reader.onload = function (event) {
                    // Create image element or replace existing
                    let img = previewContainer.querySelector('img');
                    if (!img) {
                        img = document.createElement('img');
                        img.className = 'software-icon';
                        img.style.objectFit = 'contain';

                        // Hide the plus icon
                        const plusIcon = previewContainer.querySelector('.upload-icon');
                        if (plusIcon) plusIcon.style.display = 'none';

                        previewContainer.appendChild(img);
                    }
                    img.src = event.target.result;

                    // Update name to file name (without extension)
                    let fileName = file.name.split('.').slice(0, -1).join('.');
                    if (fileName.length > 12) {
                        fileName = fileName.substring(0, 10) + '...';
                    }
                    nameSpan.textContent = fileName;

                    // Modify slot style
                    slot.classList.remove('upload-slot');
                    slot.style.border = '1px solid var(--glass-border)';
                    slot.style.background = 'var(--glass-bg)';
                }

                reader.readAsDataURL(file);
            }
        });
    });

    // --- 7. Modal Logic for Designs & Videos ---
    const portfolioItems = document.querySelectorAll('.portfolio-item:not(.upload-design-slot):not(.upload-slot)');
    const modal = document.getElementById('design-modal');
    
    if (modal) {
        const modalImg = document.getElementById('modal-image');
        const modalLink = document.getElementById('modal-link');
        const closeModal = document.querySelector('.close-modal');
        const imgContainer = document.querySelector('.modal-image-container');

        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const linkUrl = item.getAttribute('data-link') || '#';

                // Try to get image from the card's <img> tag first, then fall back to data-image
                const cardImg = item.querySelector('img');
                const imgSrc = cardImg ? cardImg.src : item.getAttribute('data-image');

                modalLink.href = linkUrl;

                if (imgSrc) {
                    modalImg.src = imgSrc;
                    modalImg.style.display = 'block';
                    imgContainer.style.background = 'transparent';
                } else {
                    modalImg.style.display = 'none';
                    const computedStyle = window.getComputedStyle(item);
                    imgContainer.style.background = computedStyle.background;
                }

                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeFunc = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        };

        closeModal.addEventListener('click', closeFunc);

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeFunc(e);
            }
        });
    }

    // --- 8. Portfolio Grid Image Uploads ---
    const gridUploadInputs = document.querySelectorAll('.design-upload-input');

    gridUploadInputs.forEach(input => {
        input.addEventListener('change', function (e) {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                const slot = this.closest('.upload-design-slot');
                const content = slot.querySelector('.portfolio-upload-content');

                reader.onload = function (event) {
                    // Create image element or replace existing
                    let img = slot.querySelector('img.uploaded-bg');
                    if (!img) {
                        img = document.createElement('img');
                        img.className = 'uploaded-bg';
                        img.style.position = 'absolute';
                        img.style.top = '0';
                        img.style.left = '0';
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        img.style.zIndex = '0';
                        img.style.borderRadius = '20px'; // Match portfolio-item
                        slot.insertBefore(img, slot.firstChild);
                    }
                    img.src = event.target.result;

                    // Hide the icon/text but keep it accessible for clicking again
                    if (content) {
                        content.style.opacity = '0';
                        // Add hover effect to show it's still clickable
                        slot.addEventListener('mouseenter', () => content.style.opacity = '1');
                        slot.addEventListener('mouseleave', () => content.style.opacity = '0');
                        
                        // Add dark overlay so text is readable on hover
                        content.style.position = 'relative';
                        content.style.zIndex = '1';
                        content.style.background = 'rgba(10, 10, 15, 0.7)';
                        content.style.padding = '1rem';
                        content.style.borderRadius = '10px';
                    }

                    // Remove dashed border
                    slot.style.border = 'none';
                }

                reader.readAsDataURL(file);
            }
        });
    });

});
