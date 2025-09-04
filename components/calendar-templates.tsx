"use client";

import { type CalendarMonth } from "@/lib/calendar-utils";
import Image from "next/image";

interface CalendarTemplateProps {
  month: CalendarMonth;
  year: number;
}

export function CalendarTemplate({ month, year }: CalendarTemplateProps) {
  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center z-50"
      style={{
        backgroundImage: "url('/calendar.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      <div className="absolute top-0 aspect-square left-[54%] z-10 text-center ">
        <Image
          alt="month image"
          src={month.image || "/placeholder-month.png"}
          width={800}
          height={500}
          className="rounded-lg shadow-lg mb-2 abject-cover h-[120%] w-[140%] aspect-square mx-auto"
        />
      </div>
      {/* DATE CELLS OVERLAY */}
      <div
        className="absolute grid grid-cols-7 gap-0"
        style={{
          top: "49.3%", // adjust to align with template’s first row
          left: "11%", // adjust margin to fit inside grid
          width: "53.8%", // grid width across template
          height: "55%", // grid height (rows of dates)
        }}
      >
        {month.dates.map((date, i) => (
          <div
            key={i}
            className={`p-1 text-sm sm:text-base text-gray-900 relative`}
          >
            {/* Day number (only if in current month) */}
            {date.isCurrentMonth && <div className="font-bold">{date.day}</div>}

            {/* Events under the day number */}
            <div className="space-y-0.5 -ml-16 -mt-2 max-w-20 absolute">
              {date.isCurrentMonth &&
                date.events.slice(0, 2).map((event, idx) => (
                  <p
                    key={event.id + idx}
                    className="text-[8px]  sm:text-xs text-red-600 truncate"
                  >
                    {event.title}
                  </p>
                ))}
              {date.isCurrentMonth && date.events.length > 2 && (
                <p className="text-[10px] text-gray-500">
                  +{date.events.length - 2}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
