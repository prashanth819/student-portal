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
  studentsDataCache = await res.json();
  return studentsDataCache;
}
