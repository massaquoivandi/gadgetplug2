 // Dark Mode Toggle
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const icon = themeToggle.querySelector('i');

        // Check for saved user preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            body.classList.add('dark-mode');
            icon.classList.replace('fa-moon', 'fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });

        // Back to Top Button
        const backToTopButton = document.getElementById('backToTop');

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });

        // Mobile Navigation
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobileNav');
        const closeBtn = document.getElementById('closeBtn');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        hamburger.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeBtn.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Navigation Scrolling and Active Link
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const sections = document.querySelectorAll('section');

        function setActiveLink() {
            let index = sections.length;
            
            while (--index && window.scrollY + 100 < sections[index].offsetTop) {}
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sections[index].id}`) {
                    link.classList.add('active');
                }
            });
        }

        setActiveLink();
        window.addEventListener('scroll', setActiveLink);

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Product Filtering, Search, and Sorting
        document.addEventListener('DOMContentLoaded', function() {
            const filterButtons = document.querySelectorAll('.filter-bar button');
            const searchInput = document.getElementById('searchInput');
            const sortSelect = document.getElementById('sortSelect');
            const productsGrid = document.getElementById('productsGrid');
            const productCards = Array.from(document.querySelectorAll('.products-grid .card'));
            const featuredProducts = Array.from(document.querySelectorAll('.featured-products .card'));
            const allProducts = [...featuredProducts, ...productCards];
            
            // Store original order of products for "Newest First" sorting
            const originalOrder = [...allProducts];
            
            // Add click event to category links in footer
            document.querySelectorAll('.footer-links a[data-category]').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const category = this.getAttribute('data-category');
                    
                    // Update filter buttons
                    filterButtons.forEach(button => {
                        button.classList.remove('active');
                        if (button.getAttribute('data-category') === category) {
                            button.classList.add('active');
                        }
                    });
                    
                    // Filter products
                    filterProducts(category, searchInput.value, sortSelect.value);
                });
            });

            // Filter buttons functionality
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Get the category to filter by
                    const category = this.getAttribute('data-category');
                    
                    // Filter products
                    filterProducts(category, searchInput.value, sortSelect.value);
                });
            });

            // Search functionality
            searchInput.addEventListener('input', function() {
                const activeFilter = document.querySelector('.filter-bar button.active');
                const category = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
                
                filterProducts(category, this.value, sortSelect.value);
            });

            // Sort functionality
            sortSelect.addEventListener('change', function() {
                const activeFilter = document.querySelector('.filter-bar button.active');
                const category = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
                
                filterProducts(category, searchInput.value, this.value);
            });

            // Main filtering function
            function filterProducts(category, searchTerm, sortBy) {
                let filteredProducts = [...allProducts];
                
                // Filter by category
                if (category !== 'all') {
                    filteredProducts = filteredProducts.filter(card => {
                        return card.getAttribute('data-category') === category;
                    });
                }
                
                // Filter by search term
                if (searchTerm) {
                    const term = searchTerm.toLowerCase();
                    filteredProducts = filteredProducts.filter(card => {
                        const title = card.querySelector('.product-title').textContent.toLowerCase();
                        const description = card.querySelector('.product-description').textContent.toLowerCase();
                        return title.includes(term) || description.includes(term);
                    });
                }
                
                // Sort products
                filteredProducts = sortProducts(filteredProducts, sortBy);
                
                // Display results
                displayResults(filteredProducts);
            }
            
            // Sorting function
            function sortProducts(products, sortBy) {
                switch(sortBy) {
                    case 'newest':
                        // Sort by date (newest first)
                        return [...products].sort((a, b) => {
                            const dateA = new Date(a.getAttribute('data-date'));
                            const dateB = new Date(b.getAttribute('data-date'));
                            return dateB - dateA;
                        });
                    case 'rating':
                        // Sort by rating (highest first)
                        return [...products].sort((a, b) => {
                            return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
                        });
                    case 'price-low':
                        // Sort by price (low to high)
                        return [...products].sort((a, b) => {
                            return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                        });
                    case 'price-high':
                        // Sort by price (high to low)
                        return [...products].sort((a, b) => {
                            return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                        });
                    default:
                        return products;
                }
            }
            
            // Display results function
            function displayResults(products) {
                // Clear current grid
                productsGrid.innerHTML = '';
                
                if (products.length === 0) {
                    // Show "no results" message
                    const noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.textContent = 'No products match your search criteria.';
                    productsGrid.appendChild(noResults);
                } else {
                    // Add filtered products to grid
                    products.forEach(product => {
                        // We only want to show non-featured products in the main grid
                        if (!product.closest('.featured-products')) {
                            productsGrid.appendChild(product);
                        }
                    });
                }
            }
            
            // Initialize with all products showing
            filterProducts('all', '', 'newest');
        });