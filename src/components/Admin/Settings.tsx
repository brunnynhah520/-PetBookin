import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAdmin } from '../../context/AdminContext';

interface SettingsFormData {
  startTime: string;
  endTime: string;
  serviceInterval: number;
  workingDays: string[];
}

export default function Settings() {
  const { settings, updateSettings } = useAdmin();
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormData>({
    defaultValues: {
      startTime: settings.workingHours.start,
      endTime: settings.workingHours.end,
      serviceInterval: settings.serviceInterval,
      workingDays: settings.workingDays.map(String),
    }
  });

  const onSubmit = (data: SettingsFormData) => {
    updateSettings({
      workingHours: {
        start: data.startTime,
        end: data.endTime,
      },
      serviceInterval: data.serviceInterval,
      workingDays: data.workingDays.map(Number),
    });
  };

  const weekDays = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">Settings</h2>
        <p className="text-gray-600">Define working hours and general settings</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Working Hours */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900 mb-4">
            <Clock className="w-5 h-5" />
            <span>Working Hours</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opening Time
              </label>
              <input
                {...register('startTime', { required: 'Opening time is required' })}
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closing Time
              </label>
              <input
                {...register('endTime', { required: 'Closing time is required' })}
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Interval (minutes)
            </label>
            <select
              {...register('serviceInterval', { required: 'Interval is required' })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
            {errors.serviceInterval && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceInterval.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lunch Start
              </label>
              <input
                value={settings.lunchBreak.start}
                onChange={(e) => updateSettings({
                  lunchBreak: { ...settings.lunchBreak, start: e.target.value }
                })}
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lunch End
              </label>
              <input
                value={settings.lunchBreak.end}
                onChange={(e) => updateSettings({
                  lunchBreak: { ...settings.lunchBreak, end: e.target.value }
                })}
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Working Days */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900 mb-4">
            <Calendar className="w-5 h-5" />
            <span>Working Days</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekDays.map((day) => (
              <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  {...register('workingDays')}
                  type="checkbox"
                  value={day.value}
                  className="rounded border-gray-300 text-orange-400 focus:ring-orange-400"
                />
                <span className="text-sm text-gray-700">{day.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center space-x-2 bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>Save Settings</span>
        </button>
      </form>
    </motion.div>
  );
}