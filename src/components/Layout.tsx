import { ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Stethoscope, LogOut, User, LayoutDashboard, Github, Linkedin, Menu, MapPin, Ambulance, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Chatbot } from "./Chatbot";

export function Layout({ children }: { children: ReactNode }) {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardPath = role === "doctor" ? "/doctor/dashboard" : role === "admin" ? "/admin" : role === "clinic" ? "/clinic/dashboard" : role === "ambulance" ? "/ambulance/dashboard" : role === "patient" ? "/patient/dashboard" : "/";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className={`sticky top-0 z-50 border-b shadow-sm ${!user ? 'bg-white/40 backdrop-blur-md border-white/20' : 'bg-card/80 backdrop-blur-sm'}`}>
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {user && (
              <Button variant="ghost" size="icon" onClick={() => navigate('/landing')} className="text-slate-500 hover:text-slate-900" title="Go to Public Site">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <img src="/logo.png" alt="SwasthyaCare Logo" className="h-8 sm:h-10 object-contain" />
              <span className="text-gradient hidden sm:inline-block">SwasthyaCare</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!user && (
              <>
                <nav className="hidden lg:flex items-center gap-8 mr-4 text-sm font-semibold text-slate-700">
                  <Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
                  <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link>
                  <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
                  <Link to="/faqs" className="hover:text-blue-600 transition-colors">FAQs</Link>
                  <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link>
                </nav>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="flex flex-col gap-6 pt-12">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <nav className="flex flex-col gap-4 text-base font-semibold text-slate-700">
                      <Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
                      <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link>
                      <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
                      <Link to="/faqs" className="hover:text-blue-600 transition-colors">FAQs</Link>
                      <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                      <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link>
                    </nav>
                  </SheetContent>
                </Sheet>
              </>
            )}

            <nav className="flex items-center gap-1 sm:gap-4">
              {user && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="px-2 sm:px-3 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                    <Stethoscope className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Find Doctor</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/nearby-clinics')} className="px-2 sm:px-3 text-primary hover:bg-primary/10 hover:text-primary">
                    <MapPin className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Nearby Clinics</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/nearby-ambulances')} className="px-2 sm:px-3 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <Ambulance className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Nearby Ambulances</span>
                  </Button>
                </>
              )}
              {user ? (
                <>
                  {role !== "patient" && (
                    <Button variant="ghost" size="sm" onClick={() => navigate(dashboardPath)} className="px-2 sm:px-3">
                      <LayoutDashboard className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="px-2 sm:px-3">
                    <User className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </>
              ) : null}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t mt-auto bg-card/50">
        <div className="border-b bg-white">
            <div className="container mx-auto px-4 py-10 max-w-6xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="col-span-2 md:col-span-1">
                  <Link to="/" className="flex items-center gap-2 mb-3">
                    <img src="/logo.png" alt="SwasthyaCare" className="h-8 object-contain" />
                    <span className="font-bold text-lg text-slate-900">SwasthyaCare</span>
                  </Link>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Connecting Patients with Healthcare, Anytime, Anywhere.
                  </p>
                </div>

                {/* Company Links */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Company</h4>
                  <ul className="space-y-2.5">
                    <li><Link to="/about" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">About Us</Link></li>
                    <li><Link to="/contact" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Contact Us</Link></li>
                    <li><Link to="/blog" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Blog</Link></li>
                  </ul>
                </div>

                {/* Support Links */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Support</h4>
                  <ul className="space-y-2.5">
                    <li><Link to="/faqs" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">FAQs</Link></li>
                    <li><Link to="/privacy" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
                  </ul>
                </div>

                {/* Social */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Connect</h4>
                  <ul className="space-y-2.5">
                    <li>
                      <a href="https://www.linkedin.com/in/jasim-mushtaq/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5">
                        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/jasimmushtaq" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5">
                        <Github className="h-3.5 w-3.5" /> GitHub
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        {/* Bottom bar — always visible */}
        <div className="py-6">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} SwasthyaCare. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-1">
              <a href="https://www.linkedin.com/in/jasim-mushtaq/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://github.com/jasimmushtaq" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
}
