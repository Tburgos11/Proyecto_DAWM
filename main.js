import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Este archivo puede eliminarse, el punto de entrada es /src/main.js

// Espera a que el DOM esté listo antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyA2d7MCr7YlIF7gCDZWM0AHbqM59aJHOxM",
      authDomain: "base-datos-rv.firebaseapp.com",
      projectId: "base-datos-rv",
      storageBucket: "base-datos-rv.firebasestorage.app",
      messagingSenderId: "511305176330",
      appId: "1:511305176330:web:975b31ec0bd7af0f9e56f3",
      measurementId: "G-2XS3472VRD",
      databaseURL: "https://base-datos-rv-default-rtdb.firebaseio.com"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    // Form submission handler con Firebase Realtime Database
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            try {
                await push(ref(database, 'contactos'), data);

                // Mostrar mensaje de éxito
                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.classList.add('show');
                    this.reset();
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                }
            } catch (error) {
                alert('Hubo un error al enviar el formulario.');
                console.error('Error:', error);
            }
        });
    }

    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(225, 29, 72, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #e11d48 0%, #f97316 100%)';
                header.style.backdropFilter = 'none';
            }
        }
    });

    // Animate elements on scroll (simple intersection observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                entry.target.classList.remove('visible');
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(40px)';
            }
        });
    }, observerOptions);

    // Inicializa animación para service cards y testimonials
    document.querySelectorAll('.service-card, .testimonial').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Inicializa animación para secciones principales
    document.querySelectorAll('.section-fade').forEach(section => {
        section.classList.remove('visible'); // Asegura que inicien ocultas
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // fetch GET para cargar testimonios originales desde testimonios.json
    fetch('testimonios.json')
        .then(response => response.json())
        .then(testimonios => {
            const grid = document.getElementById('testimonialsGrid');
            if (grid) {
                grid.innerHTML = '';
                testimonios.forEach(t => {
                    grid.innerHTML += `
                        <div class="testimonial">
                            <div class="testimonial-text">"${t.texto}"</div>
                            <div class="testimonial-author">${t.autor}</div>
                            <div class="testimonial-role">${t.rol}</div>
                            <div class="testimonial-company">${t.empresa}</div>
                        </div>
                    `;
                });
                // Vuelve a observar los nuevos testimonios
                document.querySelectorAll('.testimonial').forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    observer.observe(el);
                });
            }
        });

    // Carousel para servicios
    const carousel = document.getElementById('servicesCarousel');
    if (carousel) {
        const cards = Array.from(carousel.querySelectorAll('.service-card'));
        const visibleCount = 3;
        let start = 0;

        function renderCarousel() {
            cards.forEach(card => card.style.display = 'none');
            for (let i = 0; i < visibleCount; i++) {
                const idx = (start + i) % cards.length;
                cards[idx].style.display = 'flex'; // Usa 'flex' para mantener el diseño
            }
        }

        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        if (prevBtn && nextBtn) {
            prevBtn.onclick = function() {
                start = (start - 1 + cards.length) % cards.length;
                renderCarousel();
            };
            nextBtn.onclick = function() {
                start = (start + 1) % cards.length;
                renderCarousel();
            };
        }

        renderCarousel();
    }
});