// assets/js/loader.js

// Create preloader container
const preloader = document.createElement('div');
preloader.id = 'preloader';
preloader.style.position = 'fixed';
preloader.style.top = 0;
preloader.style.left = 0;
preloader.style.width = '100%';
preloader.style.height = '100%';
preloader.style.background = '#fff';
preloader.style.display = 'flex';
preloader.style.justifyContent = 'center';
preloader.style.alignItems = 'center';
preloader.style.zIndex = 9999;
preloader.style.transition = 'opacity 0.4s ease';

// Create logo image
const logo = document.createElement('img');
logo.src = '/assets/images/logo.svg';
logo.alt = 'Loading...';
logo.style.width = '80px';
logo.style.animation = 'huePulse 1.2s infinite ease-in-out';

preloader.appendChild(logo);
document.body.appendChild(preloader);

// Add animation via JS-injected style
const style = document.createElement('style');
style.innerHTML = `
@keyframes huePulse {
  0% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(90deg); }
  100% { filter: hue-rotate(0deg); }
}
`;
document.head.appendChild(style);

// Remove loader on page load
window.addEventListener('load', () => {
  preloader.style.opacity = '0';
  setTimeout(() => preloader.remove(), 400);
});