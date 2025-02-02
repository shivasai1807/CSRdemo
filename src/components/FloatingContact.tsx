import React from 'react';
import { MapPin, Phone } from 'lucide-react';

export function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col space-y-2">
      <a
        href="https://www.google.com/maps/search/shilpa+kala+vedika/@17.451111,78.3770239,17z/data=!3m1!4b1?entry=ttu&x=EgoyMDI1MDExNS4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#BBD921] text-black rounded-full p-3 shadow-lg hover:bg-opacity-90 transition-all hover:scale-110"
      >
        <MapPin className="w-6 h-6" />
      </a>
      <a
        href="tel:+918328382486"
        className="bg-[#BBD921] text-black rounded-full p-3 shadow-lg hover:bg-opacity-90 transition-all hover:scale-110"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}