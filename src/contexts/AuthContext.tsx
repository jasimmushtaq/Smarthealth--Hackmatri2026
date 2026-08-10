import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "admin" | "doctor" | "patient" | "clinic" | "ambulance" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  isApproved: boolean | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  isApproved: null,
  loading: true,
  signOut: async () => {},
  refreshRole: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async (userId: string) => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    
    const currentRole = (roleData?.role as UserRole) ?? null;
    setRole(currentRole);

    if (currentRole === "doctor") {
      const { data: docData } = await supabase
        .from("doctors")
        .select("is_approved")
        .eq("user_id", userId)
        .maybeSingle();
      // Ensure it maps to boolean
      setIsApproved(docData ? Boolean(docData.is_approved) : false);
    } else if (currentRole === "clinic") {
      const { data: clinicData } = await supabase
        .from("clinics")
        .select("is_approved")
        .eq("user_id", userId)
        .maybeSingle();
      setIsApproved(clinicData ? Boolean(clinicData.is_approved) : false);
    } else {
      setIsApproved(null);
    }
  }, []);

  const refreshRole = useCallback(async () => {
    if (user) {
      await fetchRole(user.id);
    }
  }, [user, fetchRole]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchRole(session.user.id);
      }
      if (mounted) setLoading(false);
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Use setTimeout to avoid deadlock with Supabase auth
          setTimeout(() => {
            if (mounted) {
              fetchRole(session.user.id);
            }
          }, 0);
        } else {
          setRole(null);
          setIsApproved(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setIsApproved(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, isApproved, loading, signOut, refreshRole }}>
      {children}
    </AuthContext.Provider>
  );
}
