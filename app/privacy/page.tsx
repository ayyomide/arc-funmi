"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield, Eye, Lock, Users, FileText, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, profile details)",
        "Content you create and publish on our platform (articles, comments, profile information)",
        "Usage data and analytics to improve our services",
        "Device and browser information for security and optimization purposes"
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our services",
        "To notify you about changes to our service",
        "To allow you to participate in interactive features",
        "To provide customer support and respond to your requests",
        "To gather analysis or valuable information to improve our service"
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "We may share information with trusted service providers who assist us in operating our platform",
        "We may disclose information when required by law or to protect our rights",
        "Anonymous, aggregated data may be shared for research and analytics purposes"
      ]
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        "We implement appropriate security measures to protect your personal information",
        "All sensitive data is encrypted during transmission using SSL technology",
        "Regular security audits and updates to maintain data protection standards",
        "Access to personal data is restricted to authorized personnel only"
      ]
    },
    {
      icon: FileText,
      title: "Your Rights",
      content: [
        "Access: You can request access to your personal data",
        "Correction: You can request correction of inaccurate data",
        "Deletion: You can request deletion of your personal data",
        "Portability: You can request a copy of your data in a portable format",
        "Objection: You can object to certain processing of your data"
      ]
    },
    {
      icon: Mail,
      title: "Contact Us",
      content: [
        "If you have questions about this Privacy Policy, please contact us:",
        "Email: privacy@arcfunmi.com",
        "Address: Lagos, Nigeria",
        "We will respond to your inquiry within 30 days"
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
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Privacy <span className="text-yellow-500">Policy</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Your privacy is important to us. This Privacy Policy explains how Arcfunmi collects, 
            uses, and protects your information.
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
              Arcfunmi (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the Arcfunmi website and mobile application 
              (the &quot;Service&quot;). This page informs you of our policies regarding the collection, use, 
              and disclosure of personal data when you use our Service and the choices you have 
              associated with that data.
            </p>
            <p className="text-gray-300">
              We use your data to provide and improve the Service. By using the Service, you agree 
              to the collection and use of information in accordance with this policy.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
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

      {/* Cookies Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Cookies and Tracking Technologies</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                We use cookies and similar tracking technologies to track activity on our Service 
                and hold certain information. Cookies are files with small amount of data which 
                may include an anonymous unique identifier.
              </p>
              <p className="text-gray-300">
                You can instruct your browser to refuse all cookies or to indicate when a cookie 
                is being sent. However, if you do not accept cookies, you may not be able to use 
                some portions of our Service.
              </p>
              <div className="bg-black rounded-lg p-4 mt-6">
                <h3 className="text-lg font-semibold text-white mb-2">Types of cookies we use:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Essential cookies:</strong> Required for the website to function properly</li>
                  <li>• <strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li>• <strong>Preference cookies:</strong> Remember your settings and preferences</li>
                  <li>• <strong>Marketing cookies:</strong> Track visitors across websites to display relevant ads</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Children's Privacy */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Children&apos;s Privacy</h2>
            <p className="text-gray-300 mb-4">
              Our Service does not address anyone under the age of 13. We do not knowingly collect 
              personally identifiable information from anyone under the age of 13. If you are a 
              parent or guardian and you are aware that your child has provided us with personal 
              data, please contact us.
            </p>
            <p className="text-gray-300">
              If we become aware that we have collected personal data from children without 
              verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </div>
        </div>
      </section>

      {/* Changes to Policy */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Changes to This Privacy Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date 
              at the top of this Privacy Policy.
            </p>
            <p className="text-gray-300">
              You are advised to review this Privacy Policy periodically for any changes. Changes 
              to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Questions About This Policy?</h2>
          <p className="text-gray-300 mb-8">
            If you have any questions about this Privacy Policy, please don&apos;t hesitate to contact us.
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
