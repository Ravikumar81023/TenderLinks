import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  prefix?: string;
}

export function StatsCard({
  icon: Icon,
  title,
  value,
  prefix,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
