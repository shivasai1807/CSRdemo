import React from 'react';
import { ContactInfo } from './Contact';

export function FAQ() {
  const faqs = [
    {
      question: 'Who Can attend the event?',
      answer: 'The event is open for professionals from corporate organizations, CSR foundations, non-profits/trusts, government and non-government organizations, social enterprises, start-ups, academic and technological institutes, impact investors and social incubators.',
    },
    {
      question: 'What are the takeaways from the event?',
      answer: 'It is the biggest platform in the country for networking and forming connections for future projects among professionals coming from multi-sectoral domains. It also encourages dialogue among social issues that can further foster the CSR domain of the country.',
    },
    {
      question: 'Is there any award ceremony at the event?',
      answer: 'Yes, There is an award Ceremony at the event and you can also nominate yourself and our jury team will go through it.',
    },
    {
      question: 'Is there any registration fee to attend the event?',
      answer: 'Yes, There is a registration fee and you can register yourself from the reserve your spot link.',
    },
  ];

  return (
    <div className="content-section">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 section-title text-gradient">Frequently Asked Questions</h1>
        
        <div className="space-y-8 mb-12">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="enhanced-card p-6 scroll-reveal"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <h2 className="text-xl font-semibold mb-4">{faq.question}</h2>
              <p className="text-lg">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="enhanced-card p-8 scroll-reveal">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg">
            At CSRNOW, our mission is to empower business professionals with the knowledge and 
            skills they need to succeed in the ever-changing world of commerce. Our conference 
            brings together industry experts and thought leaders to share insights, strategies, 
            and best practices.
          </p>
        </div>

        <div className="mt-8 text-center scroll-reveal">
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}