"use client";

import Image from "next/image";

const features = [
  {
    icon: "/assets/svgs/build.svg",
    title: "African Heritage Preservation",
    description: "Document and celebrate traditional African construction techniques, indigenous building materials, and vernacular architecture that has stood the test of time across the continent."
  },
  {
    icon: "/assets/svgs/idea.svg", 
    title: "Global Knowledge Exchange",
    description: "Bridge African expertise with international best practices, creating a platform for cross-cultural learning and innovation in the built environment."
  },
  {
    icon: "/assets/svgs/write.svg",
    title: "Document Your Projects", 
    description: "Share your construction projects, architectural designs, and engineering solutions to build a comprehensive database of African and global built environment achievements."
  },
  {
    icon: "/assets/svgs/trophy.svg",
    title: "Professional Network",
    description: "Connect with architects, engineers, and construction professionals across Nigeria, Africa, and the globe to advance the documentation and preservation of our built heritage."
  }
];

export default function WhyArcFunmi() {
  return (
    <section className="bg-black py-20">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why <span className="text-yellow-500">Arcfunmi</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Join the community to document, preserve, and celebrate the rich architectural and engineering heritage of Nigeria and Africa while connecting with global innovations in construction and design.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-yellow-500 rounded-2xl p-8 hover:bg-yellow-600 transition-colors min-h-[350px] flex flex-col">
                <div className="flex justify-center mb-6">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={56}
                    height={56}
                    className="w-14 h-14"
                  />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-black leading-relaxed text-lg flex-1 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 