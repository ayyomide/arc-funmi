"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Prevent static generation for this page since it uses authentication
export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await resetPassword(email);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Password reset link has been sent to your email. Please check your inbox.");
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
            href="/login"
            className="inline-flex items-center text-black hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Login</span>
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
                  alt="Arcfunmi Logo"
                  width={150}
                  height={50}
                  priority
                />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-black mb-4">
                Forgot Password?
              </h1>
              <p className="text-black/70 mb-8">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-white border-2 border-black rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Send Reset Link Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <p className="text-black">
                Remember your password?{" "}
                <Link href="/login" className="font-semibold hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
