
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
const contactBotTrap = document.getElementById("websiteField");

if (submitBtn) {
    contactPhone.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9+]/g, '').slice(0, 13);
    });

    submitBtn.addEventListener("click", async function () {
        if (contactBotTrap.value) {
            return;
        }
        if (!contactName.value.trim() || !contactPhone.value.trim() || !contactEmail.value.trim()) {
            alert("Please fill required fields");
            return;
        }

        var phoneVal = contactPhone.value.trim();
        if (phoneVal.replace(/[^0-9]/g, '').length < 10) {
            alert("Please enter a valid phone number");
            return;
        }

        this.innerText = "Sending...";
        this.disabled = true;

        try {
            await fetch("https://script.google.com/macros/s/AKfycbzl2GlR_d33GNnsQrmxjJDPY98gu_3NrkwzVd-VhgC234EQqp1aBKFDVbmn51wLTs1OBA/exec", {
                method: "POST",
                body: JSON.stringify({
                    name: contactName.value.trim(),
                    phone: phoneVal,
                    email: contactEmail.value.trim(),
                    sport: contactSport.value.trim(),
                    message: contactMessage.value.trim(),
                    token: "AMRAV@Sports#Lead2026"
                }),
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                }
            });

            alert("Enquiry Sent Successfully!");

            contactName.value = "";
            contactPhone.value = "";
            contactEmail.value = "";
            contactSport.value = "";
            contactMessage.value = "";

        } catch (error) {
            alert("Failed to send enquiry.");
        }

        this.innerText = "Book Free Trial →";
        this.disabled = false;

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
