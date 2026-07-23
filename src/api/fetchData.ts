const ACADEMIC_API = 'https://69c696abf272266f3eacd40a.mockapi.io/academic';
const STUDENTS_API = 'https://69c696abf272266f3eacd40a.mockapi.io/students';

export interface AcademicData {
  id: string;
  timetable: any;
  subjectsCurrent: any[];
  subjectsHistory: any[];
  academicCalendar: any[];
  events: any[];
}

export interface StudentData {
  id: string;
  type: string;
  login: any;
  profile: any;
  mentor: any;
  attendance: any;
  performance: any;
}

let academicDataCache: AcademicData | null = null;
let studentsDataCache: StudentData[] = [];

export async function fetchAcademicData(): Promise<AcademicData> {
  if (academicDataCache) return academicDataCache;
  const res = await fetch(ACADEMIC_API);
  if (!res.ok) throw new Error('Failed to fetch academic data');
  const data = await res.json();
  academicDataCache = data[0];
  return academicDataCache!;
}

export async function fetchStudentsData(): Promise<StudentData[]> {
  if (studentsDataCache.length > 0) return studentsDataCache;
  const res = await fetch(STUDENTS_API);
  if (!res.ok) throw new Error('Failed to fetch students data');
  const data: StudentData[] = await res.json();

  data.forEach(student => {
    if (student.login.email === 'good@student.com') {
      student.login.email = 'prashanth@trkcet.com';
      student.profile.name = 'Jakka Prashanth';
    } else if (student.login.email === 'average@student.com') {
      student.login.email = 'karthikeya@tkrcet.com';
      student.profile.name = 'Karthikeya';
    } else if (student.login.email === 'dull@student.com') {
      student.login.email = 'tejeshkumar@tkrcet.com';
      student.profile.name = 'Tejesh Kumar';
    }
  });

  studentsDataCache = data;
  return studentsDataCache;
}
