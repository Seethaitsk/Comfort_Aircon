/**
 * Comfort Aircon - HVAC & Air Conditioning Web Application JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const mainNav = document.getElementById('mainNav');
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

    // 1. Sticky Navbar Scroll listener
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // 2. Dynamic Price & Solution Preview in Estimate Form
    const servicePrices = {
        'split-ac': 'Official Inverter Split Solutions',
        'vrf-system': 'Toshiba Commercial VRF Engineering',
        'cassette-ac': 'Architectural Ceiling Cassette Systems',
        'ductable-ac': 'Concealed Ductable HVAC Integration',
        'bulk-sales': 'Turnkey Enterprise HVAC Proposals'
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
            showNotification(`Thank you ${name}! Your HVAC consultation request has been submitted. Our engineering team will contact you shortly.`);
            estimateForm.reset();
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            showNotification(`Subscribed successfully! Engineering insights and HVAC updates will be sent to ${emailInput.value}`);
            newsletterForm.reset();
        });
    }

    if (modalAppointmentForm) {
        modalAppointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification(`Consultation requested successfully! Our HVAC specialist will confirm your schedule shortly.`);
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

    // 5. Product Category Filter & 3-Card Slider Logic
    const filterBtns = document.querySelectorAll('.product-filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const productSliderWrapper = document.querySelector('.product-slider-wrapper');
    const productPrevBtn = document.getElementById('productPrevBtn');
    const productNextBtn = document.getElementById('productNextBtn');

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

                if (productSliderWrapper) {
                    productSliderWrapper.scrollTo({ left: 0, behavior: 'smooth' });
                }
            });
        });
    }

    if (productSliderWrapper && productPrevBtn && productNextBtn) {
        const getStep = () => {
            const visibleItem = productSliderWrapper.querySelector('.product-item:not([style*="display: none"])');
            return visibleItem ? visibleItem.offsetWidth + 24 : productSliderWrapper.clientWidth / 3;
        };

        const slideNext = () => {
            const maxScroll = productSliderWrapper.scrollWidth - productSliderWrapper.clientWidth;
            if (productSliderWrapper.scrollLeft >= maxScroll - 15) {
                productSliderWrapper.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                productSliderWrapper.scrollBy({ left: getStep(), behavior: 'smooth' });
            }
        };

        const slidePrev = () => {
            if (productSliderWrapper.scrollLeft <= 15) {
                productSliderWrapper.scrollTo({ left: productSliderWrapper.scrollWidth, behavior: 'smooth' });
            } else {
                productSliderWrapper.scrollBy({ left: -getStep(), behavior: 'smooth' });
            }
        };

        productNextBtn.addEventListener('click', slideNext);
        productPrevBtn.addEventListener('click', slidePrev);

        // Auto-moving (Auto-play every 2.0 seconds)
        let autoPlayTimer = setInterval(slideNext, 2000);

        // Pause auto-moving on hover
        productSliderWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
        productSliderWrapper.addEventListener('mouseleave', () => {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(slideNext, 2000);
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

    // 6. Live Temperature Simulator Controls (+ / -)
    let currentTemp = 18;
    const liveTempDisplay = document.getElementById('liveTempDisplay');
    const tempMinusBtn = document.getElementById('tempMinusBtn');
    const tempPlusBtn = document.getElementById('tempPlusBtn');

    function updateTempDisplay(val) {
        currentTemp = Math.max(16, Math.min(26, val));
        if (liveTempDisplay) {
            liveTempDisplay.textContent = `${currentTemp}°C`;
        }
        if (heroWidgetText) {
            heroWidgetText.textContent = `${currentTemp}°C • Custom Chill`;
        }
    }

    if (tempMinusBtn) {
        tempMinusBtn.addEventListener('click', () => updateTempDisplay(currentTemp - 1));
    }
    if (tempPlusBtn) {
        tempPlusBtn.addEventListener('click', () => updateTempDisplay(currentTemp + 1));
    }

    // 7. Scroll Reveal & Number Counter Animation
    const revealElems = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && revealElems.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Animate number stats if present inside entry
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(numElem => {
                        if (!numElem.getAttribute('data-animated')) {
                            numElem.setAttribute('data-animated', 'true');
                            const targetVal = parseFloat(numElem.getAttribute('data-count-target'));
                            const decimals = parseInt(numElem.getAttribute('data-decimals') || '0', 10);
                            const suffix = numElem.getAttribute('data-suffix') || '';
                            let startVal = 0;
                            const duration = 1500;
                            const startTime = performance.now();

                            function step(currentTime) {
                                const elapsed = currentTime - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                                const currentVal = startVal + (targetVal - startVal) * easeOutProgress;
                                
                                numElem.textContent = (decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal).toLocaleString()) + suffix;
                                
                                if (progress < 1) {
                                    requestAnimationFrame(step);
                                }
                            }
                            requestAnimationFrame(step);
                        }
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElems.forEach(el => revealObserver.observe(el));
    } else {
        revealElems.forEach(el => el.classList.add('revealed'));
    }

    // 8. Energy Savings Calculator Slider Logic
    const usageRangeSlider = document.getElementById('usageRangeSlider');
    const usageHoursLabel = document.getElementById('usageHoursLabel');
    const monthlySavingsVal = document.getElementById('monthlySavingsVal');
    const annualSavingsVal = document.getElementById('annualSavingsVal');

    if (usageRangeSlider) {
        usageRangeSlider.addEventListener('input', (e) => {
            const hours = parseInt(e.target.value, 10);
            if (usageHoursLabel) usageHoursLabel.textContent = `${hours} Hours/Day`;
            
            // Calc savings: ~ ₹6 saved per hour of 5-star inverter operation vs old non-inverter
            const monthlySavings = Math.round(hours * 30 * 6);
            const annualSavings = monthlySavings * 12;

            if (monthlySavingsVal) monthlySavingsVal.textContent = `₹${monthlySavings.toLocaleString()}/mo`;
            if (annualSavingsVal) annualSavingsVal.textContent = `₹${annualSavings.toLocaleString()}/yr`;
        });
    }

    // 9. Product Quick Specs Modal Populator
    const quickSpecBtns = document.querySelectorAll('.btn-quick-spec');
    const specModalName = document.getElementById('specModalName');
    const specModalBrand = document.getElementById('specModalBrand');
    const specModalDesc = document.getElementById('specModalDesc');
    const specModalHighlights = document.getElementById('specModalHighlights');
    const specModalImg = document.getElementById('specModalImg');

    quickSpecBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const brand = btn.getAttribute('data-brand');
            const desc = btn.getAttribute('data-desc');
            const specs = btn.getAttribute('data-specs');
            const img = btn.getAttribute('data-img');

            if (specModalName) specModalName.textContent = name || '';
            if (specModalBrand) specModalBrand.textContent = brand || '';
            if (specModalDesc) specModalDesc.textContent = desc || '';
            if (specModalHighlights) specModalHighlights.textContent = specs || '';
            if (specModalImg && img) specModalImg.src = img;
        });
    });

    // 10. Interactive Blog Category Filter Pills
    const blogFilterPills = document.querySelectorAll('.blog-filter-pill');
    blogFilterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            blogFilterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });
});
