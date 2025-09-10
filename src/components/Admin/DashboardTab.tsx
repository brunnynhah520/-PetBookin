import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { DollarSign, ShoppingBag, Users, TrendingUp, Clock, Calendar } from 'lucide-react';
import {
  generateDashboardKPIs,
  generateHourlyRevenueData,
  generateMonthlyRevenueData,
  updateKPIsWithVariation,
  DashboardKPIs,
  HourlyRevenueData,
  MonthlyRevenueData
} from '../../utils/mockData';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardTab() {
  const [kpis, setKpis] = useState<DashboardKPIs>(generateDashboardKPIs());
  const [hourlyData, setHourlyData] = useState<HourlyRevenueData>(generateHourlyRevenueData());
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenueData>(generateMonthlyRevenueData());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Auto-refresh data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(currentKpis => updateKPIsWithVariation(currentKpis));
      setHourlyData(generateHourlyRevenueData());
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Chart options for hourly revenue
  const hourlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Today\'s Revenue by Hour',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#1e3a8a',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  // Chart options for monthly revenue
  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Monthly Revenue by Day',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#1e3a8a',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  // Chart data for hourly revenue
  const hourlyChartData = {
    labels: hourlyData.labels,
    datasets: [
      {
        data: hourlyData.data,
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(251, 146, 60)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Chart data for monthly revenue
  const monthlyChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        data: monthlyData.data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const kpiCards = [
    {
      title: 'Daily Revenue',
      value: `$${kpis.dailyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Monthly Revenue',
      value: `$${kpis.monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Today\'s Orders',
      value: kpis.todaysOrders.toString(),
      icon: ShoppingBag,
      color: 'from-orange-400 to-orange-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Active Customers',
      value: kpis.activeCustomers.toString(),
      icon: Users,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Business Dashboard</h2>
          <p className="text-gray-600">Real-time revenue and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4 sm:mt-0">
          <Clock className="w-4 h-4" />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="h-80">
            <Line data={hourlyChartData} options={hourlyChartOptions} />
          </div>
        </motion.div>

        {/* Monthly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="h-80">
            <Bar data={monthlyChartData} options={monthlyChartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Business Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Calendar className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Business Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p className="font-medium mb-1">Peak Hours:</p>
                <p>10:00 AM - 4:00 PM (highest revenue)</p>
              </div>
              <div>
                <p className="font-medium mb-1">Average Order Value:</p>
                <p>${kpis.dailyRevenue > 0 ? (kpis.dailyRevenue / Math.max(kpis.todaysOrders, 1)).toFixed(2) : '0.00'}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Customer Lifetime Value:</p>
                <p>${kpis.activeCustomers > 0 ? (kpis.monthlyRevenue / kpis.activeCustomers).toFixed(2) : '0.00'}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Revenue Growth:</p>
                <p className="text-green-600 font-medium">+12.5% vs last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-refresh Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          📊 Dashboard updates automatically every 5 seconds with real-time data
        </p>
      </div>
    </div>
  );
}