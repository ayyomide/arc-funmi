"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Bell, Lock, Eye, Key, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Prevent static generation for this page since it's in protected routes
export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    weeklyDigest: true,
    profileVisibility: "public",
    showEmail: false
  });

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSelectChange = (setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/profile" className="inline-flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and privacy settings</p>
        </div>

        <div className="space-y-8">
          {/* Notifications Section */}
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-gray-400 text-sm">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Push Notifications</h3>
                  <p className="text-gray-400 text-sm">Receive push notifications</p>
                </div>
                <button
                  onClick={() => handleToggle('pushNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.pushNotifications ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Weekly Digest</h3>
                  <p className="text-gray-400 text-sm">Receive weekly summary of activities</p>
                </div>
                <button
                  onClick={() => handleToggle('weeklyDigest')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.weeklyDigest ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-white">Privacy</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Profile Visibility</h3>
                  <p className="text-gray-400 text-sm">Who can see your profile</p>
                </div>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value) => handleSelectChange('profileVisibility', value)}
                >
                  <SelectTrigger className="w-40 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-700">
                    <SelectItem value="public" className="text-white hover:bg-gray-700">Public</SelectItem>
                    <SelectItem value="followers" className="text-white hover:bg-gray-700">Followers Only</SelectItem>
                    <SelectItem value="private" className="text-white hover:bg-gray-700">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Show Email</h3>
                  <p className="text-gray-400 text-sm">Display email on your profile</p>
                </div>
                <button
                  onClick={() => handleToggle('showEmail')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showEmail ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.showEmail ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-white">Account</h2>
            </div>
            
            <div className="space-y-4">
              <Link 
                href="/profile/edit"
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div>
                  <h3 className="text-white font-medium">Edit Profile</h3>
                  <p className="text-gray-400 text-sm">Update your personal information</p>
                </div>
                <div className="text-yellow-500">→</div>
              </Link>
              
              <button className="flex items-center justify-between w-full p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="text-white font-medium">Change Password</h3>
                    <p className="text-gray-400 text-sm">Update your account password</p>
                  </div>
                </div>
                <div className="text-yellow-500">→</div>
              </button>
              
              <button className="flex items-center justify-between w-full p-4 bg-red-900/20 border border-red-500/20 rounded-lg hover:bg-red-900/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="text-red-400 font-medium">Delete Account</h3>
                    <p className="text-gray-400 text-sm">Permanently delete your account</p>
                  </div>
                </div>
                <div className="text-red-400">→</div>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center pt-8">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-600 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
