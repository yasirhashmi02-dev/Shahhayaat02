document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. DATA (Used across different pages) ---
    const GITHUB_BASE_URL = "https://raw.githubusercontent.com/yasirhashmi02-dev/Shahhayaat02/main/";
    const PRODUCTS_DATA = [
        { name: "Brain Champ", price: 175, desc: "Enhances memory and cognitive function.", img: `${GITHUB_BASE_URL}brainchamp.jpg` },
        { name: "Shah Zyme", price: 165, desc: "Effective digestive enzyme syrup.", img: `${GITHUB_BASE_URL}shahzyme.jpg` },
        { name: "Blood Storm", price: 165, desc: "Revitalizing blood tonic for vitality.", img: `${GITHUB_BASE_URL}bloodstorm.jpg` },
        { name: "Cough X Pro", price: 90, desc: "Soothing herbal relief for coughs.", img: `${GITHUB_BASE_URL}coughxpro.jpg` },
        { name: "Musaffa Khoon", price: 165, desc: "Traditional blood purifier for clear skin.", img: `${GITHUB_BASE_URL}musaffakhoon.jpg` },
        { name: "PanaSip", price: 165, desc: "Fast-acting relief from acidity and gas.", img: `${GITHUB_BASE_URL}panasip.jpg` },
        { name: "Livo Hayaat", price: 349, desc: "Formulation for optimal liver health.", img: `${GITHUB_BASE_URL}livohayaat.jpg` },
        { name: "Dia-Ease", price: 695, desc: "Support for healthy sugar balance.", img: `${GITHUB_BASE_URL}diaease.png` },
        { name: "Ortho Hayaat", price: 649, desc: "Specialized blend for joint health.", img: `${GITHUB_BASE_URL}orthohayaat.jpg` },
        { name: "Utro Hayaat", price: 625, desc: "Gentle tonic for women's health.", img: `${GITHUB_BASE_URL}utrohayaat.png` },
        { name: "Passion Pulse", price: 599, desc: "Natural vitality booster for stamina.", img: `${GITHUB_BASE_URL}passionpulse.jpg` },
        { name: "Fevodol", price: 165, desc: "Supports the body's immune response.", img: `${GITHUB_BASE_URL}fevodol.png` }
    ];

    // --- 2. SHARED FUNCTIONALITY (Runs on every page) ---
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) { 
        navToggle.addEventListener('click', () => { 
            document.body.classList.toggle('nav-open'); 
        }); 
    }
    const yearSpan = document.getElementById('year');
    if (yearSpan) { 
        yearSpan.textContent = new Date().getFullYear(); 
    }
    
    // Active Navigation Link Logic
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-desktop a, .nav-mobile a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active-link');
        }
    });

    // Smart Floating Button Logic
    const homeBtn = document.querySelector('.floating-home-btn');
    if (homeBtn) {
        if (currentPage === 'index.html') {
            homeBtn.setAttribute('href', '#home'); // On homepage, it's a "Back to Top" button
        } else {
            homeBtn.setAttribute('href', 'index.html'); // On other pages, it's a "Home" button
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                homeBtn.classList.add('visible');
            } else {
                homeBtn.classList.remove('visible');
            }
            document.body.classList.toggle('scrolled', window.scrollY > 50);
        });
    }


    // --- 3. PAGE-SPECIFIC LOGIC ---
    // Homepage
    const featuredGrid = document.getElementById('product-grid-featured');
    if (featuredGrid) {
        featuredGrid.innerHTML = PRODUCTS_DATA.slice(0, 3).map(p => `<div class="product-card"><img src="${p.img}" alt="${p.name}" loading="lazy"><div class="product-card-content"><h3>${p.name}</h3><p class="product-desc">${p.desc}</p><div class="product-card-footer"><span class="product-price">₹${p.price}</span><a href="https://wa.me/917051056287?text=${encodeURIComponent(`I'd like to order ${p.name} - ₹${p.price}`)}" target="_blank" class="btn btn-primary">Order Now</a></div></div></div>`).join('');
    }
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        if (slides.length > 0) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 5000);
        }
    }

    // Products Page
    const fullGrid = document.getElementById('product-grid-full');
    if (fullGrid) {
        fullGrid.innerHTML = PRODUCTS_DATA.map(p => `<div class="product-card"><img src="${p.img}" alt="${p.name}" loading="lazy"><div class="product-card-content"><h3>${p.name}</h3><p class="product-desc">${p.desc}</p><div class="product-card-footer"><span class="product-price">₹${p.price}</span><a href="https://wa.me/917051056287?text=${encodeURIComponent(`I'd like to order ${p.name} - ₹${p.price}`)}" target="_blank" class="btn btn-primary">Order Now</a></div></div></div>`).join('');
    }
});
