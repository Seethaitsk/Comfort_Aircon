/**
 * Comfort Aircon - HVAC & Air Conditioning Web Application JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const mainNav = document.getElementById('mainNav');
    const backToTopBtn = document.getElementById('backToTop');
    const estServiceSelect = document.getElementById('estService');
    const estPricePreview = document.getElementById('estPricePreview');
    const estimateForm = document.getElementById('estimateForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const modalAppointmentForm = document.getElementById('modalAppointmentForm');
    const actionToast = document.getElementById('actionToast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Initialize Bootstrap Toast
    let toastInstance = null;
    if (actionToast && typeof bootstrap !== 'undefined') {
        toastInstance = new bootstrap.Toast(actionToast);
    }

    function showNotification(msg) {
        if (toastMessage) {
            toastMessage.textContent = msg;
        }
        if (toastInstance) {
            toastInstance.show();
        } else {
            alert(msg);
        }
    }

    // 1. Sticky Navbar & Back to Top Scroll listener
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 2. Dynamic Price Calculator Preview in Estimate Form
    const servicePrices = {
        'ac-repair': '₹999 Diagnostics (Free with repair)',
        'ac-maintenance': '₹1,499 Seasonal AC Service & Gas Check',
        'new-hvac': 'Starting at ₹25,000 Installed',
        'duct': '₹1,999 Full Duct Inspection & Sanitize',
        'thermostat': '₹1,299 Smart Thermostat + Setup'
    };

    if (estServiceSelect && estPricePreview) {
        estServiceSelect.addEventListener('change', (e) => {
            const selectedVal = e.target.value;
            if (servicePrices[selectedVal]) {
                estPricePreview.textContent = servicePrices[selectedVal];
            }
        });
    }

    // 3. Form Submission Handlers
    if (estimateForm) {
        estimateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('estName').value;
            showNotification(`Thank you ${name}! Your estimate request has been sent. Our team will call you within 15 mins.`);
            estimateForm.reset();
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            showNotification(`Subscribed successfully! HVAC advice sent to ${emailInput.value}`);
            newsletterForm.reset();
        });
    }

    if (modalAppointmentForm) {
        modalAppointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification(`Appointment booked successfully! We will confirm your time slot shortly.`);
            const modalEl = document.getElementById('appointmentModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }
            modalAppointmentForm.reset();
        });
    }

    // 4. Smooth Scroll for Navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.getElementById('hvacNavbarNav');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) bsCollapse.hide();
                    }

                    const navHeight = mainNav ? mainNav.offsetHeight : 70;
                    const targetPosition = targetElem.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 5. Product Category Filter Logic
    const filterBtns = document.querySelectorAll('.product-filter-btn');
    const productItems = document.querySelectorAll('.product-item');

    if (filterBtns.length > 0 && productItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                productItems.forEach(item => {
                    const category = item.getAttribute('data-category') || '';
                    if (filter === 'all' || category.includes(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 5. Hero Interactive Climate Mode Selector
    const modePills = document.querySelectorAll('.hero-mode-pill');
    const heroWidgetIcon = document.getElementById('heroWidgetIcon');
    const heroWidgetBadge = document.getElementById('heroWidgetBadge');
    const heroWidgetText = document.getElementById('heroWidgetText');

    const modeData = {
        'cool': {
            icon: 'fa-solid fa-snowflake fa-spin-pulse',
            badge: 'Rapid Chill Active',
            text: '18°C • Turbo Cooling',
            badgeClass: 'badge-soft-blue'
        },
        'optimal': {
            icon: 'fa-solid fa-wind fa-bounce',
            badge: 'Optimal Climate',
            text: '21°C • Balanced Breeze',
            badgeClass: 'badge-soft-blue'
        },
        'eco': {
            icon: 'fa-solid fa-leaf fa-pulse',
            badge: 'Air Purification',
            text: '100% HEPA Air Fresh',
            badgeClass: 'badge-soft-success'
        }
    };

    if (modePills.length > 0) {
        modePills.forEach(pill => {
            pill.addEventListener('click', () => {
                modePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const mode = pill.getAttribute('data-mode');
                if (modeData[mode] && heroWidgetText) {
                    heroWidgetIcon.className = modeData[mode].icon;
                    heroWidgetBadge.className = `${modeData[mode].badgeClass} d-block mb-1`;
                    heroWidgetBadge.style.cssText = 'font-size: 0.7rem; padding: 2px 8px;';
                    heroWidgetBadge.textContent = modeData[mode].badge;
                    heroWidgetText.textContent = modeData[mode].text;
                }
            });
        });
    }
});
