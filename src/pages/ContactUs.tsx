import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Phone, Clock, MessageSquare, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred while sending your message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100/80 max-w-2xl">
            We'd love to hear from you. Whether you have a question, feedback, or a partnership idea — reach out and we'll respond promptly.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Have questions about SwasthyaCare? Want to report a bug, suggest a feature, or collaborate with us? We're here to help.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Email</h3>
                  <p className="text-slate-500">jasimmushtaq31@gmail.com</p>
                  <p className="text-sm text-slate-400 mt-1">We respond within 24-48 hours</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Location</h3>
                  <p className="text-slate-500">India</p>
                  <p className="text-sm text-slate-400 mt-1">Serving all states & union territories</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Support Hours</h3>
                  <p className="text-slate-500">Monday – Saturday</p>
                  <p className="text-sm text-slate-400 mt-1">9:00 AM – 6:00 PM IST</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Connect With Us</h3>
                  <div className="flex gap-3 mt-2">
                    <a href="https://www.linkedin.com/in/jasim-mushtaq/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="https://github.com/jasimmushtaq" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-800 hover:text-white transition-colors">
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-slate-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
                <p className="text-slate-500 mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Full Name *</Label>
                      <Input id="contact-name" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email Address *</Label>
                      <Input id="contact-email" type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Subject *</Label>
                    <Input id="contact-subject" value={form.subject} onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))} required placeholder="What is this regarding?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message *</Label>
                    <Textarea id="contact-message" value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))} required placeholder="Write your message here..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full py-6 text-base font-semibold" disabled={sending}>
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Contact Reasons */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Common Reasons to Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Bug Reports", desc: "Found something broken? Let us know the exact issue, steps to reproduce, and your browser/device details so we can fix it quickly." },
              { title: "Feature Requests", desc: "Have an idea that could improve SwasthyaCare? We value user feedback and prioritize features based on community requests." },
              { title: "Doctor Verification", desc: "If you're a registered doctor waiting for admin approval, or if you need to update your verified information, reach out to us." },
              { title: "Account Issues", desc: "Trouble logging in, forgot your password, or need to update your email? We'll help you regain access to your account." },
              { title: "Partnership Inquiries", desc: "Are you a hospital, clinic chain, or healthcare organization interested in collaborating with SwasthyaCare? Let's talk." },
              { title: "Data & Privacy", desc: "Questions about how we handle your data, or requests to export/delete your information? We take privacy seriously and will assist promptly." },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
