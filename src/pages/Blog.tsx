import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: string;
  category: string;
  categoryColor: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "why-swasthyacare",
    title: "Why We Built SwasthyaCare — The Problem We're Solving",
    excerpt: "Millions of Indians waste time and money visiting closed clinics. Here's how SwasthyaCare addresses this fundamental healthcare transparency problem.",
    content: [
      "India has over 1.3 million registered allopathic doctors and countless clinics. Yet, for a patient in a tier-2 or tier-3 city, simply finding out whether their doctor is available today or if a nearby clinic is open can be a frustrating ordeal. There's no centralized system, no real-time updates, and often no online presence.",
      "The typical patient experience goes something like this: You feel unwell, you decide to visit your usual doctor or clinic, you travel (sometimes 30-60 minutes), only to find a 'Closed' sign on the door. No prior notice, no update. Furthermore, in emergencies, finding an available ambulance nearby is often chaotic.",
      "This is the problem SwasthyaCare was born to solve. Our founder experienced this firsthand — multiple wasted trips to closed clinics and struggles finding emergency transport that could have been avoided with a simple availability check.",
      "SwasthyaCare provides a simple but powerful solution: a free platform where doctors and clinics can publish their schedules, ambulance drivers can broadcast their live locations, and patients can check availability before leaving home. No complex features — just transparent, real-time information.",
      "We believe that healthcare transparency is a basic right, not a premium feature. That's why SwasthyaCare is and will always remain free for patients, doctors, clinics, and ambulance drivers."
    ],
    date: "August 9, 2026",
    readTime: "4 min read",
    category: "Our Story",
    categoryColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "how-to-find-doctor",
    title: "How to Find the Right Doctor Near You Using SwasthyaCare",
    excerpt: "A step-by-step guide to using SwasthyaCare's search and filter features to find available doctors in your area.",
    content: [
      "Finding the right doctor, clinic, or ambulance shouldn't be complicated. SwasthyaCare makes it easy with powerful search and filter tools. Here's how to make the most of them:",
      "Step 1: Create a Free Account — Sign up as a patient with your name, email, state, and district. This takes less than a minute.",
      "Step 2: Browse Directories — After logging in, you'll see verified doctors, nearby clinics, and available ambulances. Each card shows relevant details like specialization for doctors, services for clinics, or live location for ambulances.",
      "Step 3: Use Filters — Narrow down your search using our powerful filters: search by name, specialization, services offered, or current availability status.",
      "Step 4: Check Real-Time Status — Look for the green 'Available Now' badge. For ambulances, you can track their exact location on the live map.",
      "Step 5: View Detailed Profiles — Click on a provider's card to see their full profile: detailed bio, weekly schedule, services, contact info, and more.",
      "Step 6: Visit with Confidence — Now you know exactly when and where to go, or which ambulance to call. No wasted trips, no surprise closures.",
      "Pro Tip: Bookmark your frequently visited doctors and clinics so you can quickly check their status next time!"
    ],
    date: "August 9, 2026",
    readTime: "5 min read",
    category: "Guide",
    categoryColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "doctors-digital-presence",
    title: "Why Every Doctor Needs a Digital Presence in 2026",
    excerpt: "In an era where patients search online first, having a verified digital profile is no longer optional for healthcare providers.",
    content: [
      "The way patients find and choose healthcare providers has changed dramatically. According to industry surveys, over 70% of patients now search online before visiting a doctor or clinic. Yet, most local providers in India have zero online presence.",
      "This creates a massive information gap. Patients can't find basic details like: Is this clinic open today? What are the doctor's consultation hours? Where exactly is the nearest available ambulance?",
      "SwasthyaCare fills this gap by giving every doctor, clinic, and ambulance driver a free, verified digital profile. Here's why you should be on SwasthyaCare:",
      "1. Reach More Patients — Your profile is discoverable by patients searching for your services in your area. No marketing budget needed.",
      "2. Reduce Disruptions — When patients can check your availability before visiting, they come at the right time. Better patient flow, fewer angry walk-ins.",
      "3. Professional Credibility — A verified profile with your details, qualifications, and schedule builds trust with potential patients.",
      "4. Zero Cost — SwasthyaCare is completely free. No subscription, no commission, no hidden fees. Ever.",
      "5. Easy Management — Update your availability, mark leaves, or broadcast your live location (for ambulances) from any device in seconds.",
      "6. Reduce Phone Calls — Instead of fielding calls about your timings, patients can check it themselves on SwasthyaCare.",
      "Getting started takes less than 5 minutes. Sign up, complete your profile, and wait for admin verification. Once approved, patients in your area will be able to find you instantly."
    ],
    date: "August 9, 2026",
    readTime: "6 min read",
    category: "For Doctors",
    categoryColor: "bg-violet-100 text-violet-700",
  },
  {
    id: "healthcare-india-challenges",
    title: "The State of Healthcare Accessibility in India — Challenges and Opportunities",
    excerpt: "India's healthcare system faces unique challenges. Technology can play a transformative role in bridging the accessibility gap.",
    content: [
      "India's healthcare landscape is one of stark contrasts. World-class hospitals coexist with primary health centers that lack basic infrastructure. Metropolitan areas have provider ratios comparable to developed nations, while rural areas face severe shortages.",
      "Key Challenges:",
      "1. Provider Shortage — India faces a shortage of qualified doctors and properly equipped clinics. The distribution is heavily skewed toward urban areas.",
      "2. Emergency Transport — Access to timely ambulance services is highly fragmented, with patients often struggling to find an available ambulance during critical emergencies.",
      "3. Information Asymmetry — Patients lack basic information about which doctors are available, which clinics are open, and what services they provide. This leads to delayed care and wasted visits.",
      "4. No Centralized Directory — India doesn't have a comprehensive, real-time healthcare directory covering doctors, clinics, and ambulances.",
      "5. Language Barriers — India's linguistic diversity means that a single-language platform cannot serve the entire population effectively.",
      "How Technology Can Help:",
      "Platforms like SwasthyaCare take a simple, focused approach: provide critical information — availability and location — and make it accessible to everyone. No complex features, no payment processing. Just transparent, real-time data.",
      "By supporting 22+ languages in provider profiles, covering all states, and keeping the platform completely free, SwasthyaCare is designed to be inclusive and accessible.",
      "The journey is long, but every step toward healthcare transparency matters. We believe that informed patients make better healthcare decisions."
    ],
    date: "August 9, 2026",
    readTime: "7 min read",
    category: "Healthcare",
    categoryColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "tips-hospital-visit",
    title: "10 Tips to Make Your Hospital Visit More Efficient",
    excerpt: "Practical advice to save time, reduce stress, and get the most out of your next doctor visit.",
    content: [
      "Visiting a doctor doesn't have to be stressful. With a little preparation, you can make the experience smoother and more productive. Here are 10 practical tips:",
      "1. Check Availability First — Before leaving home, use SwasthyaCare to verify that your doctor is available. Check their status and schedule to avoid wasted trips.",
      "2. Bring Your Medical History — Carry previous prescriptions, test reports, and discharge summaries. This helps the doctor make informed decisions quickly.",
      "3. Write Down Your Symptoms — List your symptoms, when they started, and their severity. It's easy to forget details when you're in the consultation room.",
      "4. List Your Medications — Keep a list of all medications you're currently taking, including dosages. This includes supplements and over-the-counter medicines.",
      "5. Arrive 10-15 Minutes Early — Give yourself time for registration, paperwork, and settling in. Rushing adds unnecessary stress.",
      "6. Prepare Your Questions — Write down any questions you have for the doctor. Don't hesitate to ask about your diagnosis, treatment options, and side effects.",
      "7. Bring a Companion — If you're visiting for a serious condition, bring a family member or friend. They can help remember the doctor's instructions and provide emotional support.",
      "8. Check Consultation Fees — Check the consultation fee on SwasthyaCare before visiting so you can carry the right amount. This avoids surprise costs.",
      "9. Follow Up on Test Results — If the doctor orders tests, schedule a follow-up to discuss results. Don't assume 'no news is good news' — always follow up.",
      "10. Keep Records — After each visit, note down the doctor's advice, prescribed medications, and follow-up dates. A simple notebook or phone note works great."
    ],
    date: "August 9, 2026",
    readTime: "5 min read",
    category: "Health Tips",
    categoryColor: "bg-rose-100 text-rose-700",
  },
];

export default function Blog() {
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
            <BookOpen className="h-10 w-10 text-cyan-300" />
            <h1 className="text-4xl md:text-5xl font-extrabold">Blog</h1>
          </div>
          <p className="text-xl text-blue-100/80 max-w-2xl">
            Insights on healthcare accessibility, tips for patients and doctors, and stories from the SwasthyaCare journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-16">
        {/* Blog List */}
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${post.categoryColor}`}>{post.category}</span>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h2>
              <p className="text-slate-500 leading-relaxed mb-5">{post.excerpt}</p>

              {/* Expanded Content */}
              <details className="group/details">
                <summary className="inline-flex items-center gap-2 text-blue-600 font-semibold cursor-pointer hover:text-blue-700 transition-colors text-sm select-none">
                  Read Full Article
                  <ArrowRight className="h-4 w-4 group-open/details:rotate-90 transition-transform" />
                </summary>
                <div className="mt-6 space-y-4 text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
                  {post.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </details>
            </article>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-16 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-10 text-center">
          <BookOpen className="h-12 w-12 text-blue-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">More articles coming soon!</h3>
          <p className="text-slate-500">We regularly publish new content about healthcare accessibility, doctor tips, and patient guides. Check back often!</p>
        </div>
      </div>
    </div>
  );
}
