import { useEffect } from "react";
import { useContactStore } from "@/store/contactStore";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  ExternalLink,
  MessageSquare,
  Building2,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContactForm from "@/components/ContactForm";
import { PageHeader } from "@/components/ui/page-header";

const Contact = () => {
  const { fetchAllData, addresses, contacts, socialMedia, isLoading } =
    useContactStore();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const mainOffice = Array.isArray(addresses) && addresses.find((address) => address.isMainOffice);
  const branchOffices =Array.isArray(addresses) &&  addresses.filter((address) => !address.isMainOffice);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-[#1a237e]/5 to-[#00838f]/5">
      <PageHeader
        title="Get in Touch"
        subtitle="We're here to help and answer any questions you might have"
        accentText="Touch"
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Office Locations Section */}
        <div className="mb-16">
          {mainOffice && (
            <Card className="mb-8 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Building2 className="w-8 h-8 text-[#1a237e] mr-3" />
                  <h2 className="text-3xl font-bold text-[#1a237e]">
                    Head Office
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-6 h-6 text-[#00838f] mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-lg font-medium text-[#1a237e]">
                          {mainOffice.landmark}
                        </p>
                        <p className="text-gray-600">{`${mainOffice.city}, ${mainOffice.district}`}</p>
                        <p className="text-gray-600">{mainOffice.state}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {mainOffice.phoneNumbers.map((phone, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gradient-to-r from-[#1a237e]/10 to-[#00838f]/10 p-3 rounded-lg"
                      >
                        <Phone className="w-5 h-5 text-[#00838f] mr-3" />
                        <p className="text-gray-700 font-medium">{phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {Array.isArray(branchOffices) && branchOffices.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1a237e] mb-4">
                Branch Offices
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(branchOffices) &&branchOffices.map((office) => (
                  <Card
                    key={office.id}
                    className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 text-[#00838f] mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-[#1a237e]">
                              {office.landmark}
                            </p>
                            <p className="text-gray-600">{`${office.city}, ${office.district}`}</p>
                            <p className="text-gray-600">{office.state}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {office.phoneNumbers.map((phone, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-gradient-to-r from-[#1a237e]/10 to-[#00838f]/10 p-2 rounded-lg"
                            >
                              <Phone className="w-4 h-4 text-[#00838f] mr-2" />
                              <p className="text-sm text-gray-700">{phone}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Contacts */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-[#1a237e] mb-6 flex items-center">
                  <Phone className="w-6 h-6 text-[#00838f] mr-2" />
                  Quick Contacts
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {Array.isArray(contacts)&&contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-gradient-to-r from-[#1a237e]/10 to-[#00838f]/10 p-4 rounded-xl hover:from-[#1a237e]/20 hover:to-[#00838f]/20 transition-colors duration-300"
                    >
                      <p className="text-sm text-[#00838f] mb-1">
                        {contact.title}
                      </p>
                      <p className="text-lg font-medium text-[#1a237e]">
                        {contact.phoneNumber}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-[#1a237e] mb-6">
                  Connect With Us
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {Array.isArray(socialMedia)&&socialMedia.map((platform) => (
                    <a
                      key={platform.id}
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gradient-to-r from-[#1a237e]/10 to-[#00838f]/10 rounded-xl hover:from-[#1a237e]/20 hover:to-[#00838f]/20 transition-all duration-300 group"
                    >
                      <img
                        src={`${BASE_URL}/uploads/${platform.logo}`}
                        alt={platform.name}
                        className="w-6 h-6 mr-3"
                      />
                      <span className="text-gray-700 group-hover:text-[#1a237e]">
                        {platform.platformName}
                      </span>
                      <ExternalLink className="w-4 h-4 ml-2 text-[#00838f] group-hover:text-[#1a237e]" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-7">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-[#1a237e] mb-6 flex items-center">
                  <MessageSquare className="w-6 h-6 text-[#00838f] mr-2" />
                  Send us a Message
                </h2>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
