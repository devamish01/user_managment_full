import { useEffect, useState } from "react";
import { X, Calendar, MapPin, Users, Tag } from "lucide-react";
import { SharedModal } from "@/shared/components/SharedModal";
import { SharedInput } from "@/shared/components/SharedInput";
import { SharedSelect } from "@/shared/components/SharedSelect";
import { SharedTextarea } from "@/shared/components/SharedTextarea";
import { SharedButton } from "@/shared/components/SharedButton";
import type { Event, EventFormData, EventStatus, EventCategory } from "../../types";

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
  loading: boolean;
  initialData?: Event | null;
  mode: "create" | "edit";
}

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const categoryOptions = [
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
  { value: "webinar", label: "Webinar" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
];

export function EventFormModal({ isOpen, onClose, onSubmit, loading, initialData, mode }: EventFormModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    category: "conference",
    status: "draft",
    startDate: "",
    endDate: "",
    location: "",
    capacity: 0,
    isPublic: true,
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        category: initialData.category,
        status: initialData.status,
        startDate: initialData.startDate.split("T")[0],
        endDate: initialData.endDate.split("T")[0],
        location: initialData.location || "",
        capacity: initialData.capacity,
        isPublic: initialData.isPublic,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: "conference",
        status: "draft",
        startDate: "",
        endDate: "",
        location: "",
        capacity: 0,
        isPublic: true,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<EventFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date must be after start date";
    }
    if (formData.capacity < 1) newErrors.capacity = "Capacity must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleChange = (field: keyof EventFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create Event" : "Edit Event"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <SharedInput
                placeholder="Enter event name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errors.name}
                className="pl-10"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <SharedTextarea
              placeholder="Enter event description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <SharedSelect
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value as EventCategory)}
              options={categoryOptions}
              error={errors.category}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <SharedSelect
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value as EventStatus)}
              options={statusOptions}
              error={errors.status}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <SharedInput
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => handleChange("isPublic", e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              Public Event
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <SharedButton type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </SharedButton>
          <SharedButton type="submit" loading={loading}>
            {mode === "create" ? "Create Event" : "Save Changes"}
          </SharedButton>
        </div>
      </form>
    </SharedModal>
  );
}