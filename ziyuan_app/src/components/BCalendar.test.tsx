vi.mock("./CalendarConst", () => ({
    bookingTemplates: [
      { id: "math", label: "Math Class", defaultColor: "#facc15", tutors: ["Mr. Smith"] },
    ],
    timeSlots: ["07:00", "08:00", "09:00"],
    maxSlots: 2,
  }));
  


import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BCalendar from "./BCalendar";
import { vi } from "vitest";


vi.mock("react-confetti", () => ({
    default: () => <div data-testid="mock-confetti" />,
  }));
  

vi.mock("@fullcalendar/react", () => ({
  __esModule: true,
  default: ({ select }: any) => (
    <div>
      <button onClick={() => select({ start: new Date(), view: { calendar: { unselect: vi.fn(), addEvent: vi.fn() } } })}>
        Simulate Date Click
      </button>
    </div>
  ),
}));


beforeEach(() => {
  const store: Record<string, string> = {};

  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      for (const key in store) delete store[key];
    }),
  });
});

describe("BCalendar component", () => {
    it("renders basic UI elements", () => {
      render(<BCalendar />);
      expect(screen.getByText("Scheduled Classes")).toBeInTheDocument();
      expect(screen.getByText("Requests")).toBeInTheDocument();
    });
  
    it("opens scheduling dialog when date is clicked", async () => {
      render(<BCalendar />);
      fireEvent.click(screen.getByText("Simulate Date Click"));
  
      await waitFor(() =>
        expect(screen.getByText("Schedule a Class")).toBeInTheDocument()
      );
      expect(screen.getByLabelText("Select Class Template")).toBeInTheDocument();
    });
  
    it("shows success UI when event is scheduled", async () => {
      render(<BCalendar />);
      fireEvent.click(screen.getByText("Simulate Date Click"));
  
      await waitFor(() =>
        expect(screen.getByText("Schedule a Class")).toBeInTheDocument()
      );
  
      fireEvent.change(screen.getByLabelText("Select Class Template"), {
        target: { value: "math" }, // Adjust to a real template ID
      });
  
      fireEvent.change(screen.getByLabelText("Select Tutor"), {
        target: { value: "Mr. Smith" }, // Adjust to a real tutor
      });
  
      fireEvent.click(screen.getByRole("button", { name: /Schedule/i }));
  
      await waitFor(() =>
        expect(
          screen.getByText("🎉 Class Scheduled Successfully!")
        ).toBeInTheDocument()
      );
    });
  });
  