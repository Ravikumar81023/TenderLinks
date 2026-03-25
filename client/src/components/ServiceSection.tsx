import type React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCombinedStore } from "@/store/combinedServiceStore";
import LoadingSpinner from "@/components/LoadingSpinner";

const ServiceSection: React.FC = () => {
  const { fetchServices, services, isLoadingServices } = useCombinedStore();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (isLoadingServices) {
    return <LoadingSpinner />;
  }

  return (
    <section className="bg-gradient-to-r from-[#1a237e]/5 to-[#00838f]/5 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1a237e]">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(services) && services?.slice(0, 3).map((service) => (
            <Card
              key={service.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 bg-white rounded-xl"
            >
              <CardContent className="p-0">
                <div className="relative h-56 overflow-hidden">
                  {service.image && (
                    <img
                      src={`${BASE_URL}${service.image}`}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-[#1a237e] mb-3 group-hover:text-[#00838f] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="px-6 pb-6">
                <Link to={`/services/${service.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-[#1a237e] to-[#00838f] hover:opacity-90 text-white rounded-lg py-4 text-md font-medium transition-all duration-300 group">
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/services">
            <Button className="bg-gradient-to-r from-[#1a237e] to-[#00838f] hover:opacity-90 text-white">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
