import React from 'react';
import { ContactInfo } from './Contact';

const TIER_DATES = {
  earlyBird: new Date('2025-01-31T23:59:59'),
  regular: new Date('2025-03-10T23:59:59'),
};

function RegistrationTier({ 
  title, 
  price, 
  date, 
  isActive 
}: { 
  title: string; 
  price: string; 
  date: string;
  isActive: boolean;
}) {
  return (
    <div className={`enhanced-card p-8 transform transition-all duration-500 hover:scale-105 ${
      isActive ? 'border-2 border-[#BBD921]' : ''
    }`}>
      <div className="text-2xl font-bold mb-4">{title}</div>
      <div className="text-4xl font-bold mb-4 text-[#243F83]">{price}</div>
      <div className="text-gray-600 mb-4">Valid until {date}</div>
      <a
        href="https://meraevents.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-[#BBD921] text-black px-6 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors"
      >
        Register Now
      </a>
    </div>
  );
}

export function Registrations() {
  const now = new Date();
  const currentTier = now <= TIER_DATES.earlyBird ? 'early' : 
                     now <= TIER_DATES.regular ? 'regular' : 'late';

  return (
    <div className="content-section">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 section-title text-gradient text-center">Registration</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <RegistrationTier
            title="Early Bird"
            price="₹6,000/-"
            date="January 31, 2025"
            isActive={currentTier === 'early'}
          />
          <RegistrationTier
            title="Regular"
            price="₹10,000/-"
            date="March 10, 2025"
            isActive={currentTier === 'regular'}
          />
          <RegistrationTier
            title="Change Maker"
            price="₹25,000/-"
            date="March 10, 2025"
            isActive={currentTier === 'cm'}
          />
        </div>

        <div className="enhanced-card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Terms and Conditions</h2>
          <ol className="space-y-6">
            {[
              'One Successful registration will give an access to one Individual to the event.',
              'Lunch and Hi Tea will be Served at the event. You can choose Veg and Non Veg option at the time of Booking itself.',
              'Goodie Bags will be provided for all the Participants.',
              'Access to all the areas as per the Registration of Tickets is being granted.',
              'All the Participants are requested to Attend on time to the event. Late Comers will not be allowed even you purchase the ticket.',
              'Registration once done, will not be refunded at any circumstances. However a substitute name will be accepted if he/she is from same organization.',
              'The Name of the speakers and the panelists in the website and the Broucher are based on their confirmation. In case, any speaker/panelist could not make it to the event, the organizing committee/organization cannot be held responsible.',
            ].map((item, index) => (
              <li key={index} className="animated-list-item flex items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#BBD921] text-black rounded-full mr-4">
                  {index + 1}
                </span>
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}