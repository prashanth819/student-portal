import { login } from '../auth/authService';
import { toggleTheme } from '../utils/theme';

export function renderLogin(container: HTMLElement, onLoginSuccess: () => void) {
  container.innerHTML = `
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <button id="theme-toggle" class="btn" style="position: absolute; top: 20px; right: 20px; z-index: 10; padding: 0.5rem 1rem;">
      Toggle Theme
    </button>

    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px;">
      <div class="glass-panel animate-fade-in-up" style="max-width: 420px; width: 100%;">
        <div class="text-center mb-2 animate-fade-in-up delay-1">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
        </div>
        <h1 class="text-center mb-1 animate-fade-in-up delay-1" style="font-size: 2.2rem; font-weight: 700; letter-spacing: -0.5px;">TKREC Portal</h1>
        <p class="text-center text-secondary mb-4 animate-fade-in-up delay-2" style="font-size: 1.1rem;">Welcome back, student.</p>
        
        <form id="login-form" class="animate-fade-in-up delay-2">
          <div class="mb-3">
            <input type="email" id="email" class="input-glass" placeholder="Email Address" required />
          </div>
          <div class="mb-4">
            <input type="password" id="password" class="input-glass" placeholder="Password" required />
          </div>
          <button type="submit" class="btn animate-fade-in-up delay-3" style="width: 100%; font-size: 1.2rem;">Sign In</button>
        </form>
        
        <div id="error-message" style="color: var(--danger); text-align: center; margin-top: 1rem; min-height: 24px; font-weight: 500;"></div>
        
        <div style="margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 1.5rem;" class="text-center text-secondary animate-fade-in-up delay-3">
          <small style="opacity: 0.8;">Test Accounts:<br/>prashanth@trkcet.com | karthikeya@tkrcet.com | Abhiram@tkrcet.com<br/>Password: 123456</small>
        </div>
      </div>
    </div>
  `;

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    toggleTheme();
  });

  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value.trim();
    const errorEl = document.getElementById('error-message')!;
    const btn = e.target as HTMLFormElement;
    const submitBtn = btn.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    try {
      submitBtn.textContent = 'Authenticating...';
      submitBtn.disabled = true;
      errorEl.textContent = '';
      
      await login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      submitBtn.textContent = 'Sign In';
      submitBtn.disabled = false;
      errorEl.style.color = 'var(--danger)';
      errorEl.textContent = err.message || 'Login failed';
      
      const panel = document.querySelector('.glass-panel') as HTMLElement;
      panel.style.animation = 'none';
      setTimeout(() => panel.style.animation = 'shake 0.4s ease-in-out', 10);
    }
  });
}
