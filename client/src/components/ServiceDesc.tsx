import { useServiceStore } from "@/store/service";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ServiceDesc = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { serviceid } = useParams();
  const { fetchServiceById, selectedService } = useServiceStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceById(Number(serviceid));
  }, [serviceid, fetchServiceById]);

  if (!selectedService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1a237e] to-[#00838f]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1a237e]/5 to-[#00838f]/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto py-16">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="flex items-center text-[#1a237e] hover:text-[#00838f] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Services
        </Button>

        <Card className="overflow-hidden bg-white shadow-xl rounded-2xl">
          <div className="relative h-[400px] w-full">
            {selectedService.image && (
              <img
                src={`${BASE_URL}${selectedService.image}`}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <CardContent className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-4">
              {selectedService.title}
            </h1>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1 text-[#00838f]" />
                <span>TenderLink Team</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-[#00838f]" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-[#00838f]" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            {selectedService.video && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#1a237e] mb-4">
                  Service Video
                </h2>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <video
                    src={selectedService.video}
                    controls
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceDesc;
