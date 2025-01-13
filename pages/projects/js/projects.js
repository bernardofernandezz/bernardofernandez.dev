document.addEventListener('DOMContentLoaded', () => {
  // Theme Management
  const themeToggle = document.querySelector('.theme-toggle');

  // Function to set theme
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Function to get system theme
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Initialize theme
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // If no saved theme, use system preference
      setTheme(getSystemTheme());
    }
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Theme toggle click handler
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // Initialize theme on load
  initializeTheme();

  // Project data
  const projects = [
    {
      id: 1,
      title: "Japanese Restaurant",
      description: "A Landing Page for a Japanese Restaurant",
      year: "2024",
      tags: ["HTML", "CSS", "JavaScript"],
      image: "./assets/sushibar.jpg",
      demoLink: "https://bernardofernandezz.github.io/japanese-restaurant/",
      githubLink: "https://github.com/bernardofernandezz/japanese-restaurant"
    },
    {
      id: 2,
      title: "Movie Guide",
      description: "Movie Guide Website.",
      year: "2024",
      tags: ["HTML", "CSS", "JavaScript"],
      image: "./assets/movie.jpg",
      demoLink: "https://movie-guide-berna.vercel.app/",
      githubLink: "https://github.com/bernardofernandezz/MovieGuide"

    },
    {
      id: 3,
      title: "Json To Excel",
      description: "An API that converts JSON into Xlsx.",
      year: "2024",
      tags: ["Python", "FastApi", "Uvicorn", "Pandas"],
      image: "./assets/jsontoexcel.jpg",
      demoLink: "https://github.com/bernardofernandezz/JsonToExcel",
      githubLink: "https://github.com/bernardofernandezz/JsonToExcel"


    },
    {
      id: 4,
      title: "Social Link",
      description: "A website to manage my Social Medias.",
      year: "2024",
      tags: ["HTML", "CSS", "JavaScript"],
      image: "./assets/social-link.jpg",
      demoLink: "https://bernardofernandezz.github.io/Social-Link/",
      githubLink: "https://github.com/bernardofernandezz/Social-Link"

    },
    // Add more projects here
  ];

  const projectsGrid = document.getElementById('projectsGrid');
  const searchInput = document.querySelector('.search-input');
  const filterButtons = document.querySelectorAll('.year-filters button');

  let activeFilter = 'all';
  let searchQuery = '';

  // Add this translations object after your projects data
  const translations = {
    en: {
      // Navigation
      home: 'Home',
      about: 'About',
      projects: 'Projects',

      // Projects page
      pageTitle: 'Projects',
      pageSubtitle: 'Explore my portfolio of projects.',

      // Filters
      filterAll: 'All',
      searchPlaceholder: 'Search projects...',

      // Project buttons
      demoButton: 'Demo',
      codeButton: 'Code',

      // Years (if needed)
      year2024: '2024',
      year2023: '2023',
      year2022: '2022',
      year2021: '2021',

      // Project specific translations
      sushibarTitle: "Japanese Restaurant",
      sushibarDesc: "A Landing Page for a Japanese Restaurant",

      movieGuideTitle: "Movie Guide",
      movieGuideDesc: "Movie Guide Website.",

      jsonToExcelTitle: "Json To Excel",
      jsonToExcelDesc: "An API that converts JSON into Xlsx.",

      socialLinkTitle: "Social Link",
      socialLinkDesc: "A website to manage my Social Medias."
    },
    pt: {
      // Navigation
      home: 'Início',
      about: 'Sobre',
      projects: 'Projetos',

      // Projects page
      pageTitle: 'Projetos',
      pageSubtitle: 'Explore meu portfólio de projetos.',

      // Filters
      filterAll: 'Todos',
      searchPlaceholder: 'Buscar projetos...',

      // Project buttons
      demoButton: 'Demo',
      codeButton: 'Código',

      // Years (if needed)
      year2024: '2024',
      year2023: '2023',
      year2022: '2022',
      year2021: '2021',

      // Project specific translations
      sushibarTitle: "Japanese Restaurant",
      sushibarDesc: "Uma plataforma de gestão financeira que usa IA para monitorar seus movimentos.",

      movieGuideTitle: "Guia de Filmes",
      movieGuideDesc: "Website Guia de Filmes.",

      jsonToExcelTitle: "Json Para Excel",
      jsonToExcelDesc: "Uma API que converte JSON em Xlsx.",

      socialLinkTitle: "Social Link",
      socialLinkDesc: "Um site para gerenciar minhas redes sociais."
    },
    es: {
      // Navigation
      home: 'Inicio',
      about: 'Sobre',
      projects: 'Proyectos',

      // Projects page
      pageTitle: 'Proyectos',
      pageSubtitle: 'Explora mi portafolio de proyectos.',

      // Filters
      filterAll: 'Todos',
      searchPlaceholder: 'Buscar proyectos...',

      // Project buttons
      demoButton: 'Demo',
      codeButton: 'Código',

      // Years 
      year2024: '2024',

      // Project specific translations
      sushibarTitle: "Japanese Restaurant",
      sushibarDesc: "Una plataforma de gestión financiera que utiliza IA para monitorear tus movimientos.",

      movieGuideTitle: "Guía de Películas",
      movieGuideDesc: "Sitio web Guía de Películas.",

      jsonToExcelTitle: "Json A Excel",
      jsonToExcelDesc: "Una API que convierte JSON a Xlsx.",

      socialLinkTitle: "Social Link",
      socialLinkDesc: "Un sitio web para gestionar mis redes sociales."
    }
  };

  // Update the translatePage function
  function translatePage(lang) {
    // Update navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
      const key = link.getAttribute('data-translate-key');
      if (translations[lang][key]) {
        link.textContent = translations[lang][key];
      }
    });

    // Update page title and subtitle
    const pageTitle = document.querySelector('.title');
    const pageSubtitle = document.querySelector('.subtitle');
    if (pageTitle) pageTitle.textContent = translations[lang].pageTitle;
    if (pageSubtitle) pageSubtitle.textContent = translations[lang].pageSubtitle;

    // Update search placeholder
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.placeholder = translations[lang].searchPlaceholder;
    }

    // Update filter buttons
    const allFilterBtn = document.querySelector('[data-year="all"]');
    if (allFilterBtn) {
      allFilterBtn.textContent = translations[lang].filterAll;
    }

    // Update project cards
    projects.forEach(project => {
      const titleKey = `${project.title.replace(/\s+/g, '')}Title`.toLowerCase();
      const descKey = `${project.title.replace(/\s+/g, '')}Desc`.toLowerCase();

      const projectCard = document.querySelector(`[data-project-id="${project.id}"]`);
      if (projectCard) {
        const titleElement = projectCard.querySelector('h3');
        const descElement = projectCard.querySelector('p');
        const demoButton = projectCard.querySelector('.btn-primary');
        const codeButton = projectCard.querySelector('.btn-outline');

        if (titleElement && translations[lang][titleKey]) {
          titleElement.textContent = translations[lang][titleKey];
        }
        if (descElement && translations[lang][descKey]) {
          descElement.textContent = translations[lang][descKey];
        }
        if (demoButton) {
          demoButton.innerHTML = `<i class="fas fa-external-link-alt"></i> ${translations[lang].demoButton}`;
        }
        if (codeButton) {
          codeButton.innerHTML = `<i class="fab fa-github"></i> ${translations[lang].codeButton}`;
        }
      }
    });
  }

  // Create project card HTML
  function createProjectCard(project) {
    return `
        <article class="project-card" data-year="${project.year}" data-project-id="${project.id}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-overlay">
                    <a href="${project.demoLink}" class="btn btn-primary" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Demo
                    </a>
                    <a href="${project.githubLink}" class="btn btn-outline" target="_blank">
                        <i class="fab fa-github"></i> Code
                    </a>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    <span class="tag">${project.year}</span>
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </article>
    `;
  }

  // Filter and render projects
  function filterAndRenderProjects() {
    const filteredProjects = projects.filter(project => {
      const matchesYear = activeFilter === 'all' || project.year === activeFilter;
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesYear && matchesSearch;
    });

    projectsGrid.innerHTML = filteredProjects.map(createProjectCard).join('');

    // Add fade-in animation to new cards
    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s forwards`;
      card.style.opacity = '0';
    });
  }

  // Event listeners
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('btn-primary'));
      button.classList.add('btn-primary');
      activeFilter = button.dataset.year;
      filterAndRenderProjects();
    });
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterAndRenderProjects();
  });

  // Initial render
  filterAndRenderProjects();

  // Language switcher
  const languageToggle = document.querySelector('.language-toggle');
  const languageDropdown = document.querySelector('.language-dropdown');
  const currentLang = document.querySelector('.current-lang');

  // Get saved language or default to English
  const savedLang = localStorage.getItem('language') || 'en';
  currentLang.textContent = savedLang.toUpperCase();

  // Toggle dropdown
  languageToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    languageDropdown.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    languageDropdown.classList.remove('show');
  });

  // Handle language selection
  const languageLinks = document.querySelectorAll('.language-dropdown a');
  languageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = link.dataset.lang;
      localStorage.setItem('language', lang);
      currentLang.textContent = lang.toUpperCase();
      translatePage(lang);
    });
  });
});
