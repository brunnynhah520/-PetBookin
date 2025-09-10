import { format, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from 'date-fns';

export interface DashboardKPIs {
  dailyRevenue: number;
  monthlyRevenue: number;
  todaysOrders: number;
  activeCustomers: number;
}

export interface HourlyRevenueData {
  labels: string[];
  data: number[];
}

export interface MonthlyRevenueData {
  labels: string[];
  data: number[];
}

// Generate realistic hourly revenue data (24 hours)
export function generateHourlyRevenueData(): HourlyRevenueData {
  const hours = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );
  
  const data = hours.map((_, index) => {
    // Business hours: 8 AM to 6 PM have higher revenue
    const isBusinessHours = index >= 8 && index <= 18;
    const isPeakHours = index >= 10 && index <= 16; // Peak hours
    
    let baseRevenue = 0;
    if (isBusinessHours) {
      baseRevenue = isPeakHours ? 150 : 80;
    } else {
      baseRevenue = 10; // Very low revenue outside business hours
    }
    
    // Add some randomness
    const randomFactor = 0.3 + Math.random() * 0.7; // 30% to 100% of base
    return Math.round(baseRevenue * randomFactor);
  });
  
  return { labels: hours, data };
}

// Generate monthly revenue data (current month)
export function generateMonthlyRevenueData(): MonthlyRevenueData {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const labels = daysInMonth.map(day => format(day, 'dd'));
  const data = daysInMonth.map((day, index) => {
    // Don't show future days
    if (day > today) return 0;
    
    // Weekend typically has lower revenue
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const baseRevenue = isWeekend ? 800 : 1200;
    
    // Add growth trend throughout the month
    const growthFactor = 1 + (index / daysInMonth.length) * 0.2;
    
    // Add randomness
    const randomFactor = 0.7 + Math.random() * 0.6; // 70% to 130% of base
    
    return Math.round(baseRevenue * growthFactor * randomFactor);
  });
  
  return { labels, data };
}

// Generate dashboard KPIs
export function generateDashboardKPIs(): DashboardKPIs {
  const hourlyData = generateHourlyRevenueData();
  const monthlyData = generateMonthlyRevenueData();
  
  // Calculate daily revenue (sum of hourly data)
  const dailyRevenue = hourlyData.data.reduce((sum, value) => sum + value, 0);
  
  // Calculate monthly revenue (sum of monthly data, excluding future days)
  const monthlyRevenue = monthlyData.data.reduce((sum, value) => sum + value, 0);
  
  // Generate realistic orders and customers
  const todaysOrders = Math.floor(dailyRevenue / 45) + Math.floor(Math.random() * 5); // Average $45 per order
  const activeCustomers = Math.floor(monthlyRevenue / 120) + Math.floor(Math.random() * 20); // Average $120 per customer per month
  
  return {
    dailyRevenue,
    monthlyRevenue,
    todaysOrders,
    activeCustomers
  };
}

// Simulate real-time updates with slight variations
export function updateKPIsWithVariation(currentKPIs: DashboardKPIs): DashboardKPIs {
  return {
    dailyRevenue: Math.max(0, currentKPIs.dailyRevenue + Math.floor((Math.random() - 0.5) * 100)),
    monthlyRevenue: Math.max(0, currentKPIs.monthlyRevenue + Math.floor((Math.random() - 0.5) * 200)),
    todaysOrders: Math.max(0, currentKPIs.todaysOrders + Math.floor((Math.random() - 0.5) * 3)),
    activeCustomers: Math.max(0, currentKPIs.activeCustomers + Math.floor((Math.random() - 0.5) * 5))
  };
}