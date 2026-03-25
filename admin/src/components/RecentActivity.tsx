import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentActivityProps {
  activities: {
    name: string;
    action: string;
    time: string;
    avatar: string;
  }[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.avatar} alt="Avatar" />
            <AvatarFallback>{activity.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none text-blue-900">
              {activity.name}
            </p>
            <p className="text-sm text-blue-600">{activity.action}</p>
          </div>
          <div className="ml-auto font-medium text-blue-800">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  );
}
