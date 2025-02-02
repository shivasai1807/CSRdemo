import React from 'react';
import { Navigation } from './components/Navigation';
import { Slideshow } from './components/Slideshow';
import { About } from './components/About';
import { Registrations } from './components/Registrations';
import { Awards } from './components/Awards';
import { Speakers } from './components/Speakers';
import { Team } from './components/Team';
import { Sponsorships } from './components/Sponsorships';
import { Itinerary } from './components/Itinerary';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { ContactForm } from './components/ContactForm';
import { CookieConsent } from './components/CookieConsent';
import { Footer } from './components/Footer';
import { FloatingContact } from './components/FloatingContact';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <Navigation />
      <main>
        <section id="home">
          <Slideshow />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="registrations">
          <Registrations />
        </section>
        <section id="awards">
          <Awards />
        </section>
        <section id="speakers">
          <Speakers />
        </section>
        <section id="team">
          <Team />
        </section>
        <section id="sponsorships">
          <Sponsorships />
        </section>
        <section id="itinerary">
          <Itinerary />
        </section>
        <section id="faqs">
          <FAQ />
        </section>
        <section id="contact">
          <Contact />
        </section>
        <ContactForm />
        <CookieConsent />
        <FloatingContact />
      </main>
      <Footer />
    </div>
  );
}