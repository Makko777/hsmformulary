// Force dark mode and disable theme switching

(function() {
  // Force dark mode
  document.documentElement.className = 'dark-mode';

  // Set dark mode in localStorage
  localStorage.setItem('darkMode', 'enabled');

  // Disable theme switching by removing event listeners
  document.addEventListener('DOMContentLoaded', () => {
      // Keep dark mode enforced
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
  });
})();
