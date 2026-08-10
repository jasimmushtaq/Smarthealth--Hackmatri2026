import { format } from "date-fns";

export function isAvailableToday(
  slots: { day_of_week: number; is_active: boolean }[],
  leaves: { start_date: string; end_date: string }[],
  status: string
): boolean {
  if (status !== "available") return false;
  const today = new Date();
  const dayOfWeek = today.getDay();
  const todayStr = format(today, "yyyy-MM-dd");
  
  const onLeave = leaves.some(
    (l) => todayStr >= l.start_date && todayStr <= l.end_date
  );
  if (onLeave) return false;

  return slots.some((s) => s.day_of_week === dayOfWeek && s.is_active);
}

export function isAvailableNow(
  slots: { day_of_week: number; start_time: string; end_time: string; is_active: boolean }[],
  leaves: { start_date: string; end_date: string }[],
  status: string
): boolean {
  if (status !== "available") return false;
  const now = new Date();
  const dayOfWeek = now.getDay();
  const todayStr = format(now, "yyyy-MM-dd");

  const onLeave = leaves.some(
    (l) => todayStr >= l.start_date && todayStr <= l.end_date
  );
  if (onLeave) return false;

  const currentTime = format(now, "HH:mm:ss");
  return slots.some(
    (s) =>
      s.day_of_week === dayOfWeek &&
      s.is_active &&
      currentTime >= s.start_time &&
      currentTime <= s.end_time
  );
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}
