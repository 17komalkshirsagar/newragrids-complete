import React, { useState } from "react";
import { useFormik } from "formik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loginAnimation from "../assets/Login.json";
import { toast } from "sonner";

import { useLoginUserMutation } from "../Redux/user.api";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },

    onSubmit: async (values) => {
      try {
        const res = await loginUser(values).unwrap();
        login(res.data, res.token);
        toast.success("✅ Login Successful!", { position: "top-right" });
        navigate("/UserProfile");
      } catch (error) {
        toast.error(error || "❌ Invalid Email or Password!", { position: "top-right" });
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F5] via-white to-[#28B8B4]/10 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

        {/* Left Side - Animation with Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="hidden lg:flex flex-col items-center justify-center space-y-8"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
           
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent">
                NewRa Grids
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md">
              Powering the Green Shift with Automated Energy Solutions
            </p>
          </div>
          
          <div className="relative">
            <Lottie animationData={loginAnimation} loop className="w-80 h-64" />
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#28B8B4] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#2D50A1] rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            {[
              { value: "20-40%", label: "Savings" },
              { value: "100%", label: "RPO Compliant" },
              { value: "Zero", label: "Capex" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-[#2D50A1] dark:text-[#28B8B4]">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <Card className="w-full max-w-md shadow-2xl rounded-3xl bg-white dark:bg-gray-900 border border-[#28B8B4]/20">
            {/* Gradient Top Border */}
            <div className="h-2 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] rounded-t-3xl"></div>
            
            <CardHeader className="text-center pb-6 pt-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2D50A1] to-[#28B8B4] rounded-2xl flex items-center justify-center shadow-lg">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Sign in to your energy dashboard
              </p>
            </CardHeader>

            <CardContent className="pb-8">
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      disabled={isLoading}
                      className="pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20 transition-all duration-300 bg-white dark:bg-gray-800"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      disabled={isLoading}
                      className="pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20 transition-all duration-300 bg-white dark:bg-gray-800"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#28B8B4] transition-colors duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full mt-6 py-3 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] hover:from-[#2D50A1] hover:to-[#28B8B4] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <Link 
                      to="/UserForm" 
                      className="text-[#2D50A1] dark:text-[#28B8B4] font-semibold hover:text-[#28B8B4] dark:hover:text-[#2D50A1] transition-colors duration-300 underline underline-offset-4"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#28B8B4]/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-[#2D50A1]/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[#F79050]/10 rounded-full blur-lg"></div>
    </div>
  );
};

export default Login;