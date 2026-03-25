import TenderSection from "@/components/TenderSection";
import HeroSection from "@/components/HeroSection";
import BlogSection from "@/components/BlogSection";
import AboutSection from "@/components/AboutSection";
import ServiceSection from "@/components/ServiceSection";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ServiceSection />
        <TenderSection />
        <BlogSection />
      </main>
    </div>
  );
};

export default HomePage;
