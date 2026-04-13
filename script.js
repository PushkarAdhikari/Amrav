
/* ── THEME ── */
var htmlEl = document.documentElement;
document.getElementById('themeToggle').addEventListener('click', function () {
    var next = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('asa-theme', next);
});

/* ── MOBILE MENU ── */
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');
var mobileClose = document.getElementById('mobileClose');

function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', function () {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});
mobileClose.addEventListener('click', closeMenu);

document.querySelectorAll('.m-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
});

/* ── SCROLL REVEAL ── */
var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
});

/* ── FORM ── */
var submitBtn = document.getElementById('submitBtn');
var contactName = document.getElementById('contactName');
var contactPhone = document.getElementById('contactPhone');
var contactEmail = document.getElementById('contactEmail');
var contactSport = document.getElementById('contactSport');
var contactMessage = document.getElementById('contactMessage');

if (submitBtn) {
    submitBtn.addEventListener('click', function () {
        var name = contactName ? contactName.value.trim() : '';
        var phone = contactPhone ? contactPhone.value.trim() : '';
        var email = contactEmail ? contactEmail.value.trim() : '';
        var sport = contactSport ? contactSport.value.trim() : '';
        var message = contactMessage ? contactMessage.value.trim() : '';

        if (!name || !phone || !email || !sport) {
            this.textContent = 'Please fill all required fields';
            this.style.background = '#b42318';

            var errorBtn = this;
            setTimeout(function () {
                errorBtn.textContent = 'Book Free Trial ->';
                errorBtn.style.background = '';
            }, 2500);
            return;
        }

        var subject = 'New Free Trial Request - ' + name;
        var bodyLines = [
            'New enquiry from the Amrav Sports Academy website:',
            '',
            'Full Name: ' + name,
            'Phone Number: ' + phone,
            'Email Address: ' + email,
            'Sport of Interest: ' + sport,
            'Message: ' + (message || 'N/A')
        ];

        var mailtoUrl = 'mailto:info@amravsports.com?subject=' +
            encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(bodyLines.join('\n'));

        window.location.href = mailtoUrl;

        this.textContent = 'Opening your email app...';
        this.style.background = '#1A7A3C';

        var btn = this;
        setTimeout(function () {
            btn.textContent = 'Book Free Trial ->';
            btn.style.background = '';
        }, 3000);
    });
}

/* ── TESTIMONIALS CAROUSEL ── */
var testiGrid = document.querySelector('.testi-grid');
var btnPrev = document.getElementById('testiPrev');
var btnNext = document.getElementById('testiNext');
var autoSlide;
var isTransitioning = false;

if (testiGrid && testiGrid.children.length > 0) {
    function getGap() {
        return parseFloat(getComputedStyle(testiGrid).gap) || 24;
    }

    function slideNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        var cardOffset = testiGrid.firstElementChild.offsetWidth;
        var gap = getGap();
        
        testiGrid.style.transition = 'transform 0.6s ease-in-out';
        testiGrid.style.transform = 'translateX(-' + (cardOffset + gap) + 'px)';

        setTimeout(function () {
            testiGrid.style.transition = 'none';
            testiGrid.appendChild(testiGrid.firstElementChild);
            testiGrid.style.transform = 'translateX(0)';
            
            // Allow CSS to apply
            void testiGrid.offsetWidth;
            isTransitioning = false;
        }, 600);
    }

    function slidePrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        var cardOffset = testiGrid.firstElementChild.offsetWidth;
        var gap = getGap();
        
        testiGrid.style.transition = 'none';
        testiGrid.insertBefore(testiGrid.lastElementChild, testiGrid.firstElementChild);
        testiGrid.style.transform = 'translateX(-' + (cardOffset + gap) + 'px)';

        // Force reflow
        void testiGrid.offsetWidth;

        testiGrid.style.transition = 'transform 0.6s ease-in-out';
        testiGrid.style.transform = 'translateX(0)';

        setTimeout(function () {
            isTransitioning = false;
        }, 600);
    } // match transition time

    if (btnNext) {
        btnNext.addEventListener('click', function () {
            clearInterval(autoSlide);
            slideNext();
            startAutoSlide();
        });
    }
    
    if (btnPrev) {
        btnPrev.addEventListener('click', function () {
            clearInterval(autoSlide);
            slidePrev();
            startAutoSlide();
        });
    }

    function startAutoSlide() {
        autoSlide = setInterval(slideNext, 5000);
    }
    
    startAutoSlide();
}
