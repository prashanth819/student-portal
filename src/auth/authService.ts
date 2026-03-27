import { fetchStudentsData, StudentData } from '../api/fetchData';

export async function login(email: string, pass: string): Promise<StudentData> {
  const students = await fetchStudentsData();
  const user = students.find((s) => s.login.email === email && s.login.password === pass);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  throw new Error('Invalid email or password');
}

export function logout() {
  localStorage.removeItem('currentUser');
  window.location.reload();
}

export function getCurrentUser(): StudentData | null {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch(e) {
    return null;
  }
}
