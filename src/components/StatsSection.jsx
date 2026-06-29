import React from 'react';

const StatsSection = () => {
  return (
    <section id="counts" className="py-14 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { count: '18,793', label: 'Students' },
            { count: '246',    label: 'Courses'  },
            { count: '142',    label: 'Events'   },
            { count: '593',    label: 'Franchise'},
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-6">
              <div className="text-4xl md:text-5xl font-bold text-[#245894] mb-2">
                {stat.count}
              </div>
              <p className="text-gray-600 text-lg font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
