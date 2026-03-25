import { useCombinedStore } from "@/store/combinedServiceStore";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Play, ArrowRight, MapPin, Phone, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/LoadingSpinner";

const Services = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const {
    fetchServices,
    fetchCAs,
    services,
    cas,
    isLoadingServices,
    isLoadingCAs,
  } = useCombinedStore();

  useEffect(() => {
    fetchServices();
    fetchCAs();
  }, [fetchServices, fetchCAs]);

  if (isLoadingServices || isLoadingCAs) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a237e]/5 to-[#00838f]/5 p-8 py-24">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="services" className="w-full">
          <div className="text-center mb-8">
            <TabsList className="inline-flex bg-gradient-to-r from-[#1a237e]/10 to-[#00838f]/10 p-1 rounded-lg">
              <TabsTrigger
                value="services"
                className="px-8 py-3 rounded-md data-[state=active]:bg-gradient-to-r from-[#1a237e] to-[#00838f] data-[state=active]:text-white transition-all"
              >
                Our Services
              </TabsTrigger>
              <TabsTrigger
                value="experts"
                className="px-8 py-3 rounded-md data-[state=active]:bg-gradient-to-r from-[#1a237e] to-[#00838f] data-[state=active]:text-white transition-all"
              >
                Our Experts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="services" className="mt-4">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-4">
                <span className="text-[#1a237e]">Professional </span>
                <span className="text-[#00838f]">Services</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Discover our comprehensive range of professional services
                tailored to meet your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(services)&&services?.map((service) => (
                <Card
                  key={service.id}
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-56 overflow-hidden">
                      {service.image && (
                        <img
                          src={`${BASE_URL}${service.image}`}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      {service.video && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300">
                          <Play className="w-16 h-16 text-white opacity-90 group-hover:opacity-100" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CardHeader>

                  <CardContent className="mt-6 px-6">
                    <h2 className="text-2xl font-semibold text-[#1a237e] mb-3 group-hover:text-[#00838f] transition-colors duration-300">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3">
                      {service.description}
                    </p>
                  </CardContent>

                  <CardFooter className="px-6 pb-6">
                    <Link to={`/services/${service.id}`} className="w-full">
                      <Button className="w-full bg-gradient-to-r from-[#1a237e] to-[#00838f] hover:opacity-90 text-white rounded-lg py-4 text-md font-medium transition-all duration-300 group">
                        Learn More
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experts" className="mt-4">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-4">
                <span className="text-[#1a237e]">Our </span>
                <span className="text-[#00838f]">Experts</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Meet our team of experienced Chartered Accountants ready to
                assist you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(cas)&&cas?.map((ca, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                >
                  <CardContent className="pt-6 px-6">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-gradient-to-r from-[#1a237e]/20 to-[#00838f]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl font-bold text-[#1a237e]">
                          {ca.name.charAt(0)}
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold text-[#1a237e] mb-2">
                        {ca.name}
                      </h2>
                      <div className="flex items-center justify-center text-[#00838f] mb-4">
                        <Award className="w-5 h-5 mr-2" />
                        <span>{ca.experience} years experience</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-[#00838f]" />
                        <span>{`${ca.city}, ${ca.district}, ${ca.state}`}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-[#00838f]" />
                        <span>{ca.phoneNumber}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Services;
