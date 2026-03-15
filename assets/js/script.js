// Appy School V3 - Interactive Logic

document.addEventListener('DOMContentLoaded', () => {

    /* --- Tabbed Hub Interaction --- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Find and show corresponding pane
            const targetId = btn.getAttribute('data-target');
            const targetPane = document.getElementById(`pane-${targetId}`);
            if(targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    /* --- Side-by-Side App Comparison Toggles --- */
    const compTabs = document.querySelectorAll('.comp-tab');

    compTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.app-comparison-container');
            if (!container) return;

            const localTabs = container.querySelectorAll('.comp-tab');
            const localViews = container.querySelectorAll('.comp-view');

            localTabs.forEach(b => b.classList.remove('active'));
            localViews.forEach(v => v.classList.remove('active'));

            btn.classList.add('active');

            const targetId = btn.getAttribute('data-comp');
            const targetView = document.getElementById(`comp-${targetId}`);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });

    /* --- Mobile Menu Toggle --- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if(mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            // For a simple implementation, you'd toggle a .show class on navMenu
            // and adjust CSS accordingly.
            const icon = mobileToggle.querySelector('i');
            if(icon.classList.contains('bx-menu')) {
                icon.classList.replace('bx-menu', 'bx-x');
            } else {
                icon.classList.replace('bx-x', 'bx-menu');
            }
        });
    }

    /* --- Scroll Reveal Animations --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.fade-in, .slide-up');
    revealElements.forEach(el => observer.observe(el));

    /* --- Sticky Header Effect --- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            header.style.padding = '0';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    /* --- Demo Modal Logic --- */
    const demoModal = document.getElementById('demo-modal');
    const triggerBtns = document.querySelectorAll('.trigger-demo-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const demoForm = document.getElementById('demo-form');
    const formSuccess = document.getElementById('form-success');
    const btnDone = document.getElementById('btn-done');

    // Google Form Configuration (Actual)
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSer2EvGi-O3o48wFhehbAVVMrZ_dL3q8VuClOJvlyXPuIeSmQ/formResponse";
    const ENTRY_IDS = {
        name: "entry.1439006151",
        email: "entry.1920600701",
        phone: "entry.1399786343",
        school: "entry.1939090333",
        designation: "entry.2004545399",
        city: "entry.291950967"
    };

    const openModal = () => {
        demoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    const closeModal = () => {
        demoModal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form after a delay to allow animation to finish
        setTimeout(() => {
            demoForm.style.display = 'block';
            formSuccess.style.display = 'none';
            demoForm.reset();
        }, 300);
    };

    triggerBtns.forEach(btn => btn.addEventListener('click', openModal));
    closeModalBtn.addEventListener('click', closeModal);
    btnDone.addEventListener('click', closeModal);

    // Close on outside click
    demoModal.addEventListener('click', (e) => {
        if(e.target === demoModal) closeModal();
    });

    /* --- Form Submission to Google Forms --- */
    if(demoForm) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = demoForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            const formData = new FormData();
            formData.append(ENTRY_IDS.name, document.getElementById('full-name').value);
            formData.append(ENTRY_IDS.email, document.getElementById('work-email').value);
            formData.append(ENTRY_IDS.phone, document.getElementById('phone').value);
            formData.append(ENTRY_IDS.school, document.getElementById('school-name').value);
            formData.append(ENTRY_IDS.designation, document.getElementById('designation').value);
            formData.append(ENTRY_IDS.city, document.getElementById('city').value);

            // Submission using fetch with no-cors
            fetch(GOOGLE_FORM_URL, {
                method: "POST",
                mode: "no-cors",
                body: formData
            }).then(() => {
                // Success state
                demoForm.style.display = 'none';
                formSuccess.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Request";
            }).catch(err => {
                console.error("Form submission error:", err);
                alert("There was an error submitting your request. Please try again or contact us directly.");
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Request";
            });
        });
    }

    // --- Interactive Map Initialization ---
    const initMap = () => {
        const mapContainer = document.getElementById('presence-map');
        if (!mapContainer) return;

        // Initialize Leaflet map centered on India
        const map = L.map('presence-map', {
            center: [22.5937, 82.9629], // Slightly right-weighted center for better balance
            zoom: 5,
            scrollWheelZoom: false, // Prevent scroll hijack
            zoomControl: true,
            attributionControl: false
        });

        // Use CartoDB Positron (Light/Minimal) tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(map);

        // Custom Pulsing Marker Icon
        const pulsingIcon = L.divIcon({
            className: 'custom-pulsing-marker',
            html: '<div class="marker-inner"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Cities data
        const cities = [
            { name: "Hyderabad", coords: [17.3850, 78.4867] },
            { name: "Chennai", coords: [13.0827, 80.2707] },
            { name: "Bangalore", coords: [12.9716, 77.5946] },
            { name: "Visakhapatnam", coords: [17.6868, 83.2185] },
            { name: "Kolkata", coords: [22.5726, 88.3639] },
            { name: "Jorhat", coords: [26.7509, 94.2037] },
            { name: "Dimapur", coords: [25.8900, 93.7300] }
        ];

        // Add markers for each city
        cities.forEach(city => {
            L.marker(city.coords, { icon: pulsingIcon })
                .addTo(map)
                .bindPopup(`<strong>${city.name}</strong><br>Appy School Partner`);
        });

        // Add subtle grayscale styling to map container via filter
        mapContainer.style.filter = 'saturate(0.5) contrast(1.1)';
    };

    // Initialize map after a short delay for smooth loading
    setTimeout(initMap, 500);
});
