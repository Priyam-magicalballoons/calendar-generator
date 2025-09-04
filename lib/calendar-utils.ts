export interface CalendarDate {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: CalendarEvent[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: "holiday" | "birthday" | "anniversary" | "personal";
  date: Date;
  recurring?: boolean;
  category?: string;
  description?: string;
  color?: string;
  enabled?: boolean;
}

export interface CalendarMonth {
  month: number;
  year: number;
  monthName: string;
  dates: CalendarDate[];
  image?: string;
}

export interface HolidayCategory {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const HOLIDAY_CATEGORIES: HolidayCategory[] = [
  {
    id: "indian-national",
    name: "Indian National Holidays",
    description: "Official Indian government holidays",
    enabled: true,
  },
  {
    id: "indian-cultural",
    name: "Indian Cultural Festivals",
    description: "Popular Indian cultural celebrations",
    enabled: true,
  },
  {
    id: "hindu-festivals",
    name: "Hindu Festivals",
    description: "Major Hindu religious festivals",
    enabled: true,
  },
  {
    id: "islamic-festivals",
    name: "Islamic Festivals",
    description: "Major Islamic festivals",
    enabled: false,
  },
  {
    id: "christian-festivals",
    name: "Christian Festivals",
    description: "Major Christian celebrations",
    enabled: false,
  },
  {
    id: "sikh-festivals",
    name: "Sikh Festivals",
    description: "Major Sikh celebrations",
    enabled: false,
  },
  {
    id: "buddhist-festivals",
    name: "Buddhist Festivals",
    description: "Major Buddhist celebrations",
    enabled: false,
  },
  {
    id: "international",
    name: "International Days",
    description: "UN and international observances",
    enabled: false,
  },
];

// Helper function to get nth weekday of month
function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  n: number
): Date {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const offset = (weekday - firstWeekday + 7) % 7;
  const date = 1 + offset + (n - 1) * 7;
  return new Date(year, month, date);
}

// Helper function to get last weekday of month
function getLastWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number
): Date {
  const lastDay = new Date(year, month + 1, 0);
  const lastWeekday = lastDay.getDay();
  const offset = (lastWeekday - weekday + 7) % 7;
  const date = lastDay.getDate() - offset;
  return new Date(year, month, date);
}

function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function getAllHolidays(year: number): CalendarEvent[] {
  const holidays: CalendarEvent[] = [];

  // Indian National Holidays
  holidays.push(
    {
      id: "republic-day",
      title: "Republic Day",
      type: "holiday",
      category: "indian-national",
      date: new Date(year, 0, 26),
      recurring: true,
      color: "#ff6b35",
      description: "Celebrates the adoption of the Indian Constitution",
    },
    {
      id: "independence-day",
      title: "Independence Day",
      type: "holiday",
      category: "indian-national",
      date: new Date(year, 7, 15),
      recurring: true,
      color: "#ff6b35",
      description: "Celebrates India's independence from British rule",
    },
    {
      id: "gandhi-jayanti",
      title: "Gandhi Jayanti",
      type: "holiday",
      category: "indian-national",
      date: new Date(year, 9, 2),
      recurring: true,
      color: "#ff6b35",
      description: "Birthday of Mahatma Gandhi",
    }
  );

  holidays.push(
    {
      id: "diwali",
      title: "Diwali",
      type: "holiday",
      category: "hindu-festivals",
      date: new Date(year, 9, 24), // Approximate date
      recurring: true,
      color: "#ffd700",
      description: "Festival of Lights",
    },
    {
      id: "holi",
      title: "Holi",
      type: "holiday",
      category: "hindu-festivals",
      date: new Date(year, 2, 13), // Approximate date
      recurring: true,
      color: "#ff69b4",
      description: "Festival of Colors",
    },
    {
      id: "dussehra",
      title: "Dussehra",
      type: "holiday",
      category: "hindu-festivals",
      date: new Date(year, 9, 12), // Approximate date
      recurring: true,
      color: "#ff4500",
      description: "Victory of good over evil",
    },
    {
      id: "navratri",
      title: "Navratri",
      type: "holiday",
      category: "hindu-festivals",
      date: new Date(year, 9, 3), // Approximate date
      recurring: true,
      color: "#ff1493",
      description: "Nine nights festival",
    },
    {
      id: "karva-chauth",
      title: "Karva Chauth",
      type: "holiday",
      category: "hindu-festivals",
      date: new Date(year, 9, 20), // Approximate date
      recurring: true,
      color: "#dc143c",
      description: "Festival for married women",
    },
    {
      id: "raksha-bandhan",
      title: "Raksha Bandhan",
      type: "holiday",
      category: "hindu-festivals",
      date: new Date(year, 7, 19), // Approximate date
      recurring: true,
      color: "#ff6347",
      description: "Festival celebrating brother-sister bond",
    },
    {
      id: "janmashtami",
      title: "Janmashtami",
      type: "holiday",
      category: "hindu-festivals",
      date: new Date(year, 7, 26), // Approximate date
      recurring: true,
      color: "#4169e1",
      description: "Birthday of Lord Krishna",
    },
    {
      id: "ganesh-chaturthi",
      title: "Ganesh Chaturthi",
      type: "holiday",
      category: "hindu-festivals",
      date: new Date(year, 8, 7), // Approximate date
      recurring: true,
      color: "#ff8c00",
      description: "Festival of Lord Ganesha",
    }
  );

  // Indian Cultural Festivals
  holidays.push(
    {
      id: "baisakhi",
      title: "Baisakhi",
      type: "holiday",
      category: "indian-cultural",
      date: new Date(year, 3, 13),
      recurring: true,
      color: "#32cd32",
      description: "Harvest festival and Sikh New Year",
    },
    {
      id: "onam",
      title: "Onam",
      type: "holiday",
      category: "indian-cultural",
      date: new Date(year, 3, 13), // Approximate date
      recurring: true,
      color: "#ffd700",
      description: "Kerala harvest festival",
    },
    {
      id: "pongal",
      title: "Pongal",
      type: "holiday",
      category: "indian-cultural",
      date: new Date(year, 0, 14),
      recurring: true,
      color: "#ff6347",
      description: "Tamil harvest festival",
    },
    {
      id: "durga-puja",
      title: "Durga Puja",
      type: "holiday",
      category: "indian-cultural",
      date: new Date(year, 9, 15), // Approximate date
      recurring: true,
      color: "#dc143c",
      description: "Bengali festival honoring Goddess Durga",
    }
  );

  // Islamic Festivals (approximate dates - these vary by lunar calendar)
  holidays.push(
    {
      id: "eid-ul-fitr",
      title: "Eid ul-Fitr",
      type: "holiday",
      category: "islamic-festivals",
      date: new Date(year, 3, 21), // Approximate date
      recurring: true,
      color: "#00ced1",
      description: "Festival marking end of Ramadan",
    },
    {
      id: "eid-ul-adha",
      title: "Eid ul-Adha",
      type: "holiday",
      category: "islamic-festivals",
      date: new Date(year, 5, 28), // Approximate date
      recurring: true,
      color: "#00ced1",
      description: "Festival of Sacrifice",
    },
    {
      id: "muharram",
      title: "Muharram",
      type: "holiday",
      category: "islamic-festivals",
      date: new Date(year, 7, 17), // Approximate date
      recurring: true,
      color: "#2f4f4f",
      description: "Islamic New Year",
    }
  );

  // Christian Festivals
  const easter = getEasterDate(year);
  holidays.push(
    {
      id: "christmas",
      title: "Christmas Day",
      type: "holiday",
      category: "christian-festivals",
      date: new Date(year, 11, 25),
      recurring: true,
      color: "#dc143c",
      description: "Birth of Jesus Christ",
    },
    {
      id: "easter",
      title: "Easter Sunday",
      type: "holiday",
      category: "christian-festivals",
      date: easter,
      recurring: true,
      color: "#8b5cf6",
      description: "Resurrection of Jesus Christ",
    },
    {
      id: "good-friday",
      title: "Good Friday",
      type: "holiday",
      category: "christian-festivals",
      date: new Date(easter.getTime() - 2 * 24 * 60 * 60 * 1000),
      recurring: true,
      color: "#8b5cf6",
      description: "Crucifixion of Jesus Christ",
    }
  );

  // Sikh Festivals
  holidays.push(
    {
      id: "guru-nanak-jayanti",
      title: "Guru Nanak Jayanti",
      type: "holiday",
      category: "sikh-festivals",
      date: new Date(year, 10, 15), // Approximate date
      recurring: true,
      color: "#ff8c00",
      description: "Birthday of Guru Nanak",
    },
    {
      id: "guru-gobind-singh-jayanti",
      title: "Guru Gobind Singh Jayanti",
      type: "holiday",
      category: "sikh-festivals",
      date: new Date(year, 0, 5),
      recurring: true,
      color: "#ff8c00",
      description: "Birthday of Guru Gobind Singh",
    }
  );

  // Buddhist Festivals
  holidays.push({
    id: "buddha-purnima",
    title: "Buddha Purnima",
    type: "holiday",
    category: "buddhist-festivals",
    date: new Date(year, 4, 16), // Approximate date
    recurring: true,
    color: "#ffd700",
    description: "Birthday of Lord Buddha",
  });

  // International Days
  holidays.push(
    {
      id: "new-year",
      title: "New Year's Day",
      type: "holiday",
      category: "international",
      date: new Date(year, 0, 1),
      recurring: true,
      color: "#dc2626",
      description: "Beginning of the calendar year",
    },
    {
      id: "womens-day",
      title: "International Women's Day",
      type: "holiday",
      category: "international",
      date: new Date(year, 2, 8),
      recurring: true,
      color: "#ec4899",
      description: "Celebrating women's achievements",
    },
    {
      id: "earth-day",
      title: "Earth Day",
      type: "holiday",
      category: "international",
      date: new Date(year, 3, 22),
      recurring: true,
      color: "#059669",
      description: "Environmental awareness day",
    }
  );

  return holidays;
}

export function getPublicHolidays(
  year: number,
  enabledCategories: string[] = ["indian-national", "hindu-festivals"]
): CalendarEvent[] {
  const allHolidays = getAllHolidays(year);

  return allHolidays.filter(
    (holiday) =>
      holiday.category && enabledCategories.includes(holiday.category)
  );
}

export function parsePersonalDates(
  birthdate: string,
  anniversary: string,
  additionalDates: string,
  year: number
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  // Add birthday with age calculation
  if (birthdate) {
    const birth = new Date(birthdate);
    const age = year - birth.getFullYear();
    events.push({
      id: "birthday",
      title: ``,
      type: "birthday",
      date: new Date(year, birth.getMonth(), birth.getDate()),
      recurring: true,
      color: "#3b82f6",
      description: `Born on ${birth.toLocaleDateString()}`,
    });
  }

  // Add anniversary with years calculation
  if (anniversary) {
    const anniv = new Date(anniversary);
    const years = year - anniv.getFullYear();

    events.push({
      id: "anniversary",
      title: ``,
      type: "anniversary",
      date: new Date(year, anniv.getMonth(), anniv.getDate()),
      recurring: true,
      color: "#ec4899",
      description: `Anniversary since ${anniv.toLocaleDateString()}`,
    });
  }

  // Parse additional dates with enhanced format support
  if (additionalDates) {
    const lines = additionalDates.split("\n").filter((line) => line.trim());
    lines.forEach((line, index) => {
      // Support multiple date formats
      const formats = [
        /(\d{4}-\d{2}-\d{2})\s*-\s*(.+)/, // YYYY-MM-DD - Title
        /(\d{2}\/\d{2}\/\d{4})\s*-\s*(.+)/, // MM/DD/YYYY - Title
        /(\d{2}-\d{2})\s*-\s*(.+)/, // MM-DD - Title (recurring yearly)
      ];

      for (const format of formats) {
        const match = line.match(format);
        if (match) {
          const [, dateStr, title] = match;
          let eventDate: Date;

          if (dateStr.includes("/")) {
            // MM/DD/YYYY format
            const [month, day, eventYear] = dateStr.split("/").map(Number);
            eventDate = new Date(year, month - 1, day);
          } else if (dateStr.length === 5) {
            // MM-DD format (recurring yearly)
            const [month, day] = dateStr.split("-").map(Number);
            eventDate = new Date(year, month - 1, day);
          } else {
            // YYYY-MM-DD format
            const date = new Date(dateStr);
            eventDate = new Date(year, date.getMonth(), date.getDate());
          }

          events.push({
            id: `personal-${index}`,
            title: title.trim(),
            type: "personal",
            date: eventDate,
            recurring: true,
            color: "#059669",
          });
          break;
        }
      }
    });
  }

  return events;
}

// Generate calendar month data
export function generateCalendarMonth(
  month: number,
  year: number,
  events: CalendarEvent[] = [],
  image?: string
): CalendarMonth {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Start date is the Sunday before or same as the first day of the month
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const dates: CalendarDate[] = [];
  const today = new Date();

  // Generate 42 days to cover 6 weeks for calendar grid (to cover all days visible)
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    // Find all events that fall on this specific date (day, month, year)
    const dayEvents = events.filter(
      (event) =>
        event.date.getDate() === currentDate.getDate() &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );

    dates.push({
      date: currentDate,
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday:
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear(),
      isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
      events: dayEvents,
    });
  }

  return {
    month,
    year,
    monthName: MONTH_NAMES[month],
    dates,
    image,
  };
}

export function generateYearCalendar(
  year: number,
  personalEvents: CalendarEvent[] = [],
  images: { [month: string]: string } = {},
  enabledHolidayCategories: string[] = ["indian-national", "hindu-festivals"]
): CalendarMonth[] {
  // Get public holidays filtered by enabled categories
  const publicHolidays = getAllHolidays(year);

  // Combine both holiday and personal events into one list
  const allEvents = [...publicHolidays, ...personalEvents];

  return Array.from({ length: 12 }, (_, month) => {
    // Pass all events when generating each month's data
    const monthName = MONTH_NAMES[month];
    const image = images[monthName];

    return generateCalendarMonth(month, year, allEvents, image);
  });
}
