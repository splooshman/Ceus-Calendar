export interface FieldSpec {
    name: string;
    label: string;
    type: string;
  }
  
  export interface BookingTemplate {
    id: string;
    label: string;
    defaultColor: string;
    icon?: string;
    fields: FieldSpec[];
    statusPreset?: {
      pending: string;
      approved: string;
      rejected: string;
      cancelled: string;
    };
    recurrence?: {
      allowed: boolean;
      defaultFreq?: "DAILY" | "WEEKLY" | "MONTHLY";
    };
  }
  
  export const bookingTemplates: BookingTemplate[] = [
    {
      id: "tuition-class-1",
      label: "Math Tuition – Class",
      defaultColor: "bg-sky-500",
      fields: [{ name: "studentName", label: "Student Name", type: "text" }],
    },
    {
      id: "tuition-class-2",
      label: "Physics Tuition – Class",
      defaultColor: "bg-green-500",
      fields: [{ name: "studentName", label: "Student Name", type: "text" }],
    },
    {
      id: "tuition-class-3",
      label: "Chemistry Tuition – Class",
      defaultColor: "bg-purple-500",
      fields: [{ name: "studentName", label: "Student Name", type: "text" }],
    },
  ];
  
  // Generate timeslots every 30 min from 7am to 9pm
  export const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 7; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };
  
  export const timeSlots = generateTimeSlots();
  
  export const maxSlots = 6;