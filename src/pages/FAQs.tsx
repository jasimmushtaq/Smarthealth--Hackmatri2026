import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "General Questions",
    items: [
      {
        question: "What is SwasthyaCare?",
        answer: "SwasthyaCare is a free, open platform that provides real-time availability information across India. It helps patients find which doctors are available, which clinics are open, and where the nearest ambulance is — right now, today, or any day of the week. Providers can register, manage their weekly schedules, mark leaves, or broadcast their live locations."
      },
      {
        question: "Is SwasthyaCare free to use?",
        answer: "Yes, SwasthyaCare is 100% free for patients, doctors, clinics, and ambulance drivers. There are no subscription fees, no premium tiers, no hidden charges, and no advertisements."
      },
      {
        question: "Do I need to download an app?",
        answer: "No. SwasthyaCare is a web-based platform that works on any modern browser — Chrome, Firefox, Safari, Edge — on both desktop and mobile devices. No downloads or installations required."
      },
      {
        question: "Is SwasthyaCare a booking or telemedicine platform?",
        answer: "No. SwasthyaCare is an information platform, not a booking or telemedicine service. We provide real-time doctor availability and schedule information so you can plan your visit. We do not handle appointments, online consultations, or payments."
      },
      {
        question: "Which areas does SwasthyaCare cover?",
        answer: "SwasthyaCare covers all 28 states and 8 union territories of India. Doctors from any location can register and list their availability. Patients can search by state, district, and area to find doctors near them."
      },
    ],
  },
  {
    title: "For Patients",
    items: [
      {
        question: "How do I find a doctor, clinic, or ambulance?",
        answer: "After creating a free patient account, you can browse all registered providers on the dashboard. Use the search bar or filters to narrow down by specialization, services offered, state, district, and availability status."
      },
      {
        question: "How do I know if a provider is available right now?",
        answer: "Each card shows real-time availability status. A green 'Available Now' badge means the provider is currently available. For ambulances, you can track their exact location on the live map if they are available."
      },
      {
        question: "Can I book an appointment through SwasthyaCare?",
        answer: "No, SwasthyaCare does not handle bookings. We provide schedule and availability information so you can walk in or contact the doctor's clinic directly. This keeps the platform simple and free."
      },
      {
        question: "What information can I see about a provider?",
        answer: "For doctors, you can see specialization, hospital, experience, fees, and schedule. For clinics, you can view services offered, operating hours, and location. For ambulances, you can view driver details, live location, and vehicle type."
      },
      {
        question: "Are the providers on SwasthyaCare verified?",
        answer: "Yes. Every doctor, clinic, and ambulance who registers on SwasthyaCare goes through an admin verification process before their profile is made visible to patients. This ensures authenticity."
      },
      {
        question: "Is my personal information safe as a patient?",
        answer: "Yes. Patient account information (name, email, location) is kept private and is not shared with other users, doctors, or third parties. Only your login credentials and basic profile data are stored securely. See our Privacy Policy for full details."
      },
    ],
  },
  {
    title: "For Doctors",
    items: [
      {
        question: "How do I register as a doctor on SwasthyaCare?",
        answer: "Click 'Get Started' on the homepage, select 'Doctor' as your role during signup, and fill in your details (name, email, password, state, district). After registration, you'll be redirected to your dashboard where you can complete your full profile."
      },
      {
        question: "What information do I need to provide?",
        answer: "To complete your profile, you should provide: your full name, gender, specialization, hospital name, room number, state, district, area, years of experience, consultation fee, a brief bio, languages you speak, and a profile photograph. All fields are important for verification and patient discovery."
      },
      {
        question: "How does doctor verification work?",
        answer: "After you complete your profile, it is reviewed by our admin team. Once approved, your profile becomes visible to patients. Until approval, you'll see a 'Pending Approval' status. This process typically takes 24-48 hours."
      },
      {
        question: "How do I set my availability?",
        answer: "In your Doctor Dashboard, go to the 'Availability' tab. Here you can add weekly time slots for each day of the week (e.g., Monday 9:00 AM – 1:00 PM, Monday 4:00 PM – 7:00 PM). You can add multiple slots per day and toggle them on/off."
      },
      {
        question: "How do I mark leaves?",
        answer: "In your Doctor Dashboard, go to the 'Leaves' tab. You can add upcoming leave dates with an optional reason. Patients will see these leaves on your profile, and your availability status will automatically adjust."
      },
      {
        question: "Can I change my status manually?",
        answer: "Yes. In the 'Status' tab of your Dashboard, you can toggle between 'Available', 'Not Available', and 'On Leave' statuses. This overrides automatic schedule-based status and is useful for unplanned closures."
      },
      {
        question: "Is my profile photo required?",
        answer: "Yes, a profile photo is required to complete your profile. It helps patients recognize and trust your listing. Photos are stored securely on Cloudinary and are displayed alongside your profile information."
      },
      {
        question: "Can I update my profile later?",
        answer: "Absolutely. You can update your profile, schedule, leaves, and status at any time through your Doctor Dashboard. Changes are reflected in real-time to patients."
      },
    ],
  },
  {
    title: "For Clinics",
    items: [
      {
        question: "How can I register my clinic?",
        answer: "Select 'Clinic' as your role during signup. Provide your clinic name, location, facilities, and operating hours. Once verified by the admin, your clinic will be listed."
      },
      {
        question: "How do I update clinic availability?",
        answer: "In your Clinic Dashboard, you can toggle your live status between 'Open', 'Closed', or 'Full Capacity'. You can also update your regular weekly schedule."
      }
    ],
  },
  {
    title: "For Ambulances",
    items: [
      {
        question: "How do I register as an ambulance driver?",
        answer: "Select 'Ambulance' as your role during signup. You will need to provide your vehicle number, license details, and operating regions. Admin verification is required."
      },
      {
        question: "How does live tracking work?",
        answer: "When you mark yourself as 'Available', SwasthyaCare requests location permissions on your device to broadcast your real-time GPS coordinates. This helps nearby patients locate you instantly in emergencies."
      }
    ],
  },
  {
    title: "Account & Security",
    items: [
      {
        question: "How do I create an account?",
        answer: "Click 'Get Started' on the homepage, fill in your full name, email, password, state, district, and select your role (Patient or Doctor). Click 'Sign Up' and your account will be created instantly."
      },
      {
        question: "I forgot my password. What should I do?",
        answer: "Currently, password reset is handled through Supabase authentication. Please contact us at jasimmushtaq31@gmail.com and we'll help you regain access to your account."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes. You can request account deletion by contacting us at jasimmushtaq31@gmail.com. We will delete your account and all associated data within 48 hours of receiving your request."
      },
      {
        question: "Is my data secure?",
        answer: "Yes. We use Supabase (built on PostgreSQL) with row-level security policies, bcrypt password hashing, and TLS/SSL encryption for all data transmission. Profile images are stored on Cloudinary's secure CDN. Read our full Privacy Policy for details."
      },
    ],
  },
  {
    title: "Technical Questions",
    items: [
      {
        question: "Which browsers are supported?",
        answer: "SwasthyaCare works on all modern browsers including Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and Opera. We recommend keeping your browser updated for the best experience."
      },
      {
        question: "Does SwasthyaCare work on mobile devices?",
        answer: "Yes. The platform is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. No separate mobile app is needed."
      },
      {
        question: "I'm experiencing a bug or issue. How do I report it?",
        answer: "Please visit our Contact Us page and describe the issue in detail, including what you were doing, what you expected to happen, and what actually happened. Screenshots are helpful. You can also reach us at jasimmushtaq31@gmail.com."
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between p-5 gap-4 hover:bg-slate-50/50 transition-colors"
      >
        <span className="font-semibold text-slate-900">{item.question}</span>
        <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-5 pb-5 text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-10 w-10 text-cyan-300" />
            <h1 className="text-4xl md:text-5xl font-extrabold">FAQs</h1>
          </div>
          <p className="text-xl text-blue-100/80 max-w-2xl">
            Got questions? We've got answers. Find everything you need to know about using SwasthyaCare.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-16 space-y-14">
        {faqData.map((category) => (
          <section key={category.title}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500" />
              {category.title}
            </h2>
            <div className="space-y-3">
              {category.items.map((item) => (
                <FAQAccordion key={item.question} item={item} />
              ))}
            </div>
          </section>
        ))}

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
          <p className="text-slate-500 mb-4">Can't find what you're looking for? Feel free to reach out to us directly.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
