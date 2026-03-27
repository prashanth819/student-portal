import './styles/global.css';
import { initTheme } from './utils/theme';
import { getCurrentUser } from './auth/authService';
import { renderLogin } from './components/Login';
import { renderDashboard } from './components/Dashboard';

// Initialize Theme
initTheme();

const app = document.querySelector<HTMLDivElement>('#app')!;

function initApp() {
  const user = getCurrentUser();
  if (user) {
    renderDashboard(app);
  } else {
    renderLogin(app, () => {
      // Re-render on successful login
      app.innerHTML = '';
      initApp();
    });
  }
}

initApp();

// Global CSS for shake animation on error
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);
