'use client';

import { CityResult, formatCurrency } from '@/lib/calculations';

interface CityCardProps {
  result: CityResult;
  rank: number;
  isLocked?: boolean;
}

export default function CityCard({ result, rank, isLocked = false }: CityCardProps) {
  const isPositive = result.differenceFromCurrent > 0;
  const monthlyDiff = Math.abs(result.differenceFromCurrent);
  const annualDiff = monthlyDiff * 12;
  
  if (isLocked) {
    return (
      <div className="relative bg-gray-100 rounded-xl p-5 border border-gray-200 overflow-hidden">
        <div className="blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-sm font-medium text-gray-400">#{rank}</span>
              <h3 className="text-lg font-semibold text-gray-400 mt-1">
                Hidden City, XX
              </h3>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-400">
                +$X,XXX/mo
              </div>
              <div className="text-sm text-gray-400">
                +$XX,XXX/year
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
          <span className="text-gray-500 font-medium">🔒 Unlock full list</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            {rank}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 mt-2">
            {result.city.name}, {result.city.state}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Rent: {formatCurrency(result.monthlyRent)}/mo
          </p>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : '-'}{formatCurrency(monthlyDiff)}/mo
          </div>
          <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : '-'}{formatCurrency(annualDiff)}/year
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Your monthly surplus</span>
          <span className="font-medium text-gray-900">{formatCurrency(result.monthlySurplus)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-500">State tax rate</span>
          <span className="font-medium text-gray-900">{(result.city.stateTaxRate * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
