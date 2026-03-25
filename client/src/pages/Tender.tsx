//@ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Calendar,
  MapPin,
  Building2,
  IndianRupee,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useClientTenderStore from "@/store/tenderStore";
import useAuthStore from "@/store/authStore";
import { Input } from "@/components/ui/input";

const TenderList = () => {
  const {
    tenders,
    loading,
    filters,
    sectors,
    locations,
    fetchTenders,
    setFilters,
    fetchSectors,
    fetchLocations,
    toggleBookmark,
    isBookmarked,
  } = useClientTenderStore();

  const { user } = useAuthStore();

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState<boolean>(false);
  const [tenderView, setTenderView] = useState<"myTenders" | "all">("myTenders");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchSectors();
    fetchLocations();
  }, [fetchSectors, fetchLocations]);

  // Set default filters based on user's sector and location when component mounts
  useEffect(() => {
    if (user) {
      // Set default filters based on user's preferences
      const initialFilters: Record<string, any> = {
        sectorId: user.sectorId // Filter by user's sector by default
      };

      // Add location filters if available
      if (user.state) {
        initialFilters.state = user.state;
        setSelectedState(user.state);
      }

      if (user.city) {
        initialFilters.city = user.city;
        setSelectedCity(user.city);
      }

      // Apply the filters
      setFilters(initialFilters);
    } else {
      // If no user, just fetch all tenders
      fetchTenders();
    }
  }, [user, setFilters, fetchTenders]);

  // When view changes between "myTenders" and "all"
  useEffect(() => {
    if (tenderView === "myTenders" && user) {
      // Apply user's sector preference
      setFilters({
        sectorId: user.sectorId,
        state: user.state || selectedState,
        district: selectedDistrict,
        city: user.city || selectedCity
      });
    } else if (tenderView === "all") {
      // Clear sector-specific filter for "all" view
      setFilters({
        sectorId: undefined,
        // Keep location filters
        state: selectedState || undefined,
        district: selectedDistrict || undefined,
        city: selectedCity || undefined
      });
    }
  }, [tenderView, user, setFilters, selectedState, selectedDistrict, selectedCity]);

  // Get unique states, districts, and cities - filter out empty strings
  const states = Array.isArray(locations)
    ? [...new Set(locations.map((loc) => loc?.state).filter(Boolean))]
    : [];

  const districts = Array.isArray(locations)
    ? [
      ...new Set(
        locations
          .filter(
            (loc) =>
              !selectedState || loc?.state === selectedState
          )
          .map((loc) => loc?.district)
          .filter(Boolean)
      ),
    ]
    : [];

    const cities = Array.isArray(locations)
    ? [
        ...new Set(
          locations
            .filter(
              (loc) =>
                (!selectedState || loc?.state === selectedState) &&
                (!selectedDistrict || loc?.district === selectedDistrict)
            )
            .map((loc) => loc?.city)
            .filter(Boolean)
        ),
      ]
    : [];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters({ searchQuery: value });
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedDistrict("");
    setSelectedCity("");
    setFilters({ state: value, district: undefined, city: undefined });
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedCity("");
    setFilters({ district: value, city: undefined });
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setFilters({ city: value });
  };

  const handleSectorChange = (value: string) => {
    setFilters({ sectorId: parseInt(value) });
  };

  const handleViewChange = (view: "myTenders" | "all") => {
    setTenderView(view);
    setIsDropdownOpen(false);
  };

  const formatValue = (value?: number) => {
    if (value === undefined) return null;
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value}`;
  };

  // Filter tenders if showing bookmarked only
  const displayedTenders = showBookmarkedOnly
    ? tenders.filter((tender) => isBookmarked(tender.id))
    : tenders;

  // Handle the toggle of the dropdown menu with stopPropagation
  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-red-100 text-red-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a237e]/5 to-[#00838f]/5 py-20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#1a237e]">
                {tenderView === "myTenders" ? "My Tenders" : "All Tenders"}
              </h1>
              <p className="mt-2 text-gray-600">
                {tenderView === "myTenders"
                  ? `Showing tenders in ${user?.sector?.name || "your sector"} sector${user?.annualTurnover ? ` within your turnover: ${formatValue(user.annualTurnover)}` : ''}`
                  : "Browse all available tenders"}
              </p>
            </div>

            {/* View selector */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleToggleDropdown}
              >
                {tenderView === "myTenders" ? "My Tenders" : "All Tenders"}
                <ChevronDown className="h-4 w-4" />
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      className={`${tenderView === "myTenders" ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                      onClick={() => handleViewChange("myTenders")}
                    >
                      My Tenders
                    </button>
                    <button
                      className={`${tenderView === "all" ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                      onClick={() => handleViewChange("all")}
                    >
                      All Tenders
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="Search tenders..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Sector Filter */}
              <Select
                value={filters.sectorId?.toString()}
                onValueChange={handleSectorChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(sectors) && sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id.toString()}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* State Filter */}
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* District Filter */}
              <Select
                value={selectedDistrict}
                onValueChange={handleDistrictChange}
                disabled={!selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* City Filter */}
              <Select
                value={selectedCity}
                onValueChange={handleCityChange}
                disabled={!selectedDistrict && !user?.city}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bookmarked toggle */}
            <div className="mt-4 flex items-center">
              <Button
                variant={showBookmarkedOnly ? "default" : "outline"}
                className={`flex items-center gap-2 ${showBookmarkedOnly ? "bg-[#1a237e]" : ""}`}
                onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              >
                <Bookmark className="h-4 w-4" />
                {showBookmarkedOnly
                  ? "Showing Bookmarked"
                  : "Show Bookmarked Only"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Filters */}
        {Object.keys(filters).some(key => filters[key as keyof typeof filters] !== undefined) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(filters).map(
              ([key, value]) =>
                value !== undefined && (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="px-3 py-1 cursor-pointer"
                    onClick={() => setFilters({ [key]: undefined })}
                  >
                    {key === "sectorId"
                      ? `Sector: ${sectors.find(s => s.id === value)?.name || value}`
                      : key === "searchQuery"
                        ? `Search: "${value}"`
                        : `${key}: ${value}`}
                    <span className="ml-2">×</span>
                  </Badge>
                ),
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setFilters({
                sectorId: tenderView === "myTenders" ? user?.sectorId : undefined,
                state: undefined,
                district: undefined,
                city: undefined,
                searchQuery: undefined,
                maxValue: undefined
              })}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Tenders List */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00838f] mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(displayedTenders)&&displayedTenders.length > 0 ? (
              displayedTenders.map((tender) => (
                <Card
                  key={tender.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      {/* Left Section - Tender Info */}
                      <div className="md:w-2/3 space-y-3">
                        <div className="flex justify-between items-start">
                          {(tender.tenderNo || tender.tenderID) && (
                            <Badge variant="outline" className="text-xs">
                              ID: {tender.tenderNo || tender.tenderID}
                            </Badge>
                          )}
                          <div className="md:hidden">
                            {tender.status && (
                              <Badge
                                variant="default"
                                className={getStatusColor(tender.status)}
                              >
                                {tender.status}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Link to={`/tenders/${tender.id}`}>
                          <h3 className="text-lg font-semibold text-[#1a237e] hover:text-[#00838f] transition-colors">
                            {tender.title}
                          </h3>
                        </Link>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {tender.sector && tender.sector.name && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Building2 className="h-4 w-4 mr-2 text-[#00838f]" />
                              {tender.sector.name}
                            </div>
                          )}

                          {tender.location && (tender.location.city || tender.location.state) && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-[#00838f]" />
                              {tender.location.city && `${tender.location.city}, `}
                              {tender.location.state}
                            </div>
                          )}

                          {tender.lastDateOfSubmission && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-[#00838f]" />
                              Due: {new Date(tender.lastDateOfSubmission).toLocaleDateString()}
                            </div>
                          )}

                          {tender.value !== undefined && (
                            <div className="flex items-center text-sm font-medium text-[#00838f]">
                              <IndianRupee className="h-4 w-4 mr-2" />
                              Value: {formatValue(tender.value)}
                            </div>
                          )}
                        </div>

                        {tender.tenderBrief && (
                          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                            {tender.tenderBrief}
                          </p>
                        )}
                      </div>

                      {/* Right Section - Actions */}
                      <div className="md:w-1/3 md:pl-6 flex flex-col justify-between mt-4 md:mt-0">
                        <div className="flex justify-between md:justify-end items-start">
                          {tender.status && (
                            <Badge
                              variant="default"
                              className={`hidden md:inline-flex ${getStatusColor(tender.status)}`}
                            >
                              {tender.status}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBookmark(tender.id);
                            }}
                          >
                            <Bookmark
                              className={`h-5 w-5 ${isBookmarked(tender.id) ? "fill-[#1a237e] text-[#1a237e]" : "text-gray-400"}`}
                            />
                          </Button>
                        </div>

                        <div className="mt-4 md:mt-auto">
                          <Link to={`/tenders/${tender.id}`} className="w-full">
                            <Button className="w-full bg-gradient-to-r from-[#1a237e] to-[#00838f] hover:opacity-90 text-white">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="text-gray-500">
                  No tenders found matching your criteria
                </div>
                {Object.keys(filters).some(key => filters[key as keyof typeof filters] !== undefined) && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setFilters({
                      sectorId: tenderView === "myTenders" ? user?.sectorId : undefined,
                      state: undefined,
                      district: undefined,
                      city: undefined,
                      searchQuery: undefined
                    })}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenderList;
