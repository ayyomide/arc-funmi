"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileText, Scale, Users, Shield, AlertTriangle, Mail } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Arcfunmi, you accept and agree to be bound by these Terms of Service",
        "If you do not agree to these terms, you may not access or use our services",
        "We reserve the right to modify these terms at any time with notice to users",
        "Your continued use of the service after changes constitutes acceptance of new terms"
      ]
    },
    {
      icon: Users,
      title: "User Accounts",
      content: [
        "You must provide accurate and complete information when creating an account",
        "You are responsible for maintaining the security of your account credentials",
        "You must notify us immediately of any unauthorized use of your account",
        "One person or entity may not maintain multiple accounts",
        "You must be at least 13 years old to create an account"
      ]
    },
    {
      icon: Shield,
      title: "Content Guidelines",
      content: [
        "Content must be original, accurate, and relevant to architecture, engineering, or construction",
        "You retain ownership of content you create, but grant us license to use it on our platform",
        "Content must not violate copyright, trademark, or other intellectual property rights",
        "We reserve the right to remove content that violates our guidelines",
        "Professional and respectful communication is required at all times"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        "Posting spam, malicious content, or irrelevant material",
        "Harassment, bullying, or discrimination of any kind",
        "Sharing false, misleading, or dangerous information",
        "Attempting to hack, disrupt, or compromise our platform security",
        "Commercial activities without prior written consent",
        "Impersonating other individuals or organizations"
      ]
    },
    {
      icon: Scale,
      title: "Liability and Disclaimers",
      content: [
        "Arcfunmi is provided 'as is' without warranties of any kind",
        "We are not liable for any damages arising from use of our platform",
        "Users are responsible for their own content and interactions",
        "We do not guarantee the accuracy or reliability of user-generated content",
        "Our total liability is limited to the amount paid for our services"
      ]
    },
    {
      icon: Mail,
      title: "Contact and Enforcement",
      content: [
        "Report violations to: terms@arcfunmi.com",
        "We investigate all reported violations promptly",
        "Violations may result in warnings, content removal, or account suspension",
        "Serious violations may result in permanent account termination",
        "Users may appeal enforcement decisions through our contact form"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Terms of <span className="text-yellow-500">Service</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            These Terms of Service govern your use of Arcfunmi and outline the rights and 
            responsibilities of all users.
          </p>
          <p className="text-gray-400">Last updated: January 1, 2025</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-gray-300 mb-4">
              Welcome to Arcfunmi, a platform dedicated to connecting professionals in the 
              architecture, engineering, and construction industries. These Terms of Service 
              (&quot;Terms&quot;) govern your access to and use of our website, mobile applications, 
              and related services (collectively, the &quot;Service&quot;).
            </p>
            <p className="text-gray-300">
              By using Arcfunmi, you agree to these Terms and our Privacy Policy. Please read 
              them carefully before using our platform.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={index} className="bg-gray-900 rounded-2xl p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-black" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-300 flex items-start">
                        <span className="text-yellow-500 mr-3 mt-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Intellectual Property */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Intellectual Property Rights</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                The Arcfunmi platform, including its design, features, and functionality, is owned
by Arcfunmi and is protected by copyright, trademark, and other intellectual 
                property laws.
              </p>
              <p className="text-gray-300">
                Users retain ownership of the content they create and publish on Arcfunmi. By
publishing content, you grant Arcfunmi a non-exclusive, worldwide, royalty-free 
                license to use, display, and distribute your content on our platform.
              </p>
              <div className="bg-black rounded-lg p-4 mt-6">
                <h3 className="text-lg font-semibold text-white mb-2">Content License Grant:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Right to display your content on Arcfunmi</li>
                  <li>• Right to distribute content through our platform</li>
                  <li>• Right to create derivative works for platform optimization</li>
                  <li>• Right to sublicense to service providers for platform operation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Termination */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Termination</h2>
            <div className="space-y-4">
              <p className="text-gray-300 mb-4">
                Either you or Arcfunmi may terminate your account at any time. Upon termination:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Your access to the platform will be immediately revoked</li>
                <li>• Your published content may remain on the platform unless you request removal</li>
                <li>• You will no longer receive communications from Arcfunmi</li>
                <li>• Any premium features or subscriptions will be canceled</li>
              </ul>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-6">
                <p className="text-yellow-200">
                  <strong>Note:</strong> Termination does not relieve you of any obligations 
                  incurred prior to termination or affect any rights that should survive termination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Governing Law and Disputes</h2>
            <p className="text-gray-300 mb-4">
              These Terms are governed by the laws of Nigeria. Any disputes arising from these 
              Terms or your use of Arcfunmi will be resolved through binding arbitration in 
              Lagos, Nigeria.
            </p>
            <p className="text-gray-300">
              Before initiating any legal proceedings, both parties agree to attempt to resolve 
              disputes through good faith negotiations for a period of 30 days.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Questions About These Terms?</h2>
          <p className="text-gray-300 mb-8">
            If you have any questions about these Terms of Service, please contact us.
          </p>
          <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
            Contact Us
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
