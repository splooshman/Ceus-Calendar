"use client";

import React, { useState, useEffect } from "react";
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import rrulePlugin from "@fullcalendar/rrule";


import {
  bookingTemplates,
  timeSlots,
  maxSlots,
  BookingTemplate,
} from "./CalenderConst";

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("07:00");
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setSelectedTemplateId("");
    setSelectedTime("07:00");
    setSelectedDuration(30);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event "${selected.event.title}"?`
      )
    ) {
      selected.event.remove();
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTemplateId("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) {
      alert("Please select a class template.");
      return;
    }
    if (selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const [hours, minutes] = selectedTime.split(":").map(Number);
      const startDate = new Date(
        selectedDate.start.getFullYear(),
        selectedDate.start.getMonth(),
        selectedDate.start.getDate(),
        hours,
        minutes
      );

      const endDate = new Date(startDate.getTime() + selectedDuration * 60000);

      const isRecurring = window.confirm("Make this a recurring weekly event?");

      const overlappingEventsCount = currentEvents.filter((event) => {
        const eventStart = event.start!;
        const eventEnd = event.end || new Date(eventStart.getTime() + 30 * 60000);
        return startDate < eventEnd && endDate > eventStart;
      }).length;

      if (overlappingEventsCount >= maxSlots) {
        alert(
          `This time slot already has ${maxSlots} events scheduled. Please choose another slot.`
        );
        return;
      }

      const weekdayMap = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
      const byweekday = weekdayMap[startDate.getDay()];

      const selectedTemplate = bookingTemplates.find(
        (t) => t.id === selectedTemplateId
      )!;

      const newEvent = isRecurring
        ? {
            id: `${startDate.toISOString()}-${selectedTemplate.id}`,
            title: selectedTemplate.label,
            rrule: {
              freq: "weekly",
              interval: 1,
              dtstart: startDate,
              byweekday: [byweekday],
              count: 4,
            },
            duration: endDate.getTime() - startDate.getTime(),
            backgroundColor: selectedTemplate.defaultColor,
            borderColor: selectedTemplate.defaultColor,
          }
        : {
            id: `${startDate.toISOString()}-${selectedTemplate.id}`,
            title: selectedTemplate.label,
            start: startDate,
            end: endDate,
            allDay: false,
            backgroundColor: selectedTemplate.defaultColor,
            borderColor: selectedTemplate.defaultColor,
          };

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  const router = useRouter();

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <div className="flex w-full px-10 justify-start items-start gap-8 mt-10 max-w-screen-xl mx-auto">
        <div className="w-3/12 border border-[var(--border)] rounded-[var(--radius)] p-6 shadow-sm bg-[var(--card)]">
          <div className="border border-[var(--border)] rounded-[var(--radius)] p-3 text-2xl font-semibold text-center bg-[var(--muted)] text-[var(--foreground)] mb-5">
            Scheduled Classes
          </div>
          <ul className="space-y-4">
            {currentEvents.length <= 0 && (
              <div className="italic text-center text-muted-foreground">
                No Classes Scheduled
              </div>
            )}

            {currentEvents.length > 0 &&
              currentEvents.map((event: EventApi) => (
                <li
                  key={event.id}
                  className={`border px-4 py-2 rounded-[var(--radius)] shadow text-[var(--primary)] ${
                    event.backgroundColor || "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      (event.backgroundColor as string) || undefined,
                  }}
                >
                  {event.title}
                  <br />
                  <label className="text-[var(--foreground)] text-sm">
                    {formatDate(event.start!, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </label>
                </li>
              ))}
          </ul>
        </div>

        <div className="w-9/12 mt-8">
          <FullCalendar
            timeZone="local"
            height="85vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            editable
            selectable
            selectMirror
            dayMaxEvents
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={
              typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("events") || "[]")
                : []
            }
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[var(--card)] text-[var(--foreground)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Schedule a Class
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleAddEvent}>
            <label
              className="block font-medium mb-1"
              htmlFor="templateSelect"
            >
              Select Class Template
            </label>
            <select
              id="templateSelect"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              required
              className="w-full border border-[var(--border)] p-3 rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)]"
            >
              <option value="" disabled>
                -- Choose a class --
              </option>
              {bookingTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </select>

            <label
              className="block font-medium mt-4 mb-1"
              htmlFor="timeSelect"
            >
              Select Start Time
            </label>
            <select
              id="timeSelect"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              className="w-full border border-[var(--border)] p-3 rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)]"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <label
              className="block font-medium mt-4 mb-1"
              htmlFor="durationSelect"
            >
              Duration (minutes)
            </label>
            <select
              id="durationSelect"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(parseInt(e.target.value, 10))}
              required
              className="w-full border border-[var(--border)] p-3 rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)]"
            >
              <option value={30}>30</option>
              <option value={60}>60</option>
              <option value={90}>90</option>
            </select>

            <button
              type="submit"
              className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 mt-4 rounded-[var(--radius)] hover:bg-[var(--accent)] transition"
            >
              Schedule Class
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
