
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

/* ── GALLERY ── */
var galleryGrid = document.getElementById('galleryGrid');

if (galleryGrid) {
    var galleryItems = Array.prototype.slice.call(galleryGrid.querySelectorAll('.gallery-item'));
    var filterButtons = document.querySelectorAll('.gallery-filter');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var currentIndex = 0;

    function visibleItems() {
        return galleryItems.filter(function (el) {
            return !el.classList.contains('hidden');
        });
    }

    function renderLightbox(list) {
        list = list || visibleItems();
        if (!list.length) return;
        if (currentIndex < 0) currentIndex = list.length - 1;
        if (currentIndex >= list.length) currentIndex = 0;
        var item = list[currentIndex];
        var img = item.querySelector('img');
        var caption = item.querySelector('figcaption');
        lightboxImg.src = img.getAttribute('src');
        lightboxImg.alt = img.getAttribute('alt') || '';
        lightboxCaption.textContent = caption ? caption.textContent : '';
    }

    function openLightbox(item) {
        var list = visibleItems();
        currentIndex = list.indexOf(item);
        if (currentIndex < 0) currentIndex = 0;
        renderLightbox(list);
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function stepLightbox(dir) {
        var list = visibleItems();
        if (!list.length) return;
        currentIndex += dir;
        renderLightbox(list);
    }

    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            openLightbox(item);
        });
    });

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = btn.getAttribute('data-filter');
            filterButtons.forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            galleryItems.forEach(function (item) {
                var match = filter === 'all' || item.getAttribute('data-category') === filter;
                item.classList.toggle('hidden', !match);
                if (match) item.classList.add('visible');
            });
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        stepLightbox(-1);
    });
    lightboxNext.addEventListener('click', function (e) {
        e.stopPropagation();
        stepLightbox(1);
    });
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') stepLightbox(-1);
        if (e.key === 'ArrowRight') stepLightbox(1);
    });
}
