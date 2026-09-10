import { Calendar, Users, CheckCircle, XCircle } from "lucide-react";
import type { Event } from "../../types";

interface EventStatsBarProps {
  events: Event[];
}

const statCards = [
  { label: "Total Events", icon: Calendar, color: "bg-blue-50 text-blue-600", iconColor: "text-blue-600" },
  { label: "Published", icon: CheckCircle, color: "bg-green-50 text-green-600", iconColor: "text-green-600" },
  { label: "Draft", icon: Calendar, color: "bg-yellow-50 text-yellow-600", iconColor: "text-yellow-600" },
  { label: "Cancelled", icon: XCircle, color: "bg-red-50 text-red-600", iconColor: "text-red-600" },
];

export function EventStatsBar({ events }: EventStatsBarProps) {
  const stats = [
    events.length,
    events.filter(e => e.status === "published").length,
    events.filter(e => e.status === "draft").length,
    events.filter(e => e.status === "cancelled").length,
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats[index]}</p>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}