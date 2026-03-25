import Spinner from "@/components/ui/spinner";

const BlueLoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner size={40} className="text-blue-600 animate-spin" />
    </div>
  );
};

export default BlueLoadingSpinner;
