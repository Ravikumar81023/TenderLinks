import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useHerostore } from "@/store/herosection";

const HeroSection = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { fetchimages, images } = useHerostore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        await fetchimages();
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadImages();
  }, [fetchimages]);

  const nextSlide = () => {
    if (!images?.length) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setProgress(0);
  };

  const prevSlide = () => {
    if (!images?.length) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
    setProgress(0);
  };

  useEffect(() => {
    if (isLoading || !images?.length) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 0.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isLoading, images, nextSlide]); // Added nextSlide to dependencies

  if (isLoading) {
    return (
      <div className="min-h-[600px] mt-16 flex items-center justify-center bg-gray-50">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[600px] mt-16 flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-xl">Error loading images: {error}</p>
      </div>
    );
  }

  if (!images?.length) {
    return (
      <div className="min-h-[600px] mt-16 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-xl">No images available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1a237e]/5 to-white mt-4 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="relative w-full aspect-[20/10] overflow-hidden rounded-3xl shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.5, ease: [0.4, 0, 1, 1] },
              }}
              className="relative w-full h-full"
            >
              <img
                src={`${BASE_URL}${images[currentIndex].imageUrl}`}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 border-[12px] border-gradient-to-r from-[#1a237e] to-[#00838f] rounded-3xl pointer-events-none" />

          <div className="absolute bottom-0 left-0 w-full h-1">
            <motion.div
              className="h-full bg-blue-600"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 
              bg-white/10 hover:bg-white/20
              rounded-full p-2 transition-all duration-300
              border border-white/20 hover:border-white/40"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 
              bg-white/10 hover:bg-white/20
              rounded-full p-2 transition-all duration-300
              border border-white/20 hover:border-white/40"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {Array.isArray(images)&&images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setProgress(0);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-6"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
