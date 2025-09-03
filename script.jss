document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. DATA ---
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
    const BLOG_DATA = [
        { title: "How Ayurveda Can Help Manage Arthritis", img: `${GITHUB_BASE_URL}image(1).png`, link: "#" },
        { title: "5 Ayurvedic Herbs for a Stronger Immune System", img: `${GITHUB_BASE_URL}image(4).png`, link: "#" },
        { title: "The Secret to Better Sleep: An Ayurvedic Approach", img: `${GITHUB_BASE_URL}image(5).png`, link: "#" }
    ];
    const QUIZ_DATA = [
        { q: 'How would you describe your natural body frame?', o: [['vata', 'Slender and light'], ['pitta', 'Medium and athletic'], ['kapha', 'Broad and sturdy']] },
        { q: 'What is your appetite typically like?', o: [['vata', 'Irregular, varies a lot'], ['pitta', 'Strong and sharp, I get hungry'], ['kapha', 'Slow but steady, can miss meals']] },
        { q: 'How does your skin usually feel?', o: [['vata', 'Dry and cool to the touch'], ['pitta', 'Warm, sometimes sensitive or reddish'], ['kapha', 'Cool, smooth, and often oily']] },
        { q: 'What is your energy pattern?', o: [['vata', 'Comes in bursts, can feel scattered'], ['pitta', 'Focused and driven, goal-oriented'], ['kapha', 'Steady and sustained, slow to start']] },
    ];
    const QUIZ_RECOS = {
        vata: { title: "Vata Balancing", products: ["Brain Champ", "Shah Zyme"] },
        pitta: { title: "Pitta Balancing", products: ["Livo Hayaat", "Blood Storm"] },
        kapha: { title: "Kapha Balancing", products: ["Cough X Pro", "Ortho Hayaat"] }
    };

    // --- 2. SHARED COMPONENTS & NAVIGATION ---
    const header = document.querySelector('.header');
    if (header) {
        header.innerHTML = `<div class="container"><a href="index.html" class="logo"><img src="${GITHUB_BASE_URL}logo.jpg" alt="Shah Hayaat Logo"><span>Shah Hayaat</span></a><nav class="nav-desktop"><ul><li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li><li><a href="products.html">Products</a></li><li><a href="catalogue.html">Catalogue</a></li><li><a href="blog.html">Blog</a></li><li><a href="quiz.html">Dosha Quiz</a></li><li><a href="contact.html">Contact</a></li></ul></nav><button class="nav-toggle" aria-label="Toggle Navigation"><span></span><span></span><span></span></button></div>`;
    }
    const mobileNav = document.querySelector('.nav-mobile');
    if (mobileNav) {
        mobileNav.innerHTML = `<ul><li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li><li><a href="products.html">Products</a></li><li><a href="catalogue.html">Catalogue</a></li><li><a href="blog.html">Blog</a></li><li><a href="quiz.html">Dosha Quiz</a></li><li><a href="contact.html">Contact</a></li></ul>`;
    }
    const footer = document.querySelector('.footer');
    if(footer) {
        footer.innerHTML = `<div class="container"><div class="footer-grid"><div class="footer-col"><h4>Shah Hayaat</h4><p>Natural healing, pure living. Your trusted source for premium Ayurvedic wellness.</p></div><div class="footer-col"><h4>Quick Links</h4><a href="index.html">Home</a><a href="about.html">About</a><a href="products.html">Products</a><a href="quiz.html">Dosha Quiz</a><a href="contact.html">Contact</a></div><div class="footer-col"><h4>Contact & Orders</h4><a href="https://wa.me/917051056287" target="_blank">WhatsApp</a><a href="mailto:shahhayaat02@gmail.com">Email Us</a><a href="https://instagram.com/shahhayaatofficial" target="_blank">Instagram</a></div><div class="footer-col"><h4>Also Available On</h4><a href="https://www.amazon.in/HAYAAT-Combo-Complete-Liver-Health/dp/BCXY46HXM" target="_blank">Amazon</a><a href="https://m.indiamart.com/shah-hayaat/" target="_blank">IndiaMART</a></div></div><div class="footer-bottom">&copy; <span id="year"></span> Shah Hayaat. All Rights Reserved.</div></div>`;
        document.getElementById('year').textContent = new Date().getFullYear();
    }
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) { navToggle.addEventListener('click', () => { document.body.classList.toggle('nav-open'); }); }
    document.querySelectorAll('.nav-mobile a, .nav-desktop a').forEach(link => { link.addEventListener('click', () => { setTimeout(() => { document.body.classList.remove('nav-open'); }, 300); }); });
    window.addEventListener('scroll', () => { document.body.classList.toggle('scrolled', window.scrollY > 50); });

    // --- 3. PAGE-SPECIFIC DYNAMIC CONTENT ---
    // Homepage
    if (document.getElementById('product-grid-featured')) {
        document.getElementById('product-grid-featured').innerHTML = PRODUCTS_DATA.slice(0, 3).map(p => `<div class="product-card"><img src="${p.img}" alt="${p.name}" loading="lazy"><div class="product-card-content"><h3>${p.name}</h3><p class="product-desc">${p.desc}</p><div class="product-card-footer"><span class="product-price">₹${p.price}</span><a href="https://wa.me/917051056287?text=${encodeURIComponent(`I'd like to order ${p.name} - ₹${p.price}`)}" target="_blank" class="btn btn-primary">Order Now</a></div></div></div>`).join('');
    }
    // Products Page
    if (document.getElementById('product-grid-full')) {
        document.getElementById('product-grid-full').innerHTML = PRODUCTS_DATA.map(p => `<div class="product-card"><img src="${p.img}" alt="${p.name}" loading="lazy"><div class="product-card-content"><h3>${p.name}</h3><p class="product-desc">${p.desc}</p><div class="product-card-footer"><span class="product-price">₹${p.price}</span><a href="https://wa.me/917051056287?text=${encodeURIComponent(`I'd like to order ${p.name} - ₹${p.price}`)}" target="_blank" class="btn btn-primary">Order Now</a></div></div></div>`).join('');
    }
    // Blog Page
    if (document.getElementById('blog-grid-container')) {
        document.getElementById('blog-grid-container').innerHTML = BLOG_DATA.map(post => `<a href="${post.link}" class="blog-card"><img src="${post.img}" alt="${post.title}" loading="lazy"><div class="blog-card-content"><h3>${post.title}</h3><p>Read More &rarr;</p></div></a>`).join('');
    }
    // Quiz Page
    const quizContainer = document.getElementById('quiz-container');
    if(quizContainer) {
        quizContainer.innerHTML = QUIZ_DATA.map((item, index) => `<div class="quiz-question"><p class="quiz-question-title">${index + 1}. ${item.q}</p><div class="quiz-options">${item.o.map(([val, label]) => `<label><input type="radio" name="q${index}" value="${val}">${label}</label>`).join('')}</div></div>`).join('');
        const quizSubmitBtn = document.getElementById('submit-quiz-btn');
        quizSubmitBtn.addEventListener('click', () => {
            const quizResultsContainer = document.getElementById('quiz-results');
            const answers = {};
            let allAnswered = true;
            for (let i = 0; i < QUIZ_DATA.length; i++) {
                const checked = document.querySelector(`input[name="q${i}"]:checked`);
                if(checked) { answers[checked.value] = (answers[checked.value] || 0) + 1; } 
                else { allAnswered = false; break; }
            }
            if (!allAnswered) { alert('Please answer all questions to find your profile.'); return; }
            const dominantDosha = Object.keys(answers).reduce((a, b) => answers[a] > answers[b] ? a : b);
            const reco = QUIZ_RECOS[dominantDosha];
            quizResultsContainer.innerHTML = `<div class="result-card"><h3>Your Profile: ${reco.title}</h3><div class="result-products">${reco.products.map(pName => { const p = PRODUCTS_DATA.find(pr => pr.name === pName); return `<div class="result-product"><h4>${p.name}</h4><a href="https://wa.me/917051056287?text=${encodeURIComponent(`I'd like to order ${p.name} based on my quiz results`)}" target="_blank" class="btn btn-primary">Order</a></div>`; }).join('')}</div><p class="result-disclaimer">This is a general recommendation, not medical advice. Consult a professional for your health needs.</p></div>`;
            quizResultsContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- 4. ANIMATIONS ---
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        const slideInterval = 5000;
        const nextSlide = () => {
            heroSection.classList.remove('progress-animate');
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            void heroSection.offsetWidth;
            heroSection.classList.add('progress-animate');
        };
        heroSection.classList.add('progress-animate');
        setInterval(nextSlide, slideInterval);
    }

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('is-visible'); } 
            else { entry.target.classList.remove('is-visible'); }
        });
    }, { threshold: 0.15 });
    animatedElements.forEach(el => observer.observe(el));
});
</script>
</body>
</html>
