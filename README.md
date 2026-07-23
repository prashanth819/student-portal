# TKREC Student Portal

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

A premium, highly-interactive, mobile-first student portal developed for Teegala Krishna Reddy Engineering College (TKREC). The application features a stunning **iOS Glassmorphism** design system, delivering a native-app feel directly within the browser.

---

## 🚀 Technologies Used

This project relies on a lightweight, ultra-fast modern web stack without heavy frameworks like React or Angular, proving that vanilla web technologies can still build highly complex Single Page Applications (SPAs).

- **Bundler & Dev Server:** [Vite](https://vitejs.dev/)
- **Core Logic:** Vanilla TypeScript (`.ts`)
- **Structure:** Semantic HTML5
- **Styling & Theming:** Custom Vanilla CSS3 (CSS Variables, Flexbox/Grid, iOS Blur Filters)
- **Data Visualization:** [Chart.js](https://www.chartjs.org/) for rendering dynamic, responsive canvas graphs.
- **Data Backend:** Externally hosted JSON mock APIs.

---

## ⚙️ How It Works (Architecture)

### 1. Single Page Application (SPA) Routing
The entire application lives inside a single `index.html` file. 
- The `src/main.ts` entry point acts as the controller. It checks `localStorage` for authentication tokens.
- If the user isn't authenticated, the DOM is injected with the `Login.ts` interface.
- Once authenticated, the DOM is cleared and injected with the `Dashboard.ts` layout shell. 

### 2. Tab Navigation System
Navigation is fully client-side. When a user taps a sidebar button (e.g., "Academics" or "Calendar"), a function instantly clears the `#main-content` HTML container and dynamically re-injects the specific components for that tab. This avoids page reloads and provides a buttery-smooth experience.

### 3. Data Fetching & State
All student grades, timetable schedules, and user profiles are fetched asynchronously from remote Mock API endpoints in `src/api/fetchData.ts`. This data is cached during the session so toggling between tabs is instant. 
To support offline persistence for the "Mark Attendance" feature, interaction states are serialized and saved back into the browser's native `localStorage`.

### 4. iOS Glassmorphism Engine
The styling (`global.css`) is meticulously crafted to mimic modern Apple/iOS design:
- Deep background blurs using `backdrop-filter: blur(40px) saturate(200%)`.
- Native-feeling "squircle" border-radiuses and subtle translucent white borders.
- Floating animated geometric background layers.
- A fully responsive CSS Grid that seamlessly adapts from widescreen desktop layouts down to narrow mobile smartphone viewports.

---

## 🌟 Core Features

- **Personalized Dashboard:** Displays real-time CGPA metrics, academic trend indicators, and a dynamic Chart.js Doughnut chart tracking overall attendance.
- **Academics Hub:** A comprehensive week-view Timetable grid and subject catalog, perfectly scaled for horizontal mobile swiping.
- **Attendance Insights:** Day-wise detailed breakdowns and subject-by-subject attendance percentage calculators.
- **Events Calendar:** A visual smart calendar color-coding holidays, exams, and institutional events natively using CSS Grid constraints.
- **Theme Engine:** Integrated Light / Dark / System modes utilizing CSS custom properties.
- **Attendance Simulation Form:** Allows lecturers or admins to select a mocked student & subject to log attendance digitally via styled glass-dropdown interfaces.

---

## 🛠️ Local Setup & Deployment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Local Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```
   *This compiles all TypeScript down to raw JavaScript and minifies the CSS/HTML into the `/dist` folder, which is ready to drop into any server (like Vercel, Netlify, or Apache).*
