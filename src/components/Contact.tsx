import React, { useState } from 'react';
import { Mail, Clock, Building2, Copy, Check } from 'lucide-react';

export function Contact() {
  const [selectedDay, setSelectedDay] = useState('');
  const [hours, setHours] = useState<{ open: string; close: string; isOpen: boolean } | null>(null);

  const businessHours = {
    mon: { open: '09:00 am', close: '05:00 pm', isOpen: true },
    tue: { open: '09:00 am', close: '05:00 pm', isOpen: true },
    wed: { open: '09:00 am', close: '05:00 pm', isOpen: true },
    thu: { open: '09:00 am', close: '05:00 pm', isOpen: true },
    fri: { open: '09:00 am', close: '05:00 pm', isOpen: true },
    sat: { open: '', close: '', isOpen: false },
    sun: { open: '', close: '', isOpen: false },
  };

  const handleDaySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const day = e.target.value.toLowerCase();
    setSelectedDay(day);
    setHours(businessHours[day as keyof typeof businessHours]);
  };

  return (
    <div className="content-section">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 section-title text-gradient">Contact Us</h1>
        <div className="space-y-8">
          <div className="enhanced-card p-8 scroll-reveal">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Building2 className="w-6 h-6 mr-2" />
              Better yet, see us in person!
            </h2>
            <div className="space-y-4">
              <p className="text-lg font-semibold">CSR NOW</p>
              <ContactInfo size="large" />
            </div>
          </div>

          <div className="enhanced-card p-8 scroll-reveal">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              Business Hours
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-2">
                  Select a day to check our hours:
                </label>
                <select
                  id="day"
                  value={selectedDay}
                  onChange={handleDaySelect}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-2"
                >
                  <option value="">Select a day</option>
                  <option value="mon">Monday</option>
                  <option value="tue">Tuesday</option>
                  <option value="wed">Wednesday</option>
                  <option value="thu">Thursday</option>
                  <option value="fri">Friday</option>
                  <option value="sat">Saturday</option>
                  <option value="sun">Sunday</option>
                </select>
              </div>

              {hours && (
                <div className="bg-gray-50 p-4 rounded-md animate-fade-in">
                  {hours.isOpen ? (
                    <p className="text-lg">
                      Open from <span className="font-semibold">{hours.open}</span> to{' '}
                      <span className="font-semibold">{hours.close}</span>
                    </p>
                  ) : (
                    <p className="text-lg font-semibold text-gray-600">Closed</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactInfo({ size = 'default' }: { size?: 'default' | 'large' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('Connect@csrnow.in');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isLarge = size === 'large';
  const containerClasses = `
    inline-flex items-center bg-white rounded-full shadow-md px-6 py-3
    hover:shadow-lg transition-all duration-300 group cursor-pointer
    ${isLarge ? 'scale-110' : ''}
  `;
  
  const iconClasses = `
    ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}
    text-black group-hover:scale-110 transition-transform
  `;
  
  const textClasses = `
    ${isLarge ? 'text-xl' : 'text-lg'}
    mx-3 font-medium text-black group-hover:text-gray-800
  `;

  return (
    <div 
      className={containerClasses}
      onClick={handleCopy}
      role="button"
      tabIndex={0}
    >
      <Mail className={iconClasses} />
      <span className={textClasses}>Connect@csrnow.in</span>
      {copied ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <Copy className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
      )}
    </div>
  );
}