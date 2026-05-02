import React from 'react';
import { ContactInfo } from './Contact';

export function Speakers() {
  return (
    <div className="content-section">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 section-title text-gradient">Suggest a Speaker</h1>
        <div className="enhanced-card p-8 mb-8 scroll-reveal">
          <div className="space-y-6 text-lg">
            <p className="animated-list-item">
              You can nominate a speaker or self-nomination is entertained If you feel that you could 
              share content related to the theme of CSRNOW Summit 2025 from the below Link. Our Speaker 
              Jury will review all the Nominations and will finalize the Selection. Once the Name is 
              selected, our Jury team will be contacting the mentioned contact details for further process.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Note:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li className="animated-list-item">The Nominations should be based with the Theme of the current event.</li>
                <li className="animated-list-item">All the required documents are to be enclosed along with the application.</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="text-center scroll-reveal">
          <div className="mb-8 inline-flex justify-center">
            <ContactInfo />
          </div>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSfICHIZJ1dUG7Wz13lbmFk9DX-Z1JQOJCAOQ1Jx1GAmpPqrxQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button inline-block bg-black text-white px-12 py-4 rounded-md font-semibold text-lg"
          >
            Nominate Speaker
          </a>
        </div>
      </div>
    </div>
  );
}