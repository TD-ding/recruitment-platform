export interface User {
  id: number;
  email: string;
  role: 'seeker' | 'employer' | 'admin';
  name: string;
  phone?: string;
  avatar?: string;
}

export interface Job {
  id: number;
  company_id: number;
  title: string;
  description: string;
  requirements?: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  category?: string;
  experience?: string;
  education?: string;
  status: string;
  company_name: string;
  company_logo?: string;
  company_location?: string;
  company_description?: string;
  company_size?: string;
  company_industry?: string;
  company_website?: string;
  created_at: string;
}

export interface Company {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  industry?: string;
  size?: string;
  location: string;
  website?: string;
  logo?: string;
  status: string;
}

export interface Resume {
  id: number;
  title: string;
  name: string;
  phone?: string;
  email?: string;
  education?: string;
  experience?: string;
  skills?: string;
  self_intro?: string;
  is_default: number;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  user_id: number;
  resume_id: number;
  cover_letter?: string;
  status: 'pending' | 'viewed' | 'interview' | 'rejected' | 'accepted';
  job_title?: string;
  job_location?: string;
  salary_min?: number;
  salary_max?: number;
  company_name?: string;
  company_logo?: string;
  applicant_name?: string;
  created_at: string;
}
