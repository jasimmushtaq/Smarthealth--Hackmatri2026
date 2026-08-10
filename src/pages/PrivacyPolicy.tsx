import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "August 9, 2026";

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
            <Shield className="h-10 w-10 text-cyan-300" />
            <h1 className="text-4xl md:text-5xl font-extrabold">Privacy Policy</h1>
          </div>
          <p className="text-blue-100/70">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-16">
        <div className="prose prose-lg prose-slate max-w-none space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">1. Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              SwasthyaCare ("we," "our," or "us") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services at swasthyacare.com (the "Platform").
            </p>
            <p className="text-slate-600 leading-relaxed">
              By accessing or using the Platform, you agree to the terms of this Privacy Policy. If you do not agree with the practices described herein, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2.1 Information You Provide Directly</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Account Information:</strong> When you register, we collect your full name, email address, password (stored in encrypted form), state, and district.</li>
              <li><strong>Doctor Profile Information:</strong> If you register as a doctor, we additionally collect your specialization, hospital name, room number, area, years of experience, consultation fee, bio, languages spoken, gender, and profile photograph.</li>
              <li><strong>Availability Data:</strong> Doctors provide their weekly availability slots (day of week, start time, end time) and leave/absence schedules.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Device & Browser Information:</strong> We may collect your device type, browser type and version, operating system, and screen resolution for analytics and service improvement.</li>
              <li><strong>Log Data:</strong> Our servers may automatically record your IP address, access times, pages viewed, and referring URL.</li>
              <li><strong>Cookies:</strong> We use cookies and similar technologies to maintain your login session and remember your preferences. You can disable cookies in your browser settings, though some features may not work properly.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2.3 Information We Do NOT Collect</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>We do <strong>not</strong> collect any medical records, health conditions, prescriptions, or treatment history of patients.</li>
              <li>We do <strong>not</strong> collect payment or financial information (credit cards, bank accounts, UPI details) as our platform is entirely free.</li>
              <li>We do <strong>not</strong> track your precise GPS location. Location data (state, district) is provided voluntarily by you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>To provide our services:</strong> Displaying doctor profiles and availability to patients, enabling doctors to manage their schedules.</li>
              <li><strong>Account management:</strong> Creating and managing your user account, authenticating logins, and assigning user roles (patient, doctor, admin).</li>
              <li><strong>Profile display:</strong> Doctor profile information (name, specialization, hospital, schedule, photo) is displayed publicly to patients searching for available doctors.</li>
              <li><strong>Admin verification:</strong> Submitted doctor profiles are reviewed by our admin team for authenticity before being made visible.</li>
              <li><strong>Communication:</strong> Sending important service-related notifications such as account verification emails.</li>
              <li><strong>Service improvement:</strong> Analyzing usage patterns to improve the user experience, fix bugs, and develop new features.</li>
              <li><strong>Legal compliance:</strong> Complying with applicable laws, regulations, and legal processes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">4. How We Share Your Information</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Doctor profiles are public:</strong> If you register as a doctor, your profile information (name, specialization, hospital, schedule, fees, and profile photo) will be visible to all registered users of the platform.</li>
              <li><strong>Patient accounts are private:</strong> Patient account information (name, email, state, district) is not shared with other users or third parties.</li>
              <li><strong>Service providers:</strong> We use Supabase for database hosting and authentication, and Cloudinary for image storage. These services process your data on our behalf under their respective privacy policies.</li>
              <li><strong>Legal obligations:</strong> We may disclose your information if required by law, court order, or governmental regulation.</li>
              <li><strong>No sale of data:</strong> We do <strong>not</strong> sell, rent, or trade your personal information to any third parties for marketing or advertising purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">5. Data Storage & Security</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Your data is stored securely on Supabase's cloud infrastructure with PostgreSQL databases hosted on AWS (Asia Pacific — Mumbai region).</li>
              <li>Passwords are hashed using industry-standard bcrypt encryption and are never stored in plain text.</li>
              <li>All data transmission between your browser and our servers is encrypted using TLS/SSL (HTTPS).</li>
              <li>Profile images are stored on Cloudinary's secure CDN with automatic optimization.</li>
              <li>We implement row-level security (RLS) policies to ensure users can only access data they are authorized to see.</li>
              <li>Despite our best efforts, no method of electronic storage is 100% secure. We cannot guarantee absolute security of your data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">6. Your Rights</h2>
            <p className="text-slate-600 mb-3">You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Access:</strong> You may request to know what personal data we hold about you.</li>
              <li><strong>Correction:</strong> You may update or correct your profile information at any time through your dashboard.</li>
              <li><strong>Deletion:</strong> You may request the deletion of your account and all associated data by contacting us.</li>
              <li><strong>Withdraw consent:</strong> You may stop using our platform at any time and request removal of your data.</li>
              <li><strong>Data portability:</strong> You may request a copy of your data in a standard format.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">7. Children's Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              SwasthyaCare is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided personal information, we will take steps to delete that information immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">8. Third-Party Links</h2>
            <p className="text-slate-600 leading-relaxed">
              Our Platform may contain links to third-party websites or services that are not operated by us (e.g., LinkedIn, GitHub). We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites. We encourage you to read the privacy policy of every site you visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">9. Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically. Your continued use of the Platform after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">10. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-4">
              <p className="text-slate-700 font-medium">SwasthyaCare</p>
              <p className="text-slate-600">Email: jasimmushtaq31@gmail.com</p>
              <p className="text-slate-600">Developer: Jasim Mushtaq</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
