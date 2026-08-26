import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  registerAccount,
  loginAccount,
  logoutAccount,
  getCurrentAccount,
  changeAccountPassword,
  setAccountRole,
  loginWithGoogle as loginWithGoogleFn,
  UserRole
} from '../lib/appwrite';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole | null; // null = compte connecté (ex: via Google) sans rôle choisi
}

interface AuthContextType {
  user: AppUser | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<AppUser>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<AppUser>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string, oldPassword: string) => Promise<void>;
  loginWithGoogle: () => void;
  chooseRole: (role: UserRole) => Promise<AppUser>;
  refreshUser: () => Promise<AppUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAppUser(account: any): AppUser {
  return {
    id: account.$id,
    name: account.name,
    email: account.email,
    // Pas de valeur par défaut ici : un compte Google fraîchement créé
    // n'a pas encore de rôle choisi, on doit pouvoir le détecter.
    role: (account.prefs?.role as UserRole) || null
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const account = await getCurrentAccount();
      setUser(account ? toAppUser(account) : null);
      setIsAuthLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    await loginAccount(email, password);
    const account = await getCurrentAccount();
    if (!account) throw new Error('Connexion impossible.');
    const appUser = toAppUser(account);
    setUser(appUser);
    return appUser;
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    const account = await registerAccount(email, password, name, role);
    const appUser = toAppUser(account);
    setUser(appUser);
    return appUser;
  };

  const logout = async () => {
    await logoutAccount();
    setUser(null);
  };

  const changePassword = async (newPassword: string, oldPassword: string) => {
    await changeAccountPassword(newPassword, oldPassword);
  };

  const loginWithGoogle = () => {
    loginWithGoogleFn();
  };

  const chooseRole = async (role: UserRole) => {
    await setAccountRole(role);
    const account = await getCurrentAccount();
    if (!account) throw new Error('Session introuvable.');
    const appUser = toAppUser(account);
    setUser(appUser);
    return appUser;
  };

  const refreshUser = async () => {
    const account = await getCurrentAccount();
    const appUser = account ? toAppUser(account) : null;
    setUser(appUser);
    return appUser;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthLoading, login, register, logout, changePassword, loginWithGoogle, chooseRole, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
