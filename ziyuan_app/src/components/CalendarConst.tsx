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
    tutors?: string[];
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
      tutors: ["Mr. Tan", "Ms. Lim", "Dr. Lee"],
    },
    {
      id: "tuition-class-2",
      label: "Physics Tuition – Class",
      defaultColor: "bg-green-500",
      fields: [{ name: "studentName", label: "Student Name", type: "text" }],
      tutors: ["Mr. Koh", "Ms. Ong"],
    },
    {
      id: "tuition-class-3",
      label: "Chemistry Tuition – Class",
      defaultColor: "bg-purple-500",
      fields: [{ name: "studentName", label: "Student Name", type: "text" }],
      tutors: ["Ms. Chua", "Mr. Ng"],
    },
  ];
  
  export const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 7; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };
  
  export const timeSlots = generateTimeSlots();
  
  export const maxSlots = 3;
  