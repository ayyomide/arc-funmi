"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/auth";

// Prevent static generation for this page since it uses authentication
export const dynamic = 'force-dynamic';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profession: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate profession selected
    if (!formData.profession) {
      setError("Please select a profession");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/login?message=Account created successfully. Please check your email to verify your account.");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await authService.signInWithGoogle();
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-500 flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="w-full h-full bg-cover bg-center rounded-r-[80px]"
          style={{
            backgroundImage: "url('/assets/images/auth-building.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Optional overlay for better image contrast */}
          <div className="absolute inset-0 bg-black/20 rounded-r-[80px]" />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8">
        {/* Back Button */}
        <div className="mb-4">
          <Link 
            href="/"
            className="inline-flex items-center text-black hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center mb-8">
                <Image
                  src="/assets/svgs/logo.svg"
                  alt="Arc Funmi Logo"
                  width={150}
                  height={50}
                  priority
                />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-black mb-8">
                Create an Account
              </h1>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Full Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-6 py-4 bg-white border-2 border-black rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 bg-white border-2 border-black rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-6 py-4 bg-white border-2 border-black rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-6 py-4 bg-white border-2 border-black rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Profession and Signup Button Row */}
              <div className="flex gap-4">
                {/* Profession Dropdown */}
                <div className="flex-1">
                  <Select value={formData.profession} onValueChange={(value) => setFormData({ ...formData, profession: value })}>
                    <SelectTrigger className="w-full px-6 py-4 bg-white border-2 border-black rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-black transition-all h-auto">
                      <SelectValue placeholder="Profession" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                      <SelectItem value="architect">Architect</SelectItem>
                      <SelectItem value="engineer">Engineer</SelectItem>
                      <SelectItem value="construction">Construction Professional</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="project-manager">Project Manager</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Signup Button */}
                <div>
                  <button
                    type="submit"
                    className="bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors whitespace-nowrap border-2 border-white"
                  >
                    Signup
                  </button>
                </div>
              </div>
            </form>

            {/* Divider and Social Login */}
            <div className="space-y-6">
              {/* Login link */}
              <div className="text-center">
                <p className="text-black">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold hover:underline">
                    Login
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t-2 border-black"></div>
                <span className="px-4 text-black font-semibold">or</span>
                <div className="flex-1 border-t-2 border-black"></div>
              </div>

              {/* Google Sign In */}
              <div className="flex justify-center">
                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="bg-white hover:bg-gray-50 rounded-full px-8 py-3 flex items-center space-x-3 transition-colors border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FcGoogle className="w-6 h-6" />
                  <span className="text-gray-700 font-medium">Continue with Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 