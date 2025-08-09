        // Configuration
        const slides = document.querySelectorAll('.slide');
        const navDots = document.querySelectorAll('.nav-dot');
        let currentSlide = 0;
        let isAnimating = false;
        
        const slideTitles = [
            'Introduction & Contexte',
            'Panorama des Métiers',
            'Importance & Débouchés', 
            'Parcours Inspirants',
            'Compétences & Outils',
            'Plan d\'Action',
            'Questions & Réponses',
            'Conclusion & Ressources'
        ];

        // Particle system
        let scene, camera, renderer, particles;

        function initParticles() {
            const canvas = document.getElementById('particles');
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);

            // Create floating particles
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const colors = [];

            for (let i = 0; i < 100; i++) {
                vertices.push(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20
                );
                
                // Soft colors matching our theme
                const colorChoice = Math.random();
                if (colorChoice < 0.3) {
                    colors.push(0.2, 0.5, 0.96); // Primary blue
                } else if (colorChoice < 0.6) {
                    colors.push(0.2, 0.72, 0.5); // Emerald
                } else {
                    colors.push(0.96, 0.62, 0.23); // Orange
                }
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.6,
                sizeAttenuation: true
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);
            
            camera.position.z = 5;
            animate();
        }

        function animate() {
            requestAnimationFrame(animate);
            
            if (particles) {
                particles.rotation.x += 0.001;
                particles.rotation.y += 0.002;
                particles.position.y = Math.sin(Date.now() * 0.0005) * 0.5;
            }
            
            renderer.render(scene, camera);
        }

        // Slide navigation
        function showSlide(n) {
            if (isAnimating || n < 0 || n >= slides.length) return;
            
            isAnimating = true;
            
            // Update navigation dots
            navDots[currentSlide].classList.remove('active');
            navDots[n].classList.add('active');
            
// Hide current slide
gsap.to(slides[currentSlide], {
    opacity: 0,
    y: -30,
    scale: 0.95,
    duration: 0.4,
    ease: "power2.inOut",
    onComplete: () => {
        slides[currentSlide].classList.remove('active');

        // Show new slide immediately after old is hidden
        currentSlide = n;
        slides[currentSlide].classList.add('active');
        
        gsap.fromTo(slides[currentSlide], {
            opacity: 0,
            y: 30,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                isAnimating = false;
            }
        });
        
        updateNavigation();
        animateSlideContent();
    }
});
        }

        function animateSlideContent() {
            const currentSlideElement = slides[currentSlide];
            const cards = currentSlideElement.querySelectorAll('.card, .job-card, .stat-card');
            
            // Stagger animation for cards
            gsap.fromTo(cards, {
                opacity: 0,
                y: 20
            }, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.3
            });
        }

        function nextSlide() {
            if (currentSlide < slides.length - 1) {
                showSlide(currentSlide + 1);
            }
        }

        function prevSlide() {
            if (currentSlide > 0) {
                showSlide(currentSlide - 1);
            }
        }

        function updateNavigation() {
            document.getElementById('current-slide').textContent = currentSlide + 1;
            document.getElementById('slide-title').textContent = slideTitles[currentSlide];
        }

        // Event listeners
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'ArrowRight':
                case 'Space':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    showSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    showSlide(slides.length - 1);
                    break;
                case 'KeyF':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
            }
        });

        // Navigation dots click
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // Touch/swipe navigation
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        // Fullscreen toggle
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Erreur plein écran: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        }

        // Window resize handler
        function handleResize() {
            if (renderer && camera) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        }

        window.addEventListener('resize', handleResize);

        // Hover effects for cards
        function addHoverEffects() {
            const cards = document.querySelectorAll('.card, .job-card, .stat-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -8,
                        scale: 1.02,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });
        }

        // Auto-hide cursor during presentation
        let cursorTimeout;
        function resetCursorTimeout() {
            clearTimeout(cursorTimeout);
            document.body.style.cursor = 'default';
            cursorTimeout = setTimeout(() => {
                if (document.fullscreenElement) {
                    document.body.style.cursor = 'none';
                }
            }, 3000);
        }

        document.addEventListener('mousemove', resetCursorTimeout);
        
        // Presentation mode styles
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                document.body.classList.add('presentation-mode');
                resetCursorTimeout();
            } else {
                document.body.classList.remove('presentation-mode');
                document.body.style.cursor = 'default';
            }
        });

        // Prevent context menu during presentation
        document.addEventListener('contextmenu', (e) => {
            if (document.fullscreenElement) {
                e.preventDefault();
            }
        });

        // Initialize everything when page loads
        window.addEventListener('load', () => {
            // Hide loading spinner
            setTimeout(() => {
                document.getElementById('loading').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loading').style.display = 'none';
                }, 500);
            }, 1000);
            
            // Initialize particles
            initParticles();
            
            // Initialize navigation
            updateNavigation();
            
            // Add hover effects
            addHoverEffects();
            
            // Initial slide animation
            setTimeout(() => {
                animateSlideContent();
            }, 1500);
            
            // Welcome message
            setTimeout(() => {
                console.log('🚀 Présentation Interactive - Métiers Techniques du Numérique');
                console.log('📱 Navigation: ← → (flèches) | F (plein écran) | Espace (suivant)');
                console.log('💡 Cliquez sur les points de navigation pour naviguer directement');
            }, 2000);
        });

        // Performance optimization - pause animations when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                renderer?.setAnimationLoop(null);
            } else {
                animate();
            }
        });

        // Easter egg - Enhanced particles on Konami code
        let konamiCode = [];
        const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                if (particles) {
                    particles.material.size = 0.1;
                    particles.material.opacity = 0.8;
                    console.log('🎉 Mode développeur activé ! Particules améliorées.');
                }
                konamiCode = [];
            }
        });

        // Click to navigate (left/right click areas)
        slides.forEach((slide) => {
            slide.addEventListener('click', (e) => {
                // Prevent navigation when clicking on interactive elements
                if (e.target.closest('.nav-dot, .card, .job-card, .skill-tag, a, button')) {
                    return;
                }
                
                const rect = slide.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const slideWidth = rect.width;
                
                if (x > slideWidth * 0.7) {
                    nextSlide();
                } else if (x < slideWidth * 0.3) {
                    prevSlide();
                }
            });
        });

        // Smooth scroll for long slides
        slides.forEach(slide => {
            slide.addEventListener('wheel', (e) => {
                e.stopPropagation();
            });
        });

        // Accessibility: Focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Ensure tab navigation works within slides
                const activeSlide = slides[currentSlide];
                const focusableElements = activeSlide.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                
                if (focusableElements.length === 0) {
                    e.preventDefault();
                }
            }
        });

        document.getElementById('toggle-controls').addEventListener('click', function() {
    document.querySelector('.controls').classList.toggle('hidden');
});
        