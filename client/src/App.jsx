import { Toaster } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner"; 
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Calculator from "./pages/Calculator";
import Contact from "./pages/Contact";
import KnowYour from "./components/knowyour";
import AdminLogin from "./components/Auth/AdminLogin";
import AdminData from "./components/Auth/AdminData";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import UserProfile from "./pages/UserProfile";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminProtectedRoute from "./contexts/AdminProtectedRoute";
import UserProtectedRoute from "./contexts/UserProtectedRoute"; // ✅ Import your existing file

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="ragrids-theme">
      <TooltipProvider>
        <Toaster position="top-right" />
        <AuthProvider>
          <AdminAuthProvider>
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/calculator" element={<Layout><Calculator /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/admin-login" element={<Layout><AdminLogin /></Layout>} />
              
              {/* ✅ Protected Admin Route */}
              <Route path="/data" element={
                <AdminProtectedRoute>
                  <Layout><AdminData /></Layout>
                </AdminProtectedRoute>
              } />
              
              <Route path="/UserForm" element={<Layout><KnowYour /></Layout>} />
              <Route path="/UserLogin" element={<Layout><Login /></Layout>} />
              
              {/* ✅ Protected User Profile Route - Now it's protected! */}
              <Route path="/UserProfile" element={
                <UserProtectedRoute>
                  <Layout><UserProfile /></Layout>
                </UserProtectedRoute>
              } />
            </Routes>
          </AdminAuthProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;