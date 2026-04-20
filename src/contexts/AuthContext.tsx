import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { FamilyMember } from "@/types";
import { authenticateMember, getFamilyMembers, saveFamilyMember, deleteFamilyMember } from "@/lib/storage";

// ─── Types ─────────────────────────────────────────────────────────────────

interface AuthContextValue {
  currentUser: FamilyMember | null;
  familyMembers: FamilyMember[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (member: FamilyMember) => void;
  removeFamilyMember: (memberId: string) => void;
  refreshMembers: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "rappel_vehicule_session";

// ─── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FamilyMember | null>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? (JSON.parse(saved) as FamilyMember) : null;
    } catch {
      return null;
    }
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() =>
    getFamilyMembers()
  );

  // Re-sync currentUser from storage if data changed
  useEffect(() => {
    if (currentUser) {
      const fresh = getFamilyMembers().find((m) => m.id === currentUser.id);
      if (fresh) setCurrentUser(fresh);
    }
  }, [familyMembers]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshMembers = useCallback(() => {
    setFamilyMembers(getFamilyMembers());
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const member = authenticateMember(email, password);
      if (!member) return false;
      setCurrentUser(member);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(member));
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const addFamilyMember = useCallback((member: FamilyMember) => {
    saveFamilyMember(member);
    setFamilyMembers(getFamilyMembers());
  }, []);

  const updateFamilyMember = useCallback((member: FamilyMember) => {
    saveFamilyMember(member);
    setFamilyMembers(getFamilyMembers());
  }, []);

  const removeFamilyMember = useCallback((memberId: string) => {
    deleteFamilyMember(memberId);
    setFamilyMembers(getFamilyMembers());
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        familyMembers,
        isAuthenticated: currentUser !== null,
        login,
        logout,
        addFamilyMember,
        updateFamilyMember,
        removeFamilyMember,
        refreshMembers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
