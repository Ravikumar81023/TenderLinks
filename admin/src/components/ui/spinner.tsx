import React from "react";

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 24, className }) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-blue-600 border-t-transparent ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default Spinner;
