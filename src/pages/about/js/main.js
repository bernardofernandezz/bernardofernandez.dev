import { initSpotify } from './spotify.js';

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');

  // Check for saved theme preference, system preference, or default to light
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Inicializar Spotify
  initSpotify();
});

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

// Initial translation
translatePage(savedLang);

// Translation function (example implementation)
function translatePage(lang) {
  const translations = {
    en: {
      // Navigation
      home: 'Home',
      about: 'About',
      projects: 'Projects',

      // Hero section
      greeting: 'Hi 👋, I\'m Bernardo Fernandez',
      subtitle: 'Just a guy who loves creating things using code.',

      // About page
      introduction: 'INTRODUCTION',
      aboutTitle: 'Developer who loves talk about tech, games and biotech',
      aboutText1: 'My name is Bernardo Fernandez, I\'m a Web Developer and i have 15 years old. I\'m from Salvador, Bahia, Brazil. I\'m on High School and also do a technician in Biotechnology on Senai Cimatec. I\'m a passionate about technology and i love the idea of fix problems and create solutions using code.',
      aboutText2: 'Additionally, I\'m currently working as a IT Assistant on Amara Net Zero. There, i improve my skills and learn more about the technology and software development.',
      funFact: '⚡️ Fun fact: I\'m not a big fan of coffee.',

      // Preferences section
      music: 'Music',
      city: 'City',
      stacks: 'Stacks',
      system: 'System',

      // Career section
      career: 'Career',
      itAssistant: 'IT Assistant',
      present: 'Present',

      // Footer
      copyright: '© 2025 Bernardo Fernandez. All rights reserved.',
      contact: 'Contact',
      privacy: 'Privacy'
    },
    pt: {
      // Navigation
      home: 'Início',
      about: 'Sobre',
      projects: 'Projetos',

      // Hero section
      greeting: 'Olá 👋, eu sou Bernardo Fernandez',
      subtitle: 'Apenas um cara que ama criar coisas usando código.',

      // About page
      introduction: 'INTRODUÇÃO',
      aboutTitle: 'Desenvolvedor que ama falar sobre tecnologia, jogos e biotecnologia',
      aboutText1: 'Meu nome é Bernardo Fernandez, sou desenvolvedor Web e tenho 15 anos. Sou de Salvador, Bahia, Brasil. Estou no Ensino Médio e também faço técnico em Biotecnologia no Senai Cimatec. Sou apaixonado por tecnologia e amo a ideia de resolver problemas e criar soluções usando código.',
      aboutText2: 'Além disso, atualmente trabalho como Assistente de TI na Amara Net Zero. Lá, aprimoro minhas habilidades e aprendo mais sobre tecnologia e desenvolvimento de software.',
      funFact: '⚡️ Fato curioso: Não sou um grande fã de café.',

      // Preferences section
      music: 'Música',
      city: 'Cidade',
      stacks: 'Tecnologias',
      system: 'Sistema',

      // Career section
      career: 'Carreira',
      itAssistant: 'Assistente de TI',
      present: 'Presente',

      // Footer
      copyright: '© 2025 Bernardo Fernandez. Todos os direitos reservados.',
      contact: 'Contato',
      privacy: 'Privacidade'
    },
    es: {
      // Navigation
      home: 'Inicio',
      about: 'Sobre',
      projects: 'Proyectos',

      // Hero section
      greeting: 'Hola 👋, soy Bernardo Fernandez',
      subtitle: 'Solo un chico que ama crear cosas usando código.',

      // About page
      introduction: 'INTRODUCCIÓN',
      aboutTitle: 'Desarrollador que ama hablar de tecnología, juegos y biotecnología',
      aboutText1: 'Mi nombre es Bernardo Fernandez, soy Desarrollador web y tengo 15 años. Soy de Salvador, Bahía, Brasil. Estoy en la escuela secundaria y también estudio técnico en Biotecnología en Senai Cimatec. Me apasiona la tecnología y me encanta la idea de resolver problemas y crear soluciones usando código.',
      aboutText2: 'Además, actualmente trabajo como Asistente de TI en Amara Net Zero. Allí, mejoro mis habilidades y aprendo más sobre tecnología y desarrollo de software.',
      funFact: '⚡️ Dato curioso: No soy un gran fan de café.',

      // Preferences section
      music: 'Música',
      city: 'Ciudad',
      stacks: 'Tecnologías',
      system: 'Sistema',

      // Career section
      career: 'Carrera',
      itAssistant: 'Asistente de TI',
      present: 'Presente',

      // Footer
      copyright: '© 2025 Bernardo Fernandez. Todos los derechos reservados.',
      contact: 'Contacto',
      privacy: 'Privacidad'
    }
  };

  // Update navigation links
  document.querySelectorAll('.nav-links a').forEach(link => {
    const key = link.textContent.toLowerCase();
    if (translations[lang][key]) {
      link.textContent = translations[lang][key];
    }
  });

  // Update hero section
  const heroTitle = document.querySelector('.title');
  const heroSubtitle = document.querySelector('.subtitle');
  if (heroTitle) heroTitle.innerHTML = translations[lang].greeting;
  if (heroSubtitle) heroSubtitle.textContent = translations[lang].subtitle;

  // Update about page content
  const introTitle = document.querySelector('.intro h2');
  const aboutTitle = document.querySelector('.intro h3');
  const aboutTexts = document.querySelectorAll('.intro-text p:not(.fun-fact)');
  const funFact = document.querySelector('.fun-fact');

  if (introTitle) introTitle.textContent = translations[lang].introduction;
  if (aboutTitle) aboutTitle.textContent = translations[lang].aboutTitle;
  if (aboutTexts.length >= 2) {
    aboutTexts[0].textContent = translations[lang].aboutText1;
    aboutTexts[1].textContent = translations[lang].aboutText2;
  }
  if (funFact) funFact.textContent = translations[lang].funFact;

  // Update preferences section
  const prefTitles = document.querySelectorAll('.pref-item h4');
  prefTitles.forEach(title => {
    const key = title.textContent.toLowerCase();
    if (translations[lang][key]) {
      title.textContent = translations[lang][key];
    }
  });

  // Update career section
  const careerTitle = document.querySelector('.career-section h2');
  const jobTitle = document.querySelector('.job h3');
  const jobLocation = document.querySelector('.job p');

  if (careerTitle) careerTitle.textContent = translations[lang].career;
  if (jobTitle) jobTitle.textContent = translations[lang].itAssistant;
  if (jobLocation) jobLocation.textContent = `Amara Net Zero `;

  // Update footer
  const copyright = document.querySelector('.footer-container p');
  const footerLinks = document.querySelectorAll('.footer-links a');

  if (copyright) copyright.textContent = translations[lang].copyright;
  footerLinks.forEach(link => {
    const key = link.textContent.toLowerCase();
    if (translations[lang][key]) {
      link.textContent = translations[lang][key];
    }
  });

  // Update document language
  document.documentElement.lang = lang;
}
