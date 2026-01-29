'use client';

import { useState, useEffect } from 'react';

interface SalaryInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function SalaryInput({ value, onChange }: SalaryInputProps) {
  const [displayValue, setDisplayValue] = useState(formatNumber(value));
  
  function formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }
  
  function parseNumber(str: string): number {
    const cleaned = str.replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
  }
  
  useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseNumber(rawValue);
    
    // Limit to reasonable salary range
    if (numericValue <= 10000000) {
      setDisplayValue(formatNumber(numericValue));
      onChange(numericValue);
    }
  };
  
  const handleFocus = () => {
    if (value === 0) {
      setDisplayValue('');
    }
  };
  
  const handleBlur = () => {
    setDisplayValue(formatNumber(value));
  };
  
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-medium">
        $
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="150,000"
        className="w-full pl-8 pr-4 py-4 text-lg font-medium border border-gray-300 rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all placeholder:text-gray-400"
      />
    </div>
  );
}
