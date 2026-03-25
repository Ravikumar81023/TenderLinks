import { useEffect } from "react";
import {
  BarChartIcon as ChartBar,
  Target,
  Users,
  Shield,
  Award,
  Clock,
  Building,
} from "lucide-react";
import { useAboutStore } from "@/store/aboutStore";
import { useContactStore } from "@/store/contactStore";
import { PageHeader } from "@/components/ui/page-header";
import { StatsCard } from "@/components/ui/stats-card";

export default function About() {
  const { aboutInfo, loading, fetchAboutInfo } = useAboutStore();
  const { socialMedia, fetchAllData } = useContactStore();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchAboutInfo();
    fetchAllData();
  }, []);

  const formatNumber = (num: string) => {
    return new Intl.NumberFormat("en-IN", {
      maximumSignificantDigits: 3,
      notation: "compact",
      compactDisplay: "short",
    }).format(Number(num));
  };

  const stats = [
    {
      icon: ChartBar,
      title: "Total Tender Value",
      value: loading
        ? "Loading..."
        : formatNumber(aboutInfo?.totalTenderValue || "0"),
      prefix: "₹",
    },
    {
      icon: Target,
      title: "Total Tenders",
      value: loading
        ? "Loading..."
        : formatNumber(String(aboutInfo?.totalTenderCount || 0)),
    },
    {
      icon: Users,
      title: "Clients Served",
      value: "1000+",
    },
  ];

  const services = [
    {
      icon: Building,
      title: "Tender Information",
      description:
        "Comprehensive tender information service across all sectors",
    },
    {
      icon: Shield,
      title: "Company Registration",
      description: "End-to-end assistance in company registration process",
    },
    {
      icon: Award,
      title: "GEM Registration",
      description: "Expert guidance for Government e-Marketplace registration",
    },
  ];

  const values = [
    {
      icon: Users,
      title: "Client Focus",
      description: "Putting our clients' needs first",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Maintaining highest quality standards",
    },
    {
      icon: Clock,
      title: "Timeliness",
      description: "Delivering on time, every time",
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "Honest and transparent dealings",
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      <PageHeader
        title="About TenderLink"
        subtitle="India's Leading Tender Information Service Provider and Consultancy Firm"
      />

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-blue-50 rounded-xl p-6 mb-4 transform group-hover:scale-105 transition-transform duration-200">
                    <div className="bg-white rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Social Media */}
      {socialMedia && socialMedia.length > 0 && (
        <div className="bg-gradient-to-b from-white to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Connect With Us
            </h2>
            <div className="flex justify-center gap-6">
              {Array.isArray(socialMedia) && socialMedia.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <img
                    src={`${BASE_URL}/uploads/${platform.logo}`}
                    alt={platform.platformName}
                    className="h-6 w-6 group-hover:scale-110 transition-transform duration-200"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
