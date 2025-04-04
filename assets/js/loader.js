document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("fade-out");
});
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

// Remove loader on page load and handle fade transitions
window.addEventListener('load', () => {
  preloader.style.opacity = '0';
  document.body.classList.remove('fade-out');
  document.body.classList.add('fade-in');
  setTimeout(() => preloader.remove(), 400);
});

  // Fade out before navigating away
  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.href, location.href);
    const sameOrigin = url.origin === location.origin;

    // Only handle same-origin links that navigate to a different path
    if (sameOrigin && url.pathname !== location.pathname) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');
        setTimeout(() => {
          window.location = link.href;
        }, 300); // match transition duration
      });
    }
  });