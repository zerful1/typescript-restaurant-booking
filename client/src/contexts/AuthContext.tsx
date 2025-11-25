import { createContext, useContext, createSignal, onMount, type JSX } from "solid-js";

interface User {
  id: number;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: () => User | null;
  loading: () => boolean;
  isAdmin: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<User | null>(null);
  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    refreshAuth();
  });

  function isAdmin() {
    return user()?.role === "admin";
  }

  async function refreshAuth() {
    setLoading(true);
    try {
      const response = await fetch("/api/userdata", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setUser({ id: data.id, email: data.email, role: data.role });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function register(email: string, password: string) {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword: password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Registration failed");
    }

    await refreshAuth();
  }

  async function login(email: string, password: string) {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Login failed");
    }

    await refreshAuth();
  }

  async function logout() {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    setUser(null);
  }

  async function deleteAccount() {
    const response = await fetch("/api/delete", {
      method: "POST",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Account deletion failed");
    }

    setUser(null);
  }

  const value: AuthContextType = {
    user,
    loading,
    isAdmin,
    login,
    register,
    logout,
    deleteAccount,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
