# TKREC Student Portal - Project Softcopy

## 1. Project Overview
The TKREC (Teegala Krishna Reddy Engineering College) Student Portal is a modern, responsive, and highly interactive Single Page Application (SPA). It replaces the legacy system with a cutting-edge **iOS Glassmorphism** design, offering a seamless user experience across both desktop and mobile devices.

## 2. Technologies Used
- **Vite:** A lightning-fast modern build tool and development server.
- **TypeScript:** Adds static typing to JavaScript for robust core logic and fewer bugs during development.
- **HTML5 & Vanilla CSS3:** Used to structure the application and build the custom "Glassmorphism" design engine natively, bypassing heavy frameworks like Tailwind or Bootstrap.
- **Chart.js:** A powerful data visualization library used to render the dynamic doughnut charts and performance bar charts.
- **REST APIs (MockAPI):** External API endpoints are used to hydrate the application with real-time academic timetables, events, and student profile data.

## 3. Core Architecture
The application runs as a **Single Page Application (SPA)**:
1. **Routing:** The `index.html` file serves as the master frame. The `src/main.ts` entry point acts as the client-side router, checking authentication tokens stored in `localStorage` and dynamically injecting the Login or Dashboard views into the DOM without ever refreshing the page.
2. **Tab Navigation:** Our custom tab-system flushes the `#main-content` container and re-renders the selected view (Overview, Academics, Attendance, Calendar) on the fly.
3. **Data State:** The `fetchData.ts` module fetches JSON from our endpoints and locally caches it in memory, allowing instant transitions between tabs. 

## 4. Key Features & Interface

### A. The Dashboard (Overview)
Displays the student's real-time CGPA, a trend analyzer (Improving/Stable), a responsive `Chart.js` Doughnut chart showcasing their attendance health, and a dynamic bar chart comparing internal vs. external marks across subjects.

*[Insert Screenshot of the New Dashboard View Here]*

### B. Academics Hub
Dynamically renders the "Current Semester Time Table" natively in a responsive swipeable grid, mapping 6 periods a day to their respective subjects. Also includes the exhaustive "Subjects List" complete with credit tracking.

*[Insert Screenshot of the Academics Timetable Here]*

### C. Detailed Attendance
Breaks down attendance sequentially:
- A consolidated Subject-wise percentage tracker.
- A highly granular Day-wise table detailing hour-by-hour presence/absence ratios matching the old UI.

*[Insert Screenshot of the Detailed Attendance Tables Here]*

### D. Events Calendar
A CSS-Grid powered monthly calendar accurately placing Holidays (Red), Exams (Blue), and Events (Green) into their exact numerical slots with an interactive hover scale effect.

*[Insert Screenshot of the Calendar View Here]*

### E. Mock Attendance Terminal (Admin/Lecturer)
Features a form consisting of styled Glass-dropdowns allowing administrators to select customized student profiles (like Jakka Prashanth or Karthikeya) and simulate submitting attendance records persistently into the browser's local storage.

*[Insert Screenshot of the Mark Attendance Tab Here]*
