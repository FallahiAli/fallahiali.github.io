        class MobileMenu {
            constructor() {
                this.menuButton = document.getElementById('mobile-menu-button');
                this.mobileMenu = document.getElementById('mobile-menu');
                this.menuOverlay = document.getElementById('menu-overlay');
                this.closeButton = document.getElementById('mobile-menu-close');
                this.mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
                this.isOpen = false;
                this.focusableElements = [];
                this.firstFocusableElement = null;
                this.lastFocusableElement = null;
                
                this.init();
            }
            
            init() {
                // Event listeners
                this.menuButton?.addEventListener('click', () => this.toggleMenu());
                this.closeButton?.addEventListener('click', () => this.closeMenu());
                this.menuOverlay?.addEventListener('click', () => this.closeMenu());
                
                // Close menu when clicking on mobile menu links
                this.mobileMenuLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        this.closeMenu();
                    });
                });
                
                // Handle escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.closeMenu();
                    }
                });
                
                // Handle focus trapping
                document.addEventListener('keydown', (e) => {
                    if (this.isOpen && e.key === 'Tab') {
                        this.handleTabKey(e);
                    }
                });
                
                // Handle window resize
                window.addEventListener('resize', () => {
                    if (window.innerWidth >= 768 && this.isOpen) {
                        this.closeMenu();
                    }
                });
                
                // Initialize focusable elements
                this.updateFocusableElements();
            }
            
            toggleMenu() {
                if (this.isOpen) {
                    this.closeMenu();
                } else {
                    this.openMenu();
                }
            }
            
            openMenu() {
                this.isOpen = true;
                this.mobileMenu?.classList.add('active');
                this.menuOverlay?.classList.add('active');
                this.menuButton?.classList.add('active');
                this.menuButton?.setAttribute('aria-expanded', 'true');
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
                
                // Focus management
                this.updateFocusableElements();
                if (this.firstFocusableElement) {
                    this.firstFocusableElement.focus();
                }
            }
            
            closeMenu() {
                this.isOpen = false;
                this.mobileMenu?.classList.remove('active');
                this.menuOverlay?.classList.remove('active');
                this.menuButton?.classList.remove('active');
                this.menuButton?.setAttribute('aria-expanded', 'false');
                
                // Restore body scroll
                document.body.style.overflow = '';
                
                // Return focus to menu button
                this.menuButton?.focus();
            }
            
            updateFocusableElements() {
                if (!this.mobileMenu) return;
                
                const focusableSelectors = [
                    'button',
                    '[href]',
                    'input',
                    'select',
                    'textarea',
                    '[tabindex]:not([tabindex="-1"])'
                ];
                
                this.focusableElements = this.mobileMenu.querySelectorAll(
                    focusableSelectors.join(', ')
                );
                
                this.firstFocusableElement = this.focusableElements[0];
                this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
            }
            
            handleTabKey(e) {
                if (this.focusableElements.length === 0) return;
                
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === this.firstFocusableElement) {
                        e.preventDefault();
                        this.lastFocusableElement?.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === this.lastFocusableElement) {
                        e.preventDefault();
                        this.firstFocusableElement?.focus();
                    }
                }
            }
        }
        
        // Smooth scroll functionality
        class SmoothScroll {
            constructor() {
                this.init();
            }
            
            init() {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = anchor.getAttribute('href');
                        const targetElement = document.querySelector(targetId);
                        
                        if (targetElement) {
                            const headerOffset = 64; // Account for fixed header
                            const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    });
                });
            }
        }

        // Theme Toggle functionality
        class ThemeToggle {
            constructor() {
                this.desktopToggleButton = document.getElementById('theme-toggle');
                this.desktopSunIcon = document.getElementById('sun-icon');
                this.desktopMoonIcon = document.getElementById('moon-icon');

                this.mobileToggleButton = document.getElementById('mobile-theme-toggle');
                this.mobileSunIcon = document.getElementById('mobile-sun-icon');
                this.mobileMoonIcon = document.getElementById('mobile-moon-icon');

                this.siteLogo = document.getElementById('site-logo'); // Reference to the site logo
                this.faviconLink = document.getElementById('favicon-link'); // Reference to the favicon link element
                this.bodyElement = document.body; // Target the <body> element

                this.init();
            }

            init() {
                // Set initial theme based on local storage or system preference
                this.applyInitialTheme();

                // Add event listeners to both desktop and mobile toggle buttons
                this.desktopToggleButton?.addEventListener('click', () => this.toggleTheme());
                this.mobileToggleButton?.addEventListener('click', () => this.toggleTheme());

                // Listen for changes in system theme preference
                window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', event => {
                    // If a theme is explicitly set by the user, don't override it
                    if (!localStorage.getItem('theme')) {
                        const newTheme = event.matches ? 'light' : 'dark';
                        this.bodyElement.setAttribute('data-theme', newTheme);
                        this.updateIcons();
                        this.setLogoBasedOnTheme();
                        this.setFaviconBasedOnTheme();
                    }
                });
            }

            // Applies the theme saved in localStorage or defaults to system preference
            applyInitialTheme() {
                const savedTheme = localStorage.getItem('theme');
                let themeToApply = 'dark'; // Default to dark mode if no preference is found

                if (savedTheme) {
                    // If a theme is saved in localStorage, use it (user's explicit choice)
                    themeToApply = savedTheme;
                } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                    // If no theme is saved, check system preference (prefers-color-scheme)
                    themeToApply = 'light';
                }
                
                // Apply the determined theme to the body
                this.bodyElement.setAttribute('data-theme', themeToApply);
                this.updateIcons(); // Update icons based on the applied theme
                this.setLogoBasedOnTheme(); // Update logo based on the applied theme
                this.setFaviconBasedOnTheme(); // Update favicon based on the applied theme
            }

            // Toggles the theme between dark and light and saves the preference
            toggleTheme() {
                let currentTheme = this.bodyElement.getAttribute('data-theme');
                if (currentTheme === 'dark') {
                    this.bodyElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light'); // Save explicit choice
                } else {
                    this.bodyElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark'); // Save explicit choice
                }
                this.updateIcons(); // Update icons after toggling theme
                this.setLogoBasedOnTheme(); // Update logo after toggling theme
                this.setFaviconBasedOnTheme(); // Update favicon after toggling theme
            }

            // Updates the visibility of sun/moon icons for both desktop and mobile
            updateIcons() {
                const currentTheme = this.bodyElement.getAttribute('data-theme');
                if (currentTheme === 'dark') {
                    // Desktop icons
                    this.desktopSunIcon?.classList.remove('hidden');
                    this.desktopMoonIcon?.classList.add('hidden');
                    // Mobile icons
                    this.mobileSunIcon?.classList.remove('hidden');
                    this.mobileMoonIcon?.classList.add('hidden');
                } else {
                    // Desktop icons
                    this.desktopSunIcon?.classList.add('hidden');
                    this.desktopMoonIcon?.classList.remove('hidden');
                    // Mobile icons
                    this.mobileSunIcon?.classList.add('hidden');
                    this.mobileMoonIcon?.classList.remove('hidden');
                }
            }

            // Sets the correct logo source based on the current theme
            setLogoBasedOnTheme() {
                const currentTheme = this.bodyElement.getAttribute('data-theme');
                if (this.siteLogo) { // Ensure the logo element exists
                    if (currentTheme === 'dark') {
                        this.siteLogo.src = 'Logos/logo-dark.svg';
                        this.siteLogo.alt = 'Dark Mode Site Logo';
                    } else {
                        this.siteLogo.src = 'Logos/logo-Light.svg';
                        this.siteLogo.alt = 'Light Mode Site Logo';
                    }
                }
            }

            // Sets the correct favicon source based on the current theme
            setFaviconBasedOnTheme() {
                const currentTheme = this.bodyElement.getAttribute('data-theme');
                if (this.faviconLink) { 
                    if (currentTheme === 'dark') {
                        this.faviconLink.href = 'Favicon/favicon.svg';
                    } else {
                        this.faviconLink.href = 'Favicon/favicon.svg'; 
                    }
                }
            }
        }
        
        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new MobileMenu();
            new SmoothScroll();
            new ThemeToggle(); // Initialize the new ThemeToggle class
        });
        
        // Add some visual feedback for active nav items
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('nav a[href^="#"]');
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const sectionHeight = section.offsetHeight;
                
                if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('text-blue-600', 'font-semibold');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('text-blue-600', 'font-semibold');
                }
            });
        });
