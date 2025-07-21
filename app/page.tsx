import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WhyArcFunmi from "@/components/sections/WhyArcFunmi";
import Featured from "@/components/sections/Featured";
import HotTopics from "@/components/sections/HotTopics";
import CallToAction from "@/components/sections/CallToAction";
import Newsletter from "@/components/sections/Newsletter";
import { DatabaseStatusBanner } from "@/components/ui/database-status";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4">
        <DatabaseStatusBanner />
      </div>
      <HeroSection />
      <WhyArcFunmi />
      <Featured />
      <HotTopics />
      <CallToAction />
      <Newsletter />
      <Footer />
    </main>
  );
}
