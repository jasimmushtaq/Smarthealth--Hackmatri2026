import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Users, Stethoscope, Shield, Globe, Target, Eye, Sparkles } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About SwasthyaCare</h1>
          <p className="text-xl text-blue-100/80 max-w-2xl">
            Bridging the gap between patients and healthcare providers across India with real-time, verified information.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-16 space-y-16">
        {/* Mission */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>
              SwasthyaCare was founded with a singular vision: <strong className="text-slate-900">to make healthcare accessibility transparent and effortless for every Indian citizen</strong>. We believe that finding an available doctor should never involve guesswork, endless phone calls, or wasted trips to closed clinics.
            </p>
            <p>
              Our platform provides real-time doctor availability information, enabling patients to check who is available near them — right now, today, or any day of the week — before they leave their homes.
            </p>
            <p>
              We are committed to empowering both patients and doctors. Patients get instant access to verified doctor schedules, while doctors get a free digital presence to manage their availability and reach more people in their community.
            </p>
          </div>
        </section>

        {/* Vision */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Our Vision</h2>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>
              We envision a future where every person in India — whether in a metropolitan city or a remote village — can instantly know which healthcare professionals are available near them.
            </p>
            <p>
              SwasthyaCare aims to become India's most trusted and widely-used doctor availability platform, covering every state, district, and locality with verified, real-time healthcare data.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Real-Time Availability", desc: "We display live doctor availability status — whether a doctor is available, on leave, or not available — updated in real time by the doctors themselves." },
              { title: "Verified Doctor Profiles", desc: "Every doctor on our platform goes through an admin verification process. We display their qualifications, specialization, experience, hospital details, consultation fees, and weekly schedule." },
              { title: "Location-Based Search", desc: "Patients can search for doctors by state, district, and area. Our powerful filters let you narrow down by specialization, availability status, and more." },
              { title: "Weekly Schedule & Leaves", desc: "Doctors set their weekly availability slots and can mark leave days in advance, so patients always have the most up-to-date information." },
              { title: "No Booking Required", desc: "SwasthyaCare is not a booking platform. We provide information transparency — you check availability and walk in when convenient. No appointments, no waiting queues online." },
              { title: "100% Free for Everyone", desc: "SwasthyaCare is completely free for both patients and doctors. There are no subscription fees, no hidden charges, and no premium tiers." },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who We Are */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Who We Are</h2>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>
              SwasthyaCare is developed and maintained by <strong className="text-slate-900">Jasim Mushtaq</strong>, a passionate developer committed to using technology for social good. The platform was born out of a personal experience — the frustration of traveling to a doctor's clinic only to find it closed without prior notice.
            </p>
            <p>
              Built with modern web technologies including React, TypeScript, Supabase, and Tailwind CSS, SwasthyaCare is designed to be fast, reliable, and accessible on any device.
            </p>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
              <Heart className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Our Core Values</h2>
          </div>
          <div className="space-y-4">
            {[
              { title: "Transparency", desc: "We believe healthcare information should be open and accessible. No hidden fees, no paywalls, no gatekeeping." },
              { title: "Trust", desc: "Every doctor on our platform is verified by our admin team. We never compromise on the authenticity of the information we display." },
              { title: "Accessibility", desc: "Our platform is designed to work on all devices, in all network conditions. Healthcare information should reach everyone, everywhere." },
              { title: "Privacy", desc: "We respect user privacy and handle personal data with the utmost care. We follow industry best practices for data security." },
              { title: "Community First", desc: "SwasthyaCare exists to serve communities. We are driven by impact, not profit. Our platform is and will remain free for all users." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mt-3 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <Globe className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Our Coverage</h2>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>
              SwasthyaCare currently operates across <strong className="text-slate-900">all 28 states and 8 union territories of India</strong>. Our doctor database includes practitioners from metro cities to rural towns, covering 110+ medical specializations.
            </p>
            <p>
              We support <strong className="text-slate-900">22+ Indian languages</strong> in doctor profiles, ensuring that language is never a barrier in healthcare discovery.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
