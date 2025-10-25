-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create guards table
CREATE TABLE public.guards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.guards ENABLE ROW LEVEL SECURITY;

-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create schedules table
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guard_id UUID REFERENCES public.guards(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guard_id UUID REFERENCES public.guards(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES public.schedules(id) ON DELETE SET NULL,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create visitors table
CREATE TABLE public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  purpose TEXT,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create occurrence_book table (OB book)
CREATE TABLE public.occurrence_book (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reported_by UUID REFERENCES auth.users(id),
  severity TEXT DEFAULT 'low',
  status TEXT DEFAULT 'open',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.occurrence_book ENABLE ROW LEVEL SECURITY;

-- RLS Policies using security definer function

-- User roles policies
CREATE POLICY "Admins can manage all user roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Guards policies
CREATE POLICY "Authenticated users can view guards"
ON public.guards FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Admins can manage guards"
ON public.guards FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Clients policies
CREATE POLICY "Authenticated users can view clients"
ON public.clients FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Admins can manage clients"
ON public.clients FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Schedules policies
CREATE POLICY "Authenticated users can view schedules"
ON public.schedules FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Admins can manage schedules"
ON public.schedules FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Attendance policies
CREATE POLICY "Authenticated users can view attendance"
ON public.attendance FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Admins can manage attendance"
ON public.attendance FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Visitors policies
CREATE POLICY "Authenticated users can view visitors"
ON public.visitors FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Admins can manage visitors"
ON public.visitors FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Payments policies
CREATE POLICY "Authenticated users can view payments"
ON public.payments FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Admins can manage payments"
ON public.payments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Occurrence book policies
CREATE POLICY "Authenticated users can view occurrence book"
ON public.occurrence_book FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Authenticated users can create occurrences"
ON public.occurrence_book FOR INSERT
TO authenticated WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Admins can manage occurrence book"
ON public.occurrence_book FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.guards FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.schedules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.visitors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.occurrence_book FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_guards_status ON public.guards(status);
CREATE INDEX idx_schedules_guard_id ON public.schedules(guard_id);
CREATE INDEX idx_schedules_client_id ON public.schedules(client_id);
CREATE INDEX idx_attendance_guard_id ON public.attendance(guard_id);
CREATE INDEX idx_visitors_client_id ON public.visitors(client_id);
CREATE INDEX idx_payments_client_id ON public.payments(client_id);
CREATE INDEX idx_occurrence_book_status ON public.occurrence_book(status);