"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, User } from "lucide-react";

// Prevent static generation for this page since it requires authentication
export const dynamic = 'force-dynamic';

export default function EditProfilePage() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    qualification: "",
    profession: "",
    bio: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || "",
        email: user.email || "",
        phoneNumber: user.phone_number || "",
        qualification: user.qualification || "",
        profession: user.profession || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQualificationChange = (qualification: string) => {
    setFormData(prev => ({
      ...prev,
      qualification
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast("Please sign in to update your profile", "error");
      return;
    }

    setLoading(true);

    try {
      const result = await updateProfile({
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        qualification: formData.qualification,
        profession: formData.profession,
        bio: formData.bio
      });

      if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast("Profile updated successfully!", "success");
      }
    } catch (err) {
      showToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const qualifications = ["Student", "OND", "HND", "BSC", "MSC", "PHD"];
  const professions = ["Architect", "Engineer", "Contractor", "Designer", "Project Manager", "Construction Professional", "Other"];

  if (authLoading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-lg">Loading...</div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
              <p className="text-gray-400 mb-6">You need to be logged in to edit your profile.</p>
              <Link 
                href="/login"
                className="bg-yellow-500 text-black px-6 py-3 rounded-full font-medium hover:bg-yellow-400 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Link 
              href="/profile"
              className="text-white hover:text-yellow-500 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl font-bold text-white">Edit Profile</h1>
          </div>
          <button 
            type="submit"
            form="edit-profile-form"
            disabled={loading}
            className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center mb-12">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.full_name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Full Name */}
          <div>
            <label className="block text-white font-medium mb-3 text-lg">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-6 py-4 bg-white border-0 rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email (Read Only) */}
          <div>
            <label className="block text-white font-medium mb-3 text-lg">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-6 py-4 bg-gray-200 border-0 rounded-full text-gray-500 placeholder-gray-400 cursor-not-allowed"
              placeholder="Email cannot be changed"
            />
            <p className="text-gray-400 text-sm mt-2">Email address cannot be changed for security reasons.</p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-white font-medium mb-3 text-lg">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-6 py-4 bg-white border-0 rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block text-white font-medium mb-3 text-lg">
              Profession
            </label>
            <select
              name="profession"
              value={formData.profession}
              onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
              disabled={loading}
              className="w-full px-6 py-4 bg-white border-0 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              <option value="">Select your profession</option>
              {professions.map((profession) => (
                <option key={profession} value={profession.toLowerCase()}>
                  {profession}
                </option>
              ))}
            </select>
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-white font-medium mb-6 text-lg">
              Qualification
            </label>
            <div className="space-y-4">
              {qualifications.map((qual) => (
                <label key={qual} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="qualification"
                    value={qual}
                    checked={formData.qualification === qual}
                    onChange={(e) => handleQualificationChange(e.target.value)}
                    disabled={loading}
                    className="w-5 h-5 text-yellow-500 border-2 border-gray-400 focus:ring-yellow-500 focus:ring-2 disabled:opacity-50"
                  />
                  <span className="ml-4 text-white text-lg">{qual}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-white font-medium mb-3 text-lg">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={loading}
              rows={4}
              className="w-full px-6 py-4 bg-white border-0 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Change Password Button */}
          <div className="pt-8">
            <Link
              href="/reset-password"
              className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-colors inline-block"
            >
              Change Password
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}
