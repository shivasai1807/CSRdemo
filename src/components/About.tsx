import React, { useState } from 'react';
import { ContactInfo } from './Contact';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80',
    title: 'Transforming Business Through CSR',
  },
  {
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=2000&q=80',
    title: 'Building Sustainable Future',
  },
  {
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=80',
    title: 'Empowering Communities',
  },
];

export function About() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Slideshow Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>
            <div className="relative h-full flex flex-col items-center justify-center text-white">
              <h1 className="text-5xl font-bold mb-12 animate-fade-in">{slide.title}</h1>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
                <a
                  href="https://meraevents.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-[#BBD921] text-black rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
                >
                  Register
                </a>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSe0e38XTHwK81WIniC0mLRNQfXhyFT2jhaOGmIljluNFhpChw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-[#BBD921] text-black rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
                >
                  Register for Awards
                </a>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfICHIZJ1dUG7Wz13lbmFk9DX-Z1JQOJCAOQ1Jx1GAmpPqrxQ/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-[#BBD921] text-black rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
                >
                  Nominate Speaker
                </a>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all transform hover:scale-125 ${
                index === currentSlide ? 'bg-[#BBD921]' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg">
            <h2 className="text-4xl font-bold mb-8 text-center">About CSR NOW</h2>
            <p className="text-lg mb-6">
              CSR NOW is a premier platform dedicated to promoting and advancing Corporate Social 
              Responsibility initiatives across industries. We bring together leaders, innovators, 
              and change-makers to create meaningful impact in communities worldwide.
            </p>
            <p className="text-lg mb-6">
              Our mission is to facilitate collaboration between corporations and communities, 
              fostering sustainable development and positive social change through effective CSR 
              programs and initiatives.
            </p>
            <div className="mt-12 text-center">
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}