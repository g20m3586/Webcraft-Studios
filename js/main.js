document.addEventListener('DOMContentLoaded', function() {
  // Register GSAP ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
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
              gsap.to(window, {
                  duration: 1,
                  scrollTo: {
                      y: target,
                      offsetY: 80
                  },
                  ease: "power2.inOut"
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
              gsap.to(backToTopButton, {
                  opacity: 1,
                  visibility: 'visible',
                  duration: 0.3
              });
          } else {
              gsap.to(backToTopButton, {
                  opacity: 0,
                  visibility: 'hidden',
                  duration: 0.3
              });
          }
      });
      
      backToTopButton.addEventListener('click', function() {
          gsap.to(window, {
              duration: 1,
              scrollTo: 0,
              ease: "power2.inOut"
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
  
  // Scrollytelling Animation
  const scrollytellingSteps = document.querySelectorAll('.scrollytelling-step');
  const scrollytellingImages = document.querySelectorAll('.scrollytelling-image');
  
  if (scrollytellingSteps.length > 0) {
      scrollytellingSteps.forEach((step, index) => {
          ScrollTrigger.create({
              trigger: ".scrollytelling-container",
              start: `top+=${index * 25}% center`,
              end: `top+=${(index + 1) * 25}% center`,
              onEnter: () => {
                  step.classList.add('active');
                  if (scrollytellingImages[index]) {
                      scrollytellingImages[index].classList.add('active');
                  }
              },
              onEnterBack: () => {
                  step.classList.add('active');
                  if (scrollytellingImages[index]) {
                      scrollytellingImages[index].classList.add('active');
                  }
              },
              onLeave: () => {
                  if (index < scrollytellingSteps.length - 1) {
                      step.classList.remove('active');
                      if (scrollytellingImages[index]) {
                          scrollytellingImages[index].classList.remove('active');
                      }
                  }
              },
              onLeaveBack: () => {
                  if (index > 0) {
                      step.classList.remove('active');
                      if (scrollytellingImages[index]) {
                          scrollytellingImages[index].classList.remove('active');
                      }
                  }
              }
          });
      });
  }
  
  // Section Entrance Animations
  gsap.utils.toArray('section').forEach(section => {
      gsap.from(section, {
          scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none"
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power2.out"
      });
  });
  
  // Parallax Effects
  gsap.utils.toArray('.parallax').forEach(element => {
      const depth = element.dataset.depth || 0.5;
      gsap.to(element, {
          y: 100 * depth,
          scrollTrigger: {
              trigger: element,
              scrub: true
          }
      });
  });
  
  // Fetch GitHub Projects
  async function fetchGitHubProjects() {
      try {
          const username = 'g20m3586';
          const projectsContainer = document.getElementById('github-projects');
          
          if (!projectsContainer) return;
          
          projectsContainer.innerHTML = `
              <div class="col-span-full text-center py-12">
                  <i class="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                  <p class="text-xl">Loading projects...</p>
              </div>
          `;

          // Using a CORS proxy to avoid GitHub API restrictions
          const proxyUrl = 'https://corsproxy.io/?';
          const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;
          
          const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
              headers: {
                  'Accept': 'application/vnd.github.v3+json'
              }
          });

          if (!response.ok) {
              throw new Error(`GitHub API error: ${response.status}`);
          }

          const projects = await response.json();
          
          // Clear loading state
          projectsContainer.innerHTML = '';
          
          if (projects.length === 0) {
              projectsContainer.innerHTML = `
                  <div class="col-span-full text-center py-12 text-gray-400">
                      <i class="fas fa-folder-open text-4xl mb-4"></i>
                      <p class="text-xl">No public repositories found.</p>
                  </div>
              `;
              return;
          }

          projects.forEach((project, index) => {
              const projectCard = document.createElement('div');
              projectCard.className = 'bento-box glassmorphism rounded-2xl p-6 group relative h-full flex flex-col transform transition-all duration-500 hover:scale-105';
              
              projectCard.innerHTML = `
                  <div class="mb-6 rounded-xl overflow-hidden h-48">
                      <img src="https://opengraph.githubassets.com/1/${username}/${project.name}" 
                           alt="${project.name}" 
                           class="w-full h-full object-cover"
                           onerror="this.src='https://via.placeholder.com/800x600/0a192f/00f5ff?text=Project+Image'">
                  </div>
                  <div class="flex-grow">
                      <h3 class="text-2xl font-bold mb-3 flex items-center">
                          <i class="fab fa-github mr-3"></i>
                          ${project.name}
                      </h3>
                      <p class="text-gray-300 mb-6">${project.description || 'No description available'}</p>
                      
                      <div class="flex flex-wrap gap-3 mb-6">
                          ${project.language ? 
                            `<span class="text-sm px-3 py-1 bg-primary/20 text-primary rounded-full">${project.language}</span>` : ''}
                          <span class="text-sm px-3 py-1 bg-gray-700 text-gray-300 rounded-full">
                              <i class="fas fa-star mr-1"></i> ${project.stargazers_count}
                          </span>
                          <span class="text-sm px-3 py-1 bg-gray-700 text-gray-300 rounded-full">
                              <i class="fas fa-code-branch mr-1"></i> ${project.forks_count}
                          </span>
                      </div>
                  </div>
                  
                  <div class="mt-auto">
                      <div class="flex justify-between items-center">
                          <a href="${project.html_url}" target="_blank" 
                            class="text-primary hover:text-accent transition-colors text-lg">
                            <i class="fas fa-external-link-alt mr-2"></i> View on GitHub
                          </a>
                          ${project.homepage ? `
                            <a href="${project.homepage}" target="_blank" 
                              class="text-accent hover:text-primary transition-colors text-lg">
                              <i class="fas fa-globe mr-2"></i> Live Demo
                            </a>
                          ` : ''}
                      </div>
                  </div>
                  
                  <div class="absolute -bottom-5 -right-5 w-24 h-24 bg-primary rounded-full opacity-10 blur-xl"></div>
              `;
              
              projectsContainer.appendChild(projectCard);
              
              // Animate each project card in
              gsap.from(projectCard, {
                  scrollTrigger: {
                      trigger: projectCard,
                      start: "top 80%",
                      toggleActions: "play none none none"
                  },
                  opacity: 0,
                  y: 50,
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "power2.out"
              });
          });
          
      } catch (error) {
          console.error('Error fetching GitHub projects:', error);
          const projectsContainer = document.getElementById('github-projects');
          if (projectsContainer) {
              projectsContainer.innerHTML = `
                  <div class="col-span-full text-center py-12 text-gray-400">
                      <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                      <p class="text-xl">Failed to load projects. Please check back later.</p>
                      <p class="text-sm mt-2">Error: ${error.message}</p>
                  </div>
              `;
          }
      }
  }
  
  // Call the function when the page loads
  fetchGitHubProjects();
  
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