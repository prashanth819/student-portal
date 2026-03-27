import Chart from 'chart.js/auto';
import { getCurrentUser, logout } from '../auth/authService';
import { toggleTheme } from '../utils/theme';
import { fetchAcademicData, AcademicData, StudentData } from '../api/fetchData';

type Tab = 'dashboard' | 'academics' | 'attendance' | 'calendar' | 'mark';
let activeTab: Tab = 'dashboard';

export async function renderDashboard(container: HTMLElement) {
  const user = getCurrentUser();
  if (!user) {
    logout();
    return;
  }
  
  container.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
      <div class="glass-panel animate-fade-in-up"><h2>Loading Portal...</h2></div>
    </div>
  `;

  try {
    const academic = await fetchAcademicData();
    initAppShell(container, user, academic);
  } catch (err) {
    container.innerHTML = `
      <div class="glass-panel" style="margin: 2rem; max-width: 500px;">
        <h2 style="color: var(--danger)">Failed to load academic data.</h2>
        <button id="db-logout" class="btn mt-4">Logout</button>
      </div>
    `;
    document.getElementById('db-logout')?.addEventListener('click', () => logout());
  }
}

function initAppShell(container: HTMLElement, user: StudentData, academic: AcademicData) {
  const shellHTML = `
    <div class="bg-shapes">
      <div class="shape shape-1"></div><div class="shape shape-2"></div><div class="shape shape-3"></div>
    </div>
    <div class="layout-container" style="display: flex; min-height: 100vh; position: relative;">
      <div id="mobile-overlay" class="mobile-overlay"></div>
      
      <!-- Mobile Header -->
      <div class="mobile-only glass-panel" style="justify-content: space-between; align-items: center; padding: 1rem 1.5rem; margin: 1rem; border-radius: 16px;">
        <h2 style="color: var(--accent-primary); font-weight: 700;">TKREC Portal</h2>
        <button type="button" id="hamburger-btn" style="background:none; border:none; color:var(--text-primary); cursor:pointer;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      <!-- Sidebar -->
      <aside id="sidebar" class="sidebar glass-panel animate-fade-in-up" style="width: 280px; margin: 1.5rem; border-radius: 24px; display: flex; flex-direction: column; padding: 2.5rem 1.5rem;">
        <div class="desktop-only" style="text-align: center; margin-bottom: 2.5rem;">
          <h2 style="color: var(--accent-primary); font-size: 2.2rem; font-weight: 700; letter-spacing: -1px; margin-bottom: 0.2rem;">TKREC</h2>
          <span class="text-secondary" style="font-size: 1rem; font-weight: 500;">Student Dashboard</span>
        </div>
        
        <nav id="nav-links" style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
          <button type="button" class="nav-btn ${activeTab==='dashboard'?'active':''}" data-tab="dashboard">Overview</button>
          <button type="button" class="nav-btn ${activeTab==='academics'?'active':''}" data-tab="academics">Academics</button>
          <button type="button" class="nav-btn ${activeTab==='attendance'?'active':''}" data-tab="attendance">Detailed Attendance</button>
          <button type="button" class="nav-btn ${activeTab==='calendar'?'active':''}" data-tab="calendar">Events Calendar</button>
          <button type="button" class="nav-btn ${activeTab==='mark'?'active':''}" data-tab="mark">Mark Attendance</button>
        </nav>
        
        <div style="margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 1.5rem; text-align: center;">
          <button type="button" id="theme-btn" class="btn" style="width: 100%; margin-bottom: 0.75rem; background: rgba(255,255,255,0.05); color: var(--text-primary); border: 1px solid var(--glass-border);">Toggle Theme</button>
          <button type="button" id="logout-btn" class="btn" style="width: 100%; background: var(--danger);">Logout</button>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main id="main-content" class="main-content" style="flex: 1; padding: 1.5rem 2rem 1.5rem 0.5rem; overflow-y: auto; height: 100vh; overflow-x: hidden;">
      </main>
    </div>
  `;
  container.innerHTML = shellHTML;

  const sidebar = document.getElementById('sidebar')!;
  const overlay = document.getElementById('mobile-overlay')!;
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links')!;
  const mainContent = document.getElementById('main-content')!;

  const toggleMenu = (e?: Event) => {
    if(e) e.stopPropagation();
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
      overlay.style.visibility = 'visible';
      overlay.style.opacity = '1';
    } else {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.style.visibility = 'hidden', 300);
    }
  };
  hamburger?.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  document.getElementById('theme-btn')?.addEventListener('click', () => toggleTheme());
  document.getElementById('logout-btn')?.addEventListener('click', () => logout());

  Array.from(navLinks.children).forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-tab') as Tab;
      Array.from(navLinks.children).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (sidebar.classList.contains('open')) toggleMenu();
      renderTabContent();
    });
  });

  const renderTabContent = () => {
    mainContent.innerHTML = '';
    
    // Header
    const header = document.createElement('header');
    header.className = 'glass-panel animate-fade-in-up';
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; margin-bottom: 1.5rem; border-radius: 20px;';
    header.innerHTML = `
      <div>
        <h1 style="font-size: 1.8rem; margin-bottom: 0.2rem; font-weight: 700;">Hello, ${user.profile.name} 👋</h1>
        <p class="text-secondary" style="font-size: 1rem;">${user.profile.course} in ${user.profile.branch} &bull; Year ${user.profile.year} (Sem ${user.profile.semester})</p>
      </div>
      <div style="text-align: right;" class="desktop-only">
        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.2rem;">Roll Number</div>
        <div style="font-family: monospace; font-size: 1.2rem; font-weight: 700; color: var(--accent-primary); border: 1px solid var(--accent-primary); padding: 0.2rem 0.8rem; border-radius: 8px; background: rgba(59, 130, 246, 0.1);">${user.profile.rollNo}</div>
      </div>
    `;
    mainContent.appendChild(header);

    const tabContainer = document.createElement('div');
    if (activeTab === 'dashboard') injectDashboard(tabContainer, user, academic);
    else if (activeTab === 'academics') injectAcademics(tabContainer, user, academic);
    else if (activeTab === 'attendance') injectDetailedAttendance(tabContainer, user, academic);
    else if (activeTab === 'calendar') injectCalendar(tabContainer, user, academic);
    else if (activeTab === 'mark') injectMarkAttendance(tabContainer, user, academic);
    
    mainContent.appendChild(tabContainer);
  };

  renderTabContent();
}

function injectDashboard(container: HTMLElement, user: StudentData, _academic: AcademicData) {
  container.innerHTML = `
    <div class="widgets-grid mb-4">
      <div class="glass-panel animate-fade-in-up" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 3rem 2rem;">
        <h3 class="text-secondary mb-3" style="font-size: 1.2rem; font-weight: 500;">Current CGPA</h3>
        <div style="font-size: 5rem; font-weight: 700; color: ${user.performance.gpa >= 8 ? 'var(--success)' : user.performance.gpa >= 6 ? 'var(--warning)' : 'var(--danger)'}; line-height: 1;">
          ${user.performance.gpa}
        </div>
        <div style="margin-top: 1.5rem; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border);">
          <span style="font-weight: bold;">${user.performance.trend === 'up' ? '↗ Improving' : user.performance.trend === 'stable' ? '→ Stable' : '↘ Needs Attention'}</span>
        </div>
      </div>

      <div class="glass-panel animate-fade-in-up delay-1" style="position: relative; height: 320px; display: flex; flex-direction: column; align-items: center;">
         <h3 class="text-secondary mb-3" style="align-self: flex-start; font-size: 1.2rem; font-weight: 500;">Overall Attendance</h3>
         <div style="position: relative; width: 220px; height: 220px; margin: 0 auto; display: flex; justify-content: center; align-items: center;">
            <canvas id="attnChart"></canvas>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none;">
              <span style="font-size: 2.2rem; font-weight: 700; color: ${user.attendance.overallPercentage >= 75 ? 'var(--success)' : user.attendance.overallPercentage >= 65 ? 'var(--warning)' : 'var(--danger)'};">
                ${user.attendance.overallPercentage}%
              </span>
            </div>
         </div>
      </div>
    </div>
    
    <div class="glass-panel animate-fade-in-up delay-2">
      <h3 class="text-secondary mb-4" style="font-size: 1.2rem; font-weight: 500;">Academic Performance (Internal vs External)</h3>
      <div style="height: 300px; width: 100%;">
        <canvas id="perfChart"></canvas>
      </div>
    </div>
  `;

  setTimeout(() => {
    const ctxA = document.getElementById('attnChart') as HTMLCanvasElement;
    if (ctxA) {
      new Chart(ctxA, {
        type: 'doughnut',
        data: {
          labels: ['Present', 'Absent'],
          datasets: [{
            data: [user.attendance.present, user.attendance.absent],
            backgroundColor: [user.attendance.overallPercentage >= 75 ? '#10b981' : '#f59e0b', 'rgba(255,255,255,0.1)'],
            borderWidth: 0
          }]
        },
        options: { cutout: '80%', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    const ctxP = document.getElementById('perfChart') as HTMLCanvasElement;
    if (ctxP) {
      new Chart(ctxP, {
        type: 'bar',
        data: {
          labels: user.performance.subjects.map((s:any) => s.name),
          datasets: [
            { label: 'Internal', data: user.performance.subjects.map((s:any) => s.internalMarks), backgroundColor: '#3b82f6', borderRadius: 6 },
            { label: 'External', data: user.performance.subjects.map((s:any) => s.externalMarks), backgroundColor: '#8b5cf6', borderRadius: 6 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { font: { family: 'Outfit', size: 13, weight: 500 }, color: 'rgba(150,150,150,1)' } },
            x: { grid: { display: false }, ticks: { font: { family: 'Outfit', size: 13, weight: 500 }, color: 'rgba(150,150,150,1)' } }
          },
          plugins: { legend: { labels: { font: { family: 'Outfit', size: 13, weight: 500 }, color: 'rgba(150,150,150,1)' } } }
        }
      });
    }
  }, 100);
}

function injectAcademics(container: HTMLElement, _user: StudentData, academic: AcademicData) {
  container.innerHTML = `
    <div class="glass-panel animate-fade-in-up mb-4">
      <h3 class="mb-3">Current Semester TimeTable :: B.Tech. IV Semester</h3>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Week Day/Time</th>
              <th>09.40 am to 10.40 am</th>
              <th>10.40 am to 11.40 am</th>
              <th>11.40 am to 12.40 pm</th>
              <th>01.20 pm to 02.20 pm</th>
              <th>02.20 pm to 03.20 pm</th>
              <th>03.20 pm to 04.20 pm</th>
            </tr>
          </thead>
          <tbody>
            ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
              const periods = (academic.timetable as any)[day] || [];
              return `
                <tr>
                  <td style="font-weight: 600;">${day}</td>
                  ${[0,1,2,3,4,5].map(i => {
                    const p = periods[i];
                    return p ? `<td><div style="font-weight:600; color:var(--text-primary); margin-bottom:0.2rem;">${p.subject}</div><div class="text-secondary" style="font-size:0.8rem;">${p.subCode || ''}</div></td>` : `<td class="text-secondary">-</td>`;
                  }).join('')}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="glass-panel animate-fade-in-up delay-1">
      <h3 class="mb-3">Current Semester Subjects List</h3>
      <div class="table-responsive">
        <table>
          <thead><tr><th>Code</th><th>Subject Name</th><th>Credits</th><th>Type</th></tr></thead>
          <tbody>
            ${academic.subjectsCurrent.map((s:any) => `<tr><td style="font-family:monospace; font-size:1.05rem;">${s.subCode}</td><td style="font-weight:500;">${s.subjectName}</td><td>${s.credits}</td><td><span style="background:rgba(59,130,246,0.15); color:var(--accent-primary); padding:0.2rem 0.6rem; border-radius:6px; font-weight:600; font-size:0.85rem;">${s.subType}</span></td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function injectDetailedAttendance(container: HTMLElement, user: StudentData, _academic: AcademicData) {
  const days = [
    { date: '27-03-2026', day: 'Friday', p: ['DWDM Lab', 'DWDM Lab', 'DBMS', 'SE', 'DWDM', 'Break'] },
    { date: '26-03-2026', day: 'Thursday', p: ['DBMS', 'WT', 'DAA', 'Break', 'DBMS Lab', 'DBMS Lab'] },
    { date: '25-03-2026', day: 'Wednesday', p: ['DAA', 'WT', 'DBMS', 'Break', 'WT Lab', 'WT Lab'] },
    { date: '24-03-2026', day: 'Tuesday', p: ['AECS Lab', 'AECS Lab', 'DWDM', 'DAA', 'SE', 'Break'] }
  ];

  container.innerHTML = `
    <div class="glass-panel animate-fade-in-up mb-4">
      <h3 class="mb-3">Student Attendance Report (Consolidated)</h3>
      <div class="table-responsive">
        <table>
          <thead><tr><th>Subject</th><th>Code</th><th>Conducted</th><th>Present</th><th>Percentage</th></tr></thead>
          <tbody>
            ${user.attendance.subjects.map((s:any) => `<tr>
              <td style="font-weight:500;">${s.name}</td>
              <td style="font-family:monospace;">${s.code}</td>
              <td>${s.total}</td>
              <td style="color:var(--success); font-weight:600;">${s.present}</td>
              <td><span style="padding:0.2rem 0.6rem; border-radius:12px; font-weight:600; background:${s.percentage>=75?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)'}; color:${s.percentage>=75?'var(--success)':'var(--danger)'};">${s.percentage}%</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="glass-panel animate-fade-in-up delay-1">
      <h3 class="mb-3">Day-wise Detailed Attendance</h3>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>WeekDay</th>
              <th>Period 1</th>
              <th>Period 2</th>
              <th>Period 3</th>
              <th>Period 4</th>
              <th>Period 5</th>
              <th>Period 6</th>
            </tr>
          </thead>
          <tbody>
            ${days.map(d => `
              <tr>
                <td style="font-family:monospace;">${d.date}</td>
                <td>${d.day}</td>
                ${d.p.map(period => `
                  <td>${period !== 'Break' ? `<span style="color:var(--success); font-weight:600; font-size:0.9rem;">Present</span><br/><small class="text-secondary">(${period})</small>` : `<span class="text-secondary">-</span>`}</td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function injectCalendar(container: HTMLElement, _user: StudentData, _academic: AcademicData) {
  const days = Array.from({length: 31}, (_, i) => i + 1);
  const eventsMap: Record<number, {title: string, type: 'exam'|'holiday'|'event'}> = {
    11: { title: 'First Mid Exams', type: 'exam' },
    12: { title: 'First Mid Exams', type: 'exam' },
    13: { title: 'First Mid Exams', type: 'exam' },
    14: { title: 'First Mid Exams', type: 'exam' },
    8: { title: 'Sunday', type: 'holiday' },
    1: { title: 'Sunday', type: 'holiday' },
    22: { title: 'Sunday', type: 'holiday' },
    29: { title: 'Sunday', type: 'holiday' },
    17: { title: 'Fest', type: 'event' }
  };
  const today = 27;

  container.innerHTML = `
    <div class="glass-panel animate-fade-in-up">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <h2 style="font-size: 2rem;">March 2026</h2>
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.9rem;"><span style="width:16px; height:16px; border-radius:4px; border:2px solid var(--warning); background:rgba(245,158,11,0.2);"></span> Today</div>
          <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.9rem;"><span style="width:16px; height:16px; border-radius:4px; border:1px solid rgba(239,68,68,0.3); background:rgba(239,68,68,0.2);"></span> Holiday</div>
          <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.9rem;"><span style="width:16px; height:16px; border-radius:4px; border:1px solid rgba(59,130,246,0.3); background:rgba(59,130,246,0.2);"></span> Exam</div>
          <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.9rem;"><span style="width:16px; height:16px; border-radius:4px; border:1px solid rgba(16,185,129,0.3); background:rgba(16,185,129,0.2);"></span> Event</div>
        </div>
      </div>

      <div class="calendar-grid">
        <div class="calendar-header">Sun</div><div class="calendar-header">Mon</div><div class="calendar-header">Tue</div><div class="calendar-header">Wed</div><div class="calendar-header">Thu</div><div class="calendar-header">Fri</div><div class="calendar-header">Sat</div>
        
        ${days.map(d => {
          const ev = eventsMap[d];
          let calClass = ev ? `cal-${ev.type}` : '';
          if (d === today) calClass += ' cal-today';
          return `
            <div class="calendar-day ${calClass}">
              <div class="calendar-date">${d}</div>
              ${ev ? `<div class="calendar-event" style="color: ${ev.type==='holiday'?'var(--danger)':ev.type==='exam'?'var(--accent-primary)':'var(--success)'}; background: ${ev.type==='holiday'?'rgba(239,68,68,0.1)':ev.type==='exam'?'rgba(59,130,246,0.1)':'rgba(16,185,129,0.1)'}; width:100%; text-align:center;">${ev.title}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function injectMarkAttendance(container: HTMLElement, user: StudentData, academic: AcademicData) {
  container.innerHTML = `
    <div class="glass-panel animate-fade-in-up mb-4" style="max-width: 600px; margin: 0 auto;">
      <h3 class="mb-2" style="font-size: 1.6rem;">Mark Attendance</h3>
      <p class="text-secondary mb-4">Select a student and confirm their presence for today's classes.</p>
      
      <div class="mb-3">
        <label class="text-secondary mb-1" style="display:block; font-weight: 500;">Select Student</label>
        <select class="input-glass">
          <option value="${user.id}">${user.profile.name} (${user.profile.rollNo})</option>
        </select>
      </div>
      
      <div class="mb-4">
        <label class="text-secondary mb-1" style="display:block; font-weight: 500;">Select Subject</label>
        <select class="input-glass">
          ${academic.subjectsCurrent.map((s:any) => `<option value="${s.subCode}">${s.subjectName}</option>`).join('')}
        </select>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2.5rem;">
        <button type="button" id="mark-btn" class="btn" style="width: 100%; font-size: 1.15rem; padding: 1.25rem; border-radius: 20px;">Submit Attendance Record</button>
      </div>
    </div>
  `;

  const btn = container.querySelector('#mark-btn') as HTMLButtonElement;
  btn?.addEventListener('click', () => {
    btn.style.background = 'var(--success)';
    btn.style.boxShadow = '0 6px 20px rgba(52, 199, 89, 0.4)';
    btn.textContent = 'Marked';
    btn.disabled = true;
  });
}
