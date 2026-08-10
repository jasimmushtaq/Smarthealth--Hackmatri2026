import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Landing from "@/components/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ClinicDashboard from "./pages/ClinicDashboard";
import ClinicProfile from "./pages/ClinicProfile";
import NearbyClinics from "./pages/NearbyClinics";
import AmbulanceDashboard from "./pages/AmbulanceDashboard";
import NearbyAmbulances from "./pages/NearbyAmbulances";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";
import FAQs from "./pages/FAQs";
import TermsConditions from "./pages/TermsConditions";
import Blog from "./pages/Blog";
import UserProfile from "./pages/UserProfile";
import { AlertTriangle } from "lucide-react";
import { hasValidSupabaseConfig } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function SupabaseWarningBanner() {
  if (hasValidSupabaseConfig) return null;

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 flex items-center justify-center gap-2 font-medium text-sm text-center shadow-md relative z-50 animate-pulse">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>
        <strong>Database Connection Needed:</strong> Please configure your Supabase publishable key in <code>.env</code> file.
      </span>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, role, isApproved, loading, signOut } = useAuth();
  // Show spinner while auth is loading
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  // Not logged in
  if (!user) return <Navigate to="/login" />;
  // If roles are required but role hasn't loaded yet, show spinner (role is fetched async)
  if (allowedRoles && !role) return <div className="flex items-center justify-center min-h-screen"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  // Wrong role
  if (allowedRoles && role && !allowedRoles.includes(role)) return <Navigate to="/" />;

  // Restrict unapproved doctors
  if (role === "doctor" && isApproved === false) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-muted/30">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-border text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Profile Pending Approval</h2>
          <p className="text-sm text-muted-foreground">
            Thank you for registering! Your doctor profile has been created and is currently pending administrator approval.
          </p>
          <p className="text-xs text-muted-foreground border-t pt-4">
            Once the administrator approves your profile, you will be able to access your dashboard.
          </p>
          <button 
            onClick={() => signOut()}
            className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Restrict unapproved clinics
  if (role === "clinic" && isApproved === false) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-muted/30">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-border text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Clinic Pending Approval</h2>
          <p className="text-sm text-muted-foreground">
            Thank you for registering your clinic! Your clinic profile is currently pending administrator approval.
          </p>
          <p className="text-xs text-muted-foreground border-t pt-4">
            Once the administrator approves your clinic, you will be able to access the dashboard to add location details.
          </p>
          <button 
            onClick={() => signOut()}
            className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

import { ThemeProvider } from "@/components/theme-provider";

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="swasthyacare-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SupabaseWarningBanner />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<Navigate to="/?auth=login" replace />} />
                <Route path="/signup" element={<Navigate to="/?auth=signup" replace />} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/doctors/:id" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
                <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
                <Route path="/clinic/dashboard" element={<ProtectedRoute allowedRoles={["clinic"]}><ClinicDashboard /></ProtectedRoute>} />
                <Route path="/clinics/:id" element={<ClinicProfile />} />
                <Route path="/ambulance/dashboard" element={<ProtectedRoute allowedRoles={["ambulance"]}><AmbulanceDashboard /></ProtectedRoute>} />
                <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/nearby-clinics" element={<NearbyClinics />} />
                <Route path="/nearby-ambulances" element={<NearbyAmbulances />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
