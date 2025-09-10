import { format, addDays, isWeekend, isBefore, startOfDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { TimeSlot } from '../types';

export function formatDate(date: Date): string {
  return format(date, "MMMM dd", { locale: enUS });
}

export function formatDateTime(date: Date, time: string): string {
  return format(date, "MM/dd/yyyy", { locale: enUS }) + ` at ${time}`;
}

export function generateTimeSlots(
  startHour: string,
  endHour: string,
  interval: number,
  lunchStart: string,
  lunchEnd: string,
  bookedSlots: string[] = [],
  blockedSlots: string[] = []
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startH, startM] = startHour.split(':').map(Number);
  const [endH, endM] = endHour.split(':').map(Number);
  const [lunchStartH, lunchStartM] = lunchStart.split(':').map(Number);
  const [lunchEndH, lunchEndM] = lunchEnd.split(':').map(Number);
  
  let currentHour = startH;
  let currentMinute = startM;
  
  while (currentHour < endH || (currentHour === endH && currentMinute < endM)) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Check if time is during lunch break
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    const lunchStartMinutes = lunchStartH * 60 + lunchStartM;
    const lunchEndMinutes = lunchEndH * 60 + lunchEndM;
    const isLunchTime = currentTimeMinutes >= lunchStartMinutes && currentTimeMinutes < lunchEndMinutes;
    
    slots.push({
      time: timeString,
      available: !bookedSlots.includes(timeString) && !blockedSlots.includes(timeString) && !isLunchTime
    });
    
    currentMinute += interval;
    if (currentMinute >= 60) {
      currentHour += 1;
      currentMinute -= 60;
    }
  }
  
  return slots;
}

export function getAvailableDates(workingDays: number[], daysAhead: number = 30): Date[] {
  const dates: Date[] = [];
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1); // Start from tomorrow
  
  for (let i = 1; i <= daysAhead; i++) { // Start from day 1 (tomorrow)
    const date = addDays(today, i);
    const dayOfWeek = date.getDay();
    
    if (workingDays.includes(dayOfWeek)) {
      dates.push(date);
    }
  }
  
  return dates;
}