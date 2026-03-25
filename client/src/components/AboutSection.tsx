import type React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChartIcon as ChartBar, Target, Users } from "lucide-react";
import { useAboutStore } from "@/store/aboutStore";

const AboutSection: React.FC = () => {
  const { aboutInfo, loading, fetchAboutInfo } = useAboutStore();

  useEffect(() => {
    fetchAboutInfo();
  }, [fetchAboutInfo]);

  const formatNumber = (num: string) => {
    return new Intl.NumberFormat("en-IN", {
      maximumSignificantDigits: 3,
      notation: "compact",
      compactDisplay: "short",
    }).format(Number(num));
  };

  return (
    <section className="bg-gradient-to-b from-white to-[#1a237e]/5 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">About TenderLink</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            India's Leading Tender Information Service Provider and Consultancy
            Firm, empowering businesses since 2010.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <ChartBar className="h-12 w-12 text-[#1a237e] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Total Live Tenders' Value
            </h3>
            <p className="text-3xl font-bold text-[#00838f]">
              ₹
              {loading
                ? "Loading..."
                : formatNumber(aboutInfo?.totalTenderValue || "0")}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Target className="h-12 w-12 text-[#1a237e] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Total Tenders Processed
            </h3>
            <p className="text-3xl font-bold text-[#00838f]">
              {loading
                ? "Loading..."
                : formatNumber(String(aboutInfo?.totalTenderCount || 0))}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="h-12 w-12 text-[#1a237e] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Total Live Tenders</h3>
            <p className="text-3xl font-bold text-[#00838f]">1000+</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            At TenderLink, we're committed to providing comprehensive tender
            information and expert consultancy services to help businesses
            thrive in the competitive world of government and private sector
            contracts.
          </p>
          <Link to="/about">
            <Button className="bg-gradient-to-r from-[#1a237e] to-[#00838f] hover:opacity-90 text-white">
              Learn More About Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
