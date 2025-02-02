import React from 'react';
import { ContactInfo } from './Contact';

const sponsors = {
  platinum: [
    { name: 'Platinum Sponsor 1', logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' },
    { name: 'Platinum Sponsor 2', logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  ],
  gold: [
    { name: 'Gold Sponsor 1', logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
    { name: 'Gold Sponsor 2', logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' },
  ],
  silver: [
    { name: 'Silver Sponsor 1', logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    { name: 'Silver Sponsor 2', logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
    { name: 'Silver Sponsor 3', logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' },
    { name: 'Silver Sponsor 4', logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  ],
};

export function Sponsorships() {
  return (
    <div className="content-section">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 section-title text-gradient text-center">Our Sponsors</h1>

        {/* Platinum Sponsors */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Platinum Sponsors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sponsors.platinum.map((sponsor, index) => (
              <div key={index} className="enhanced-card p-8 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <img src={sponsor.logo} alt={sponsor.name} className="h-32 object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Gold Sponsors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sponsors.gold.map((sponsor, index) => (
              <div key={index} className="enhanced-card p-8 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <img src={sponsor.logo} alt={sponsor.name} className="h-24 object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Silver Sponsors - Scrolling */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Silver Sponsors</h2>
          <div className="overflow-hidden">
            <div className="flex animate-scroll">
              {[...sponsors.silver, ...sponsors.silver].map((sponsor, index) => (
                <div key={index} className="flex-shrink-0 w-64 mx-4">
                  <div className="enhanced-card p-6 flex items-center justify-center h-32">
                    <img src={sponsor.logo} alt={sponsor.name} className="h-20 object-contain" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donation Section */}
        <div className="mt-16">
          <div className="enhanced-card p-8 bg-gradient-to-r from-[#243F83] to-[#1a2f61] text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Support Our Cause</h2>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-4 text-center">ACCOUNT DETAILS OF THE PARTNER NGO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ['ACCOUNT NAME', 'BACHPAN BACHAO'],
                  ['ACCOUNT NUMBER', '50200099572967'],
                  ['BANK NAME', 'HDFC BANK'],
                  ['IFSC CODE', 'HDFC0004326'],
                ].map(([label, value]) => (
                  <div key={label} className="animated-list-item bg-white bg-opacity-5 p-4 rounded-lg">
                    <dt className="font-medium text-[#BBD921]">{label}</dt>
                    <dd className="mt-1">{value}</dd>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-white bg-opacity-5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-[#BBD921]">Important Notes:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>While Payment "In the Remarks Kindly mention The reason for Donation along with contact number"</li>
                  <li>All the Donations Made to this Organization are TAX Exempted Under 12A, 80G of Income Tax Act</li>
                  <li>CSR Donations can also be made to this organization and be a part of CSR</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}