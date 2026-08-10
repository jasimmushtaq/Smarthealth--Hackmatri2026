
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'patient');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own role on signup" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  state TEXT,
  district TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  specialization TEXT,
  hospital_name TEXT,
  room_number TEXT,
  state TEXT,
  district TEXT,
  area TEXT,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  consultation_fee NUMERIC(10,2) DEFAULT 0,
  languages TEXT[] DEFAULT '{}',
  profile_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'not_available', 'on_leave')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view doctors" ON public.doctors
  FOR SELECT USING (true);
CREATE POLICY "Doctors can insert own record" ON public.doctors
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Doctors can update own record" ON public.doctors
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any doctor" ON public.doctors
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete any doctor" ON public.doctors
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Availability slots table
CREATE TABLE public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT end_after_start CHECK (end_time > start_time)
);
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view slots" ON public.availability_slots
  FOR SELECT USING (true);
CREATE POLICY "Doctors can manage own slots" ON public.availability_slots
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid())
  );
CREATE POLICY "Doctors can update own slots" ON public.availability_slots
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid())
  );
CREATE POLICY "Doctors can delete own slots" ON public.availability_slots
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid())
  );

-- Doctor leaves table
CREATE TABLE public.doctor_leaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT leave_end_after_start CHECK (end_date >= start_date)
);
ALTER TABLE public.doctor_leaves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view leaves" ON public.doctor_leaves
  FOR SELECT USING (true);
CREATE POLICY "Doctors can manage own leaves" ON public.doctor_leaves
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid())
  );
CREATE POLICY "Doctors can delete own leaves" ON public.doctor_leaves
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid())
  );

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_availability_slots_updated_at
  BEFORE UPDATE ON public.availability_slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.availability_slots;
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctor_leaves;

-- Indexes
CREATE INDEX idx_doctors_state ON public.doctors(state);
CREATE INDEX idx_doctors_specialization ON public.doctors(specialization);
CREATE INDEX idx_doctors_status ON public.doctors(status);
CREATE INDEX idx_availability_doctor ON public.availability_slots(doctor_id);
CREATE INDEX idx_leaves_doctor ON public.doctor_leaves(doctor_id);
