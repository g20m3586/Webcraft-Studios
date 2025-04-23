document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuButton.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.remove('opacity-100', 'visible');
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.classList.remove('bg-gradient-to-r', 'from-primary', 'to-accent');
                submitBtn.classList.add('bg-green-500');
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalContent;
                    submitBtn.classList.add('bg-gradient-to-r', 'from-primary', 'to-accent');
                    submitBtn.classList.remove('bg-green-500');
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
    
    // Portfolio item hover effects
    const portfolioItems = document.querySelectorAll('.bento-box.overflow-hidden');
    portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        const content = item.querySelector('div[class*="absolute"]');
        
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Parallax effect for image
            if (img) {
                img.style.transformOrigin = `${x}px ${y}px`;
            }
            
            // Light position for glassmorphism
            if (content) {
                content.style.setProperty('--mouse-x', `${x}px`);
                content.style.setProperty('--mouse-y', `${y}px`);
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.bento-box, section').forEach(element => {
        animateOnScroll.observe(element);
    });
    
    // Mouse follower effect for glassmorphism elements
    document.addEventListener('mousemove', (e) => {
        const glassElements = document.querySelectorAll('.glassmorphism');
        glassElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            element.style.setProperty('--mouse-x', `${x}px`);
            element.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

// GitHub Projects Integration
async function fetchGitHubProjects() {
    try {
      const username = 'g20m3586'; // Replace with your GitHub username
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      const projects = await response.json();
      
      const projectsContainer = document.getElementById('github-projects');
      projectsContainer.innerHTML = ''; // Clear loading state
      
      projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'bento-box glassmorphism rounded-xl p-6 group relative h-full flex flex-col';
        
        projectCard.innerHTML = `
        
          <div class="flex-grow">
            <h3 class="text-xl font-bold mb-2 flex items-center">
              <i class="fab fa-github mr-2"></i>
              ${project.name}
            </h3>
            <p class="text-gray-300 mb-4 text-sm">${project.description || 'No description available'}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              ${project.language ? 
                `<span class="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">${project.language}</span>` : ''}
              <span class="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                <i class="fas fa-star mr-1"></i> ${project.stargazers_count}
              </span>
              <span class="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                <i class="fas fa-code-branch mr-1"></i> ${project.forks_count}
              </span>
            </div>
          </div>
          
          <div class="mt-auto">
            <div class="flex justify-between items-center">
              <a href="${project.html_url}" target="_blank" 
                class="text-primary hover:text-accent transition-colors text-sm">
                <i class="fas fa-external-link-alt mr-1"></i> View on GitHub
              </a>
              ${project.homepage ? `
                <a href="${project.homepage}" target="_blank" 
                  class="text-accent hover:text-primary transition-colors text-sm">
                  <i class="fas fa-globe mr-1"></i> Live Demo
                </a>
              ` : ''}
            </div>
          </div>
          
          <div class="absolute -bottom-5 -right-5 w-20 h-20 bg-primary rounded-full opacity-10 blur-xl"></div>
        `;
        
        projectsContainer.appendChild(projectCard);
      });
      
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      const projectsContainer = document.getElementById('github-projects');
      projectsContainer.innerHTML = `
        <div class="col-span-full text-center py-12 text-gray-400">
          <i class="fas fa-exclamation-triangle text-3xl mb-4"></i>
          <p>Failed to load projects. Please check back later.</p>
        </div>
      `;
    }
  }
  
  // Call the function when the page loads
  document.addEventListener('DOMContentLoaded', fetchGitHubProjects);