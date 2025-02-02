import React from 'react';

const timeline = [
  {
    time: '09:00 AM',
    event: 'Registration & Breakfast',
    description: 'Check-in and welcome breakfast for all attendees'
  },
  {
    time: '10:00 AM',
    event: 'Opening Ceremony',
    description: 'Welcome address and keynote speech'
  },
  {
    time: '11:00 AM',
    event: 'Panel Discussion',
    description: 'CSR Initiatives in Modern Business'
  },
  {
    time: '12:30 PM',
    event: 'Networking Lunch',
    description: 'Lunch break and networking opportunity'
  },
  {
    time: '02:00 PM',
    event: 'Breakout Sessions',
    description: 'Specialized workshops and discussions'
  },
  {
    time: '04:00 PM',
    event: 'Awards Ceremony',
    description: 'Recognition of outstanding CSR contributions'
  },
  {
    time: '05:30 PM',
    event: 'Closing Ceremony',
    description: 'Concluding remarks and future outlook'
  }
];

export function Itinerary() {
  return (
    <div className="content-section">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 section-title text-gradient text-center">Event Schedule</h1>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-[#243F83]" />
          
          {/* Timeline events */}
          <div className="space-y-12">
            {timeline.map((item, index) => (
              <div 
                key={index}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline node */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#BBD921] rounded-full z-10">
                  <div className="absolute w-8 h-8 bg-[#BBD921] rounded-full -left-2 -top-2 animate-ping opacity-20" />
                </div>
                
                {/* Content */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="enhanced-card p-6 hover:scale-105 transition-transform duration-300">
                    <div className="text-xl font-bold text-[#243F83] mb-2">{item.time}</div>
                    <div className="text-lg font-semibold mb-2">{item.event}</div>
                    <div className="text-gray-600">{item.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}