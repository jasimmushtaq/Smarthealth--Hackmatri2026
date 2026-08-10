import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsConditions() {
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
            <FileText className="h-10 w-10 text-cyan-300" />
            <h1 className="text-4xl md:text-5xl font-extrabold">Terms & Conditions</h1>
          </div>
          <p className="text-blue-100/70">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-16">
        <div className="space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">1. Acceptance of Terms</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              <p>By accessing, browsing, or using the SwasthyaCare platform ("Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions ("Terms").</p>
              <p>If you do not agree with any part of these Terms, you must not use the Platform. Your continued use of the Platform constitutes your acceptance of these Terms as they may be modified from time to time.</p>
              <p>These Terms apply to all users of the Platform, including patients, healthcare providers (doctors, clinics, ambulance drivers), administrators, and visitors.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">2. Description of Service</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              <p>SwasthyaCare is a free, web-based information platform that provides:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Real-time availability information based on self-reported schedules or statuses</li>
                <li>Provider profiles including specialization, services, hospital/clinic details, experience, fees, and weekly schedules</li>
                <li>Ambulance tracking to help patients find nearby emergency transport</li>
                <li>Search and filter functionality to help patients find providers by specialization, location, and availability status</li>
                <li>Dashboard tools for providers to manage their profiles, availability slots, live locations, and leave schedules</li>
                <li>Admin tools for verifying and managing provider registrations</li>
              </ul>
              <p><strong>SwasthyaCare is NOT:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A medical advice or telemedicine platform</li>
                <li>An appointment booking system</li>
                <li>A payment processing or billing service</li>
                <li>A substitute for professional medical consultation</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">3. User Accounts</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              <p><strong>3.1 Registration:</strong> To access the Platform's features, you must create an account by providing your full name, email address, password, state, and district. You must select a role: Patient, Doctor, Clinic, or Ambulance.</p>
              <p><strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized use of your account. SwasthyaCare is not liable for any loss or damage arising from your failure to protect your account information.</p>
              <p><strong>3.3 Accurate Information:</strong> You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. Providing false or misleading information may result in account suspension or termination.</p>
              <p><strong>3.4 One Account Per Person:</strong> Each person may create only one account. Duplicate accounts may be merged or deleted at our discretion.</p>
              <p><strong>3.5 Age Requirement:</strong> You must be at least 13 years of age to create an account. If you are under 18, you should use the Platform under parental or guardian supervision.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">4. Provider-Specific Terms</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              <p><strong>4.1 Profile Accuracy:</strong> Providers (doctors, clinics, ambulance drivers) are solely responsible for the accuracy of their profile information, including qualifications, specialization, services, hospital affiliation, fees, and availability schedules. Misrepresentation may result in profile removal.</p>
              <p><strong>4.2 Verification:</strong> All provider profiles are subject to admin review before being made visible to patients. SwasthyaCare reserves the right to approve, reject, or revoke verification of any provider profile at its sole discretion.</p>
              <p><strong>4.3 Availability & Location Updates:</strong> Providers are responsible for keeping their availability schedules current. Ambulance drivers are responsible for broadcasting accurate live locations when marked 'Available'. Patients rely on this information to plan visits and emergencies, and outdated information may cause inconvenience.</p>
              <p><strong>4.4 Professional Conduct:</strong> By registering as a provider, you represent and warrant that you are a licensed medical practitioner, certified clinic, or registered ambulance service authorized to operate in India.</p>
              <p><strong>4.5 Profile Photo:</strong> Profile photos must be professional and must accurately represent the registered provider or facility. Stock photos or inappropriate images are not permitted.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">5. Patient-Specific Terms</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              <p><strong>5.1 Information Use:</strong> The information provided on SwasthyaCare is for informational purposes only. It is your responsibility to verify a provider's credentials and availability before visiting or contacting them.</p>
              <p><strong>5.2 No Medical Advice:</strong> SwasthyaCare does not provide medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.</p>
              <p><strong>5.3 Walk-In Visits & Emergencies:</strong> Even if a provider shows as "Available" on SwasthyaCare, availability may change due to emergencies or unforeseen circumstances. SwasthyaCare is not responsible for any inconvenience caused by last-minute availability changes or ambulance delays.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">6. Prohibited Activities</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              <p>You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Platform for any unlawful purpose or in violation of any applicable law</li>
                <li>Create a provider profile if you are not a licensed medical practitioner, certified clinic, or registered ambulance</li>
                <li>Impersonate any person or entity, or falsely claim an affiliation with any person or entity</li>
                <li>Upload or transmit viruses, malware, or any harmful code</li>
                <li>Attempt to gain unauthorized access to other users' accounts or the Platform's servers</li>
                <li>Scrape, crawl, or use automated tools to extract data from the Platform without written permission</li>
                <li>Use the Platform to send spam, unsolicited messages, or advertisements</li>
                <li>Interfere with or disrupt the Platform's functionality or servers</li>
                <li>Post offensive, defamatory, or inappropriate content</li>
                <li>Reverse-engineer, decompile, or disassemble any part of the Platform's software</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">7. Intellectual Property</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              <p>The SwasthyaCare name, logo, branding, design, layout, source code, and all content created by SwasthyaCare are the intellectual property of SwasthyaCare and its developer.</p>
              <p>You may not copy, modify, distribute, or create derivative works based on the Platform's proprietary content without prior written consent.</p>
              <p>Provider-submitted content (profile information, photos, schedules) remains the property of the respective providers, but by submitting it, you grant SwasthyaCare a non-exclusive, royalty-free license to display it on the Platform.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">8. Limitation of Liability</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              <p>SwasthyaCare is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied.</p>
              <p>We do not guarantee:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The accuracy, completeness, or timeliness of provider availability or live location information</li>
                <li>That the Platform will be uninterrupted, error-free, or secure</li>
                <li>That defects will be corrected in a timely manner</li>
                <li>The quality or qualifications of any provider listed on the Platform</li>
              </ul>
              <p>In no event shall SwasthyaCare, its developer, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Platform.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">9. Indemnification</h2>
            <p className="text-slate-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless SwasthyaCare and its developer from any claims, damages, losses, liabilities, or expenses (including legal fees) arising from your use of the Platform, your violation of these Terms, or your violation of any rights of a third party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">10. Termination</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              <p>We may suspend or terminate your account at any time, without prior notice, for conduct that we determine violates these Terms or is harmful to the Platform, other users, or third parties.</p>
              <p>You may terminate your account at any time by contacting us. Upon termination, your right to use the Platform will cease immediately, and we may delete your data in accordance with our Privacy Policy.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">11. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">12. Changes to These Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the Platform following any changes indicates your acceptance of the modified Terms. We recommend reviewing these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">13. Contact Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
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
