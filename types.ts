export enum Role {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST'
}

export enum JobType {
  FULL_TIME = 'Toàn thời gian',
  PART_TIME = 'Bán thời gian',
  FREELANCE = 'Tự do',
  REMOTE = 'Từ xa'
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: JobType;
  postedAt: string;
  description: string;
  requirements: string[];
  logo?: string;
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  resumeUrl?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateName: string;
  status: 'Pending' | 'Interview' | 'Rejected' | 'Hired';
  date: string;
}
