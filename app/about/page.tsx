"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { Building, Users, Target, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Users", value: "10,000+", icon: Users },
    { label: "Articles Published", value: "5,000+", icon: Building },
    { label: "Countries Reached", value: "50+", icon: Target },
    { label: "Industry Awards", value: "15+", icon: Award }
  ];

  const team = [
    {
      name: "Olajide Funminiyi",
      role: "Founder & CEO",
      image: "/assets/images/article-1.jpg",
      description: "Architect with 15+ years of experience in sustainable design"
    },
    {
      name: "Sarah Johnson",
      role: "Head of Engineering",
      image: "/assets/images/article-2.jpg",
      description: "Structural engineer passionate about innovative construction"
    },
    {
      name: "Michael Chen",
      role: "Content Director",
      image: "/assets/images/article-3.jpg",
      description: "Construction expert specializing in project management"
    }
  ];

  const values = [
    {
      title: "Innovation",
      description: "We embrace cutting-edge technologies and methodologies to push the boundaries of what's possible in the built environment.",
      icon: "🚀"
    },
    {
      title: "Sustainability",
      description: "We're committed to promoting environmentally responsible practices that create a better future for all.",
      icon: "🌱"
    },
    {
      title: "Community",
      description: "We believe in the power of collaboration and knowledge sharing to advance our industry forward.",
      icon: "🤝"
    },
    {
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from content quality to user experience.",
      icon: "⭐"
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-yellow-500">Arcfunmi</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Where the Built World Shares Ideas. We&apos;re a knowledge hub connecting architects, 
            engineers, and construction professionals worldwide.
          </p>
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image
              src="/assets/images/hero-bg.jpg"
              alt="About Arcfunmi"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-yellow-500/20"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-gray-300 mb-6">
                Founded in 2020, Arcfunmi emerged from a simple yet powerful vision: to create a 
                digital space where professionals in the built environment could share knowledge, 
                collaborate on ideas, and inspire one another.
              </p>
              <p className="text-gray-300 mb-6">
                What started as a small blog has grown into a thriving community of architects, 
                engineers, and construction professionals from around the world. We&apos;ve become 
                the go-to platform for industry insights, innovative solutions, and professional growth.
              </p>
              <p className="text-gray-300">
                Today, we continue to evolve, always staying true to our core mission of fostering 
                collaboration and knowledge sharing in the built environment industry.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="/assets/images/article-4.jpg"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl p-8">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-yellow-500 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Community</h2>
          <p className="text-xl text-gray-300 mb-8">
            Ready to connect with professionals who share your passion for the built environment?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
