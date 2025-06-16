// Importa e inicializa Firebase App y Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Espera a que el DOM esté listo antes de ejecutar el código principal
document.addEventListener('DOMContentLoaded', () => {
    // --- Navegación suave solo para enlaces internos ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const target = document.querySelector(href);
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Configuración e inicialización de Firebase ---
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
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    // --- Manejo del envío del formulario de contacto ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            try {
                // Guarda los datos en Firebase Realtime Database
                await push(ref(database, 'contactos'), data);

                // Muestra mensaje de éxito y resetea el formulario
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

    // --- Animación de aparición de elementos al hacer scroll (Intersection Observer) ---
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

    // Aplica animación a tarjetas de servicios y testimonios
    document.querySelectorAll('.service-card, .testimonial').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Aplica animación a las secciones principales
    document.querySelectorAll('.section-fade').forEach(section => {
        section.classList.remove('visible');
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Forzar visibilidad inicial si el IntersectionObserver no las muestra
    document.querySelectorAll('.section-fade').forEach(section => {
        setTimeout(() => {
            if (!section.classList.contains('visible')) {
                section.classList.add('visible');
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        }, 800);
    });

    // --- Carga dinámica de testimonios desde un archivo JSON ---
    // Ahora la ruta es /testimonios.json porque está en public/
    function cargarTestimonios() {
        fetch('/testimonios.json')
            .then(response => {
                if (!response.ok) throw new Error('No se pudo cargar testimonios.json');
                return response.json();
            })
            .then(testimonios => {
                const grid = document.getElementById('testimonialsGrid');
                if (grid && Array.isArray(testimonios) && testimonios.length > 0) {
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
                    document.querySelectorAll('.testimonial').forEach(el => {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(20px)';
                        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        observer.observe(el);
                    });
                } else if (grid) {
                    grid.innerHTML = '<p style="color:#f97316;text-align:center;">No hay testimonios disponibles.</p>';
                }
            })
            .catch(err => {
                const grid = document.getElementById('testimonialsGrid');
                if (grid) {
                    grid.innerHTML = '<p style="color:#f97316;text-align:center;">No se pudieron cargar los testimonios.</p>';
                }
                console.error('Error cargando testimonios:', err);
            });
    }
    cargarTestimonios();

    // --- Carrusel de servicios (carousel) ---
    const carousel = document.getElementById('servicesCarousel');
    const serviceImages = [
        // URLs de imágenes de Unsplash para cada servicio
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
    ];

    // Modal para imágenes de servicios
    let modal = document.getElementById('serviceModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = "serviceModal";
        modal.style.display = "none";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100vw";
        modal.style.height = "100vh";
        modal.style.background = "rgba(30,41,59,0.7)";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "2000";
        modal.innerHTML = `
            <div style="background:#fff; padding:16px; border-radius:12px; box-shadow:0 8px 32px rgba(0,0,0,0.2); position:relative; max-width:90vw; max-height:90vh;">
                <span id="closeModal" style="position:absolute;top:8px;right:8px;cursor:pointer;font-size:1.2rem;color:#f97316;z-index:2100;background:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);">&times;</span>
                <img id="modalImg" src="" alt="Servicio" style="max-width:80vw;max-height:70vh;display:block;margin:auto;border-radius:8px;">
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.querySelector('#closeModal').onclick = () => {
        modal.style.display = "none";
    };
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };

    if (carousel) {
        const cards = Array.from(carousel.querySelectorAll('.service-card'));
        let start = 0;

        function getVisibleCount() {
            return window.innerWidth <= 768 ? 1 : 3;
        }

        function renderCarousel() {
            const visibleCount = getVisibleCount();
            // Oculta todas las tarjetas
            cards.forEach(card => {
                card.style.display = 'none';
                card.classList.remove('visible-mobile');
                card.onclick = null;
            });
            // Muestra solo las visibles y asigna el evento correcto
            for (let i = 0; i < visibleCount; i++) {
                const idx = (start + i) % cards.length;
                cards[idx].style.display = 'flex';
                if (visibleCount === 1) cards[idx].classList.add('visible-mobile');
                // Usa el índice real para la imagen
                cards[idx].onclick = (() => {
                    const realIdx = idx;
                    return () => {
                        const imgSrc = serviceImages[realIdx] || serviceImages[0];
                        document.getElementById('modalImg').src = imgSrc;
                        modal.style.display = "flex";
                    };
                })();
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
        } else {
            console.warn('No se encontraron los botones del carrusel');
        }

        window.addEventListener('resize', renderCarousel);

        renderCarousel();
        console.log('Carrusel inicializado correctamente');
    } else {
        console.warn('No se encontró el carrusel de servicios');
    }
});