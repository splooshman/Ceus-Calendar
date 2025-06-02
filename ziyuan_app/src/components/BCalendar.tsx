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
import rrulePlugin from "@fullcalendar/rrule";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import {
  bookingTemplates,
  timeSlots,
  maxSlots,
} from "./CalendarConst";

import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const BCalendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("07:00");
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [selectedTutor, setSelectedTutor] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const { width, height } = useWindowSize();

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
    setSelectedTutor("");
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
    setSelectedTutor("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId || !selectedTutor) {
      alert("Please select a class template and a tutor.");
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

      const isRecurring = window.confirm("Make this a recurring weekly event?");
      const weekdayMap = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
      const byweekday = weekdayMap[startDate.getDay()];
      const selectedTemplate = bookingTemplates.find(
        (t) => t.id === selectedTemplateId
      )!;

      const newEvent = isRecurring
        ? {
            id: `${startDate.toISOString()}-${selectedTemplate.id}-${selectedTutor}`,
            title: `${selectedTemplate.label} - ${selectedTutor}`,
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
            id: `${startDate.toISOString()}-${selectedTemplate.id}-${selectedTutor}`,
            title: `${selectedTemplate.label} - ${selectedTutor}`,
            start: startDate,
            end: endDate,
            allDay: false,
            backgroundColor: selectedTemplate.defaultColor,
            borderColor: selectedTemplate.defaultColor,
          };

      calendarApi.addEvent(newEvent);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 7000);
      handleCloseDialog();
    }
  };

  const router = useRouter();

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen relative px-6 py-8">
      {showSuccess && (
        <>
          <Confetti width={width} height={height} recycle={false} />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <img
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODV5azZ4czU0NmNwYTcyODJqdThtbHd0ZjRlMGV2d2s1OWUyY2tkaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dijK6WYRdSoJEikGPS/giphy.gif"
              alt="Success"
              style={{ width: "50vw", height: "auto", borderRadius: 8, marginBottom: "1rem" }}
            />
            <p
              style={{
                color: "#064e03",
                fontWeight: "bold",
                fontSize: "1.5rem",
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "0.5rem 1rem",
                borderRadius: 6,
                maxWidth: "60vw",
              }}
            >
              🎉 Class Scheduled Successfully!
            </p>
          </div>
        </>
      )}

      <div className="flex max-w-screen-xl mx-auto gap-8">
        {/* Sidebar */}
        <div className="flex flex-col w-[20%] h-full gap-6 overflow-y-auto">
          <div className="border border-[var(--border)] rounded-[var(--radius)] shadow-sm bg-[var(--card)]">
            <div className="p-3 text-xl font-semibold text-center bg-[var(--muted)] text-[var(--foreground)] border-b border-[var(--border)]">
              Scheduled Classes
            </div>
            <ul className="p-4 space-y-3 max-h-[35vh] overflow-y-auto">
              {currentEvents.length === 0 ? (
                <div className="italic text-center text-muted-foreground">
                  No Classes Scheduled
                </div>
              ) : (
                currentEvents.map((event) => (
                  <li
                    key={`scheduled-${event.id}`}
                    className="p-3 rounded-[var(--radius)] shadow-sm text-sm text-[var(--primary)]"
                    style={{ backgroundColor: event.backgroundColor || "#e2e8f0" }}
                  >
                    {event.title}
                    <br />
                    <span className="text-[var(--foreground)] text-xs">
                      {formatDate(event.start!, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Empty Requests Box */}
          <div className="border border-[var(--border)] rounded-[var(--radius)] shadow-sm bg-[var(--card)] h-[35vh]">
            <div className="p-3 text-xl font-semibold text-center bg-[var(--muted)] text-[var(--foreground)] border-b border-[var(--border)]">
              Requests
            </div>
            {/* Empty body, no functionality */}
          </div>
        </div>

        {/* Calendar */}
        <div className="w-[75%] mt-2">
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

      {/* Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[var(--card)] text-[var(--foreground)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Schedule a Class</DialogTitle>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleAddEvent}>
            <label className="block font-medium mb-1" htmlFor="templateSelect">
              Select Class Template
            </label>
            <select
              id="templateSelect"
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                setSelectedTutor("");
              }}
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

            {selectedTemplateId && (
              <>
                <label className="block font-medium mt-4 mb-1" htmlFor="tutorSelect">
                  Select Tutor
                </label>
                <select
                  id="tutorSelect"
                  value={selectedTutor}
                  onChange={(e) => setSelectedTutor(e.target.value)}
                  required
                  className="w-full border border-[var(--border)] p-3 rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)]"
                >
                  <option value="" disabled>
                    -- Choose a tutor --
                  </option>
                  {bookingTemplates
                    .find((t) => t.id === selectedTemplateId)
                    ?.tutors?.map((tutor) => (
                      <option key={tutor} value={tutor}>
                        {tutor}
                      </option>
                    ))}
                </select>

                <label className="block font-medium mt-4 mb-1" htmlFor="timeSelect">
                  Select Start Time
                </label>
                <select
                  id="timeSelect"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full border border-[var(--border)] p-3 rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)]"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>

                <label className="block font-medium mt-4 mb-1" htmlFor="durationSelect">
                  Duration (minutes)
                </label>
                <select
                  id="durationSelect"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  className="w-full border border-[var(--border)] p-3 rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)]"
                >
                  {[30, 60, 90, 120].map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </>
            )}

            <div className="flex justify-end mt-6 gap-4">
              <button
                type="button"
                onClick={handleCloseDialog}
                className="px-6 py-2 border border-[var(--border)] rounded-[var(--radius)] hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[var(--primary)] text-[var(--background)] px-6 py-2 rounded-[var(--radius)] hover:bg-[#1e40af] disabled:opacity-50"
              >
                Schedule
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BCalendar;
