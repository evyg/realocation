'use client';

const stats = [
  { value: '50+', label: 'US Cities' },
  { value: '2024', label: 'Tax Data' },
  { value: '50K+', label: 'Calculations' },
  { value: '10sec', label: 'To Results' },
];

export default function Stats() {
  return (
    <section className="py-12 bg-teal-600">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-teal-200 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
