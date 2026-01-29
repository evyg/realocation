'use client';

import { City, getCities } from '@/lib/calculations';

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CitySelect({ value, onChange }: CitySelectProps) {
  const cities = getCities();
  
  // Sort cities alphabetically by name
  const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-4 text-lg font-medium border border-gray-300 rounded-xl 
                 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 transition-all appearance-none cursor-pointer"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 1rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        paddingRight: '3rem',
      }}
    >
      <option value="">Select your city</option>
      {sortedCities.map((city: City) => (
        <option key={city.id} value={city.id}>
          {city.name}, {city.state}
        </option>
      ))}
    </select>
  );
}
