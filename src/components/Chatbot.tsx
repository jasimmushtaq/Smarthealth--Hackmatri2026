import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

type Message = {
  id: string;
  type: "bot" | "user";
  text: React.ReactNode;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "Hi there! I'm the SwasthyaCare assistant. How can I help you today? You can ask me about how to sign up, finding doctors, or nearby clinics.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const generateResponse = (text: string): React.ReactNode => {
    const lower = text.toLowerCase();

    // 1. Authentication & Registration
    if (lower.includes("sign up") || lower.includes("signup") || lower.includes("register") || lower.includes("create account")) {
      return (
        <span>
          To sign up, click on the "Login / Sign up" button on the top right (or go to <Link to="/signup" className="text-blue-500 underline">Signup Page</Link>) and choose your role: Patient, Doctor, Clinic, or Ambulance.
        </span>
      );
    }
    if (lower.includes("login") || lower.includes("log in") || lower.includes("sign in")) {
      return (
        <span>
          You can log in to your account by visiting the <Link to="/login" className="text-blue-500 underline">Login Page</Link>.
        </span>
      );
    }

    // 2. Dashboards & Profiles
    if (lower.includes("dashboard")) {
      return (
        <span>
          Once logged in, you can access your personalized dashboard from the top navigation bar. It provides tools specific to your role (Patient, Doctor, Clinic, Admin, or Ambulance).
        </span>
      );
    }
    if (lower.includes("profile") || lower.includes("my account")) {
      return (
        <span>
          You can update your personal information, photo, and preferences by visiting your <Link to="/profile" className="text-blue-500 underline">User Profile</Link>.
        </span>
      );
    }

    // 3. Doctors & Appointments
    if (lower.includes("doctor") || lower.includes("find doctor") || lower.includes("appointment") || lower.includes("book")) {
      return (
        <span>
          You can find doctors and book appointments by using the search bar on our home page. Make sure you are logged in as a patient to book appointments!
        </span>
      );
    }

    // 4. Clinics
    if (lower.includes("clinic") || lower.includes("nearby clinic") || lower.includes("hospital")) {
      return (
        <span>
          Check out the <Link to="/nearby-clinics" className="text-blue-500 underline">Nearby Clinics</Link> section to find healthcare facilities around your location on an interactive map.
        </span>
      );
    }
    
    // 5. Ambulances & Emergencies
    if (lower.includes("ambulance") || lower.includes("emergency") || lower.includes("urgent")) {
      return (
        <span>
          If it's an emergency, you can quickly find nearby ambulances using our <Link to="/nearby-ambulances" className="text-blue-500 underline">Nearby Ambulances</Link> feature to contact a driver immediately.
        </span>
      );
    }

    // 6. About & Information
    if (lower.includes("about") || lower.includes("what is swasthyacare")) {
      return (
        <span>
          SwasthyaCare is a comprehensive healthcare platform connecting patients with doctors, clinics, and ambulance services for seamless healthcare access, anytime, anywhere.
        </span>
      );
    }
    if (lower.includes("blog") || lower.includes("article") || lower.includes("news")) {
      return (
        <span>
          Stay updated with healthcare tips and platform news by visiting our <Link to="/blog" className="text-blue-500 underline">Blog</Link>.
        </span>
      );
    }
    if (lower.includes("faq") || lower.includes("question") || lower.includes("help") || lower.includes("support") || lower.includes("contact")) {
      return (
        <span>
          Have questions? Check our <Link to="/faqs" className="text-blue-500 underline">FAQs</Link> page for quick answers, or visit the <Link to="/contact" className="text-blue-500 underline">Contact Us</Link> page to reach support!
        </span>
      );
    }

    // 7. Policies
    if (lower.includes("privacy") || lower.includes("policy")) {
      return (
        <span>
          You can read about how we protect your data in our <Link to="/privacy" className="text-blue-500 underline">Privacy Policy</Link>.
        </span>
      );
    }
    if (lower.includes("terms") || lower.includes("conditions")) {
      return (
        <span>
          Our platform rules are outlined in the <Link to="/terms" className="text-blue-500 underline">Terms & Conditions</Link>.
        </span>
      );
    }

    // 8. Admin / Approval
    if (lower.includes("admin") || lower.includes("approve") || lower.includes("pending")) {
      return (
        <span>
          If you registered as a Doctor or Clinic, your profile needs Admin approval before it goes live. You will receive access once approved!
        </span>
      );
    }

    // Fallback
    return "I'm a simple bot, but I can help with a lot! Try asking about: signing up, logging in, finding doctors, booking appointments, nearby clinics, emergency ambulances, dashboards, profiles, blogs, or our policies.";
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate bot thinking
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: generateResponse(input),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-2">
              <img src="/bot-icon.svg" alt="Bot" className="h-6 w-6 object-contain" />
              <div>
                <h3 className="font-semibold text-sm">SwasthyaCare Assistant</h3>
                <p className="text-xs text-primary-foreground/80">Online | Ready to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary/90 h-8 w-8 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 bg-slate-50/50">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.type === "bot" && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 p-1">
                      <img src="/bot-icon.svg" alt="Bot" className="h-full w-full object-contain" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      msg.type === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-white border shadow-sm text-slate-700 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.type === "user" && (
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-3 bg-white border-t">
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-full border-slate-300 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="rounded-full shrink-0 h-10 w-10 bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 hover:scale-105 ${
          isOpen ? "bg-slate-800 hover:bg-slate-900" : "bg-primary hover:bg-primary/90"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <img src="/bot-icon.svg" alt="Chatbot" className="h-10 w-10 object-contain" />
        )}
      </Button>
    </div>
  );
}
