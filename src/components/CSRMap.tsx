import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite/Webpack
// This is a common issue where marker images are not found
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CSRActivity {
  id: number;
  title: string;
  location: string;
  category: string;
  impact: string;
  coordinates: [number, number];
}

const csrData: CSRActivity[] = [
  {
    id: 1,
    title: "Clean Water Initiative",
    location: "Rajasthan",
    category: "Environment",
    impact: "Provided clean water to 500+ households",
    coordinates: [27.0238, 74.2179]
  },
  {
    id: 2,
    title: "Digital Literacy Program",
    location: "Karnataka",
    category: "Education",
    impact: "Trained 1000+ students in basic computing",
    coordinates: [15.3173, 75.7139]
  },
  {
    id: 3,
    title: "Maternal Health Support",
    location: "Bihar",
    category: "Healthcare",
    impact: "Supported 200+ expectant mothers",
    coordinates: [25.0961, 85.3131]
  },
  {
    id: 4,
    title: "Renewable Energy Project",
    location: "Gujarat",
    category: "Energy",
    impact: "Installed solar panels in 10 villages",
    coordinates: [22.2587, 71.1924]
  },
  {
    id: 5,
    title: "Rural Employment Drive",
    location: "Madhya Pradesh",
    category: "Livelihood",
    impact: "Created 300+ jobs in local handicrafts",
    coordinates: [23.4733, 77.9470]
  },
  {
    id: 6,
    title: "Educational Scholarship",
    location: "Tamil Nadu",
    category: "Education",
    impact: "Awarded scholarships to 50 under-privileged students",
    coordinates: [11.1271, 78.6569]
  },
  {
    id: 7,
    title: "Waste Management System",
    location: "Maharashtra",
    category: "Environment",
    impact: "Reduced landfill waste by 30% in target area",
    coordinates: [19.7515, 75.7139]
  }
];

export function CSRMap() {
  return (
    <section id="csr-presence" className="py-20 bg-[#f5f1eb]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-[#2d2d2d]">
          Our CSR Presence Across India
        </h2>
        <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-xl border-8 border-white">
          <MapContainer 
            center={[20.5937, 78.9629]} 
            zoom={5} 
            scrollWheelZoom={false}
            className="h-full w-full"
            style={{ zIndex: 10 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {csrData.map((activity) => (
              <Marker key={activity.id} position={activity.coordinates}>
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <h3 className="font-bold text-[#243F83] text-lg mb-2">{activity.title}</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold">Location:</span> {activity.location}</p>
                      <p><span className="font-semibold">Category:</span> {activity.category}</p>
                      <p className="mt-2 text-gray-700 italic border-l-2 border-[#BBD921] pl-2">
                        "{activity.impact}"
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="mt-8 text-center text-gray-600">
          <p className="max-w-2xl mx-auto">
            Explore our interactive map to see how we are making a difference in communities across the country. 
            Click on the markers to learn more about our specific initiatives and their impact.
          </p>
        </div>
      </div>
    </section>
  );
}