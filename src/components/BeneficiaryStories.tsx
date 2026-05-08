import React from "react";
import { Story } from "../types";
import { Quote } from "lucide-react";

const mockStories: Story[] = [
  {
    id: "1",
    name: "Anita Sharma",
    location: "Rural Rajasthan",
    story: "Through the vocational training program, I learned sustainable farming techniques that doubled my crop yield. I can now afford to send both my daughters to school.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "2",
    name: "John Doe",
    location: "Nairobi, Kenya",
    story: "The clean water initiative brought a borehole to our village. We no longer walk miles for water, and water-borne diseases have significantly decreased.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "3",
    name: "Maria Garcia",
    location: "Lima, Peru",
    story: "The micro-finance loan helped me start my own small bakery. Today, I employ three other women from my neighborhood.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=600",
  },
];

export function BeneficiaryStories() {
  return (
    <div className="content-section">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 section-title text-gradient text-center">Voices of Impact</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockStories.map((story) => (
            <div 
              key={story.id}
              className="group enhanced-card overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-[#243F83]">
                  {story.location}
                </div>
              </div>
              
              <div className="p-6 bg-white flex flex-col h-full">
                <div className="flex items-start mb-4">
                  <Quote className="w-8 h-8 text-[#BBD921] mr-2 flex-shrink-0" />
                  <p className="text-gray-700 italic leading-relaxed">
                    "{story.story}"
                  </p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
