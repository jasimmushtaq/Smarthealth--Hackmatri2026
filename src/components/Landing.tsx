import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginForm, SignupForm } from "./AuthForms";
import {
  Stethoscope,
  Clock,
  MapPin,
  Shield,
  ArrowRight,
  Heart,
  Activity,
  Search,
  CalendarCheck,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Landing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const authMode = searchParams.get("auth");
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: Search,
      title: "Find Doctors Instantly",
      description:
        "Search by specialization, location, or name. Real-time availability updates — no stale data.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Clock,
      title: "Live Availability",
      description:
        "See who's available right now, today, or later this week. No guesswork, no wasted visits.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: MapPin,
      title: "Location-Aware",
      description:
        "Filter by state, district, and area. Find healthcare providers closest to where you are.",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description:
        "Every doctor is admin-verified before being listed. Trust the profiles you see.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const stats = [
    { label: "Real-Time", value: "24/7", icon: Activity },
    { label: "Availability", value: "Live", icon: Clock },
    { label: "Verified", value: "100%", icon: Shield },
    { label: "Free to Use", value: "₹0", icon: Heart },
  ];

  return (
    <div className="relative">
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-100"
            style={{
              backgroundImage: "url('/medical-bg.png')",
              transform: `scale(${1 + scrollY * 0.0003})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-blue-900/70 to-cyan-900/60" />
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 py-12 md:py-20">
          {!authMode ? (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 text-center">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl scale-110" />
                  <img
                    src="/logo.png"
                    alt="SwasthyaCare Logo"
                    className="relative h-24 md:h-32 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
                <span className="text-white">Swasthya</span>
                <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">
                  Care
                </span>
              </h1>

              {/* Tagline */}
              <p className="text-xl md:text-2xl text-blue-100/90 font-medium max-w-3xl mx-auto mb-3 leading-relaxed">
                Your trusted platform to check{" "}
                <span className="text-white font-bold">real-time doctor availability</span>{" "}
                — find who's available near you, right now.
              </p>
              <p className="text-base md:text-lg text-blue-200/70 max-w-2xl mx-auto mb-10">
                SwasthyaCare connects patients with verified doctors across India.
                Check schedules, view profiles, and never waste a trip to a closed clinic again.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  onClick={() => setSearchParams({ auth: "login" })}
                  className="bg-white text-blue-900 hover:bg-blue-50 font-extrabold px-10 rounded-full shadow-2xl shadow-white/20 transition-all hover:scale-105 hover:shadow-white/30 text-lg py-7 gap-2 group"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToFeatures}
                  className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-blue-900 font-extrabold px-10 rounded-full text-lg py-7 backdrop-blur-sm transition-all"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-4 text-center hover:bg-white/15 transition-all duration-300"
                  >
                    <stat.icon className="h-5 w-5 text-cyan-300 mx-auto mb-1.5" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-blue-200/70 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Scroll indicator */}
              <button
                onClick={scrollToFeatures}
                className="inline-flex flex-col items-center text-white/50 hover:text-white/80 transition-colors mt-4 animate-bounce"
                aria-label="Scroll to features"
              >
                <span className="text-xs font-medium mb-1">Explore</span>
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 flex flex-col items-center">
              {authMode === "login" ? (
                <LoginForm onToggle={() => setSearchParams({ auth: "signup" })} />
              ) : (
                <SignupForm onToggle={() => setSearchParams({ auth: "login" })} />
              )}
              <Button
                variant="link"
                onClick={() => setSearchParams({})}
                className="mt-4 text-white/70 hover:text-white font-medium"
              >
                ← Back to Home
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ─── WHAT IS SWASTHYACARE ─── */}
      <section ref={featuresRef} className="py-20 md:py-28 bg-gradient-to-b from-blue-50/50 to-slate-100 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500" />

        <div className="container mx-auto px-4 max-w-6xl">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-5 border border-blue-100">
              <Heart className="h-4 w-4" />
              What is SwasthyaCare?
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
              Healthcare Transparency,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Simplified
              </span>
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
              SwasthyaCare is a free, open platform that shows you which doctors are available
              right now — no appointments needed. Just search, find, and visit. We bridge the gap
              between patients and healthcare providers with real-time, verified information.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-8 border border-[#e8edf5] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-br from-blue-950 to-slate-900 rounded-3xl p-8 md:p-14 text-center relative overflow-hidden">
            {/* Decorative orbs inside */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                How It Works
              </h3>
              <p className="text-blue-200/70 mb-10 max-w-xl mx-auto">
                Three simple steps to find an available doctor near you
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    icon: CalendarCheck,
                    title: "Sign Up Free",
                    desc: "Create your account in seconds as a patient or doctor",
                  },
                  {
                    step: "02",
                    icon: Search,
                    title: "Search Doctors",
                    desc: "Filter by specialization, location, and live availability status",
                  },
                  {
                    step: "03",
                    icon: Stethoscope,
                    title: "Visit with Confidence",
                    desc: "See schedules, fees, and walk in knowing your doctor is available",
                  },
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="text-6xl font-black text-white/5 absolute -top-4 left-1/2 -translate-x-1/2">
                      {item.step}
                    </div>
                    <div className="relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-blue-200/60 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
