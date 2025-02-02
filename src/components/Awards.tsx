import React from 'react';
import { ContactInfo } from './Contact';

export function Awards() {
  return (
    <div className="content-section">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 section-title text-gradient">CSR Awards</h1>
        <div className="enhanced-card p-8 mb-8 scroll-reveal">
          <div className="space-y-6 text-lg">
            <p className="animated-list-item">
              CSR Awards by CSRNOW have been designed to Recognize the Super Human's in Corporate 
              Social Responsibility and for the Super Human's who are doing tremendous work on the 
              field (From the Organization or Individually).
            </p>
            <p className="animated-list-item">
              CSR Awards is one of the Prestigious awards by CSRNOW to recognize the Industry experts 
              for their work.
            </p>
          </div>
        </div>
        
        <div className="text-center scroll-reveal">
          <div className="mb-8 inline-flex justify-center">
            <ContactInfo />
          </div>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSe0e38XTHwK81WIniC0mLRNQfXhyFT2jhaOGmIljluNFhpChw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button inline-block bg-black text-white px-12 py-4 rounded-md font-semibold text-lg"
          >
            Register for Awards
          </a>
        </div>
      </div>
    </div>
  );
}