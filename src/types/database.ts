export interface Guard {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Client {
  id: string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface Schedule {
  id: string;
  guard_id: string;
  client_id: string;
  shift_start: string;
  shift_end: string;
  created_at: string;
  guard?: Guard;
  client?: Client;
}

export interface Attendance {
  id: string;
  guard_id: string;
  schedule_id: string;
  check_in: string;
  check_out?: string;
  created_at: string;
  guard?: Guard;
  schedule?: Schedule;
}

export interface Visitor {
  id: string;
  full_name: string;
  purpose?: string;
  check_in: string;
  check_out?: string;
  client_id: string;
  created_at: string;
  client?: Client;
}

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_date: string;
  created_at: string;
  client?: Client;
}