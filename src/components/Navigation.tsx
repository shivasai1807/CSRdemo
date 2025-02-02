import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Registrations', href: '#registrations' },
  { label: 'Awards', href: '#awards' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Team', href: '#team' },
  { label: 'Sponsorships', href: '#sponsorships' },
  { label: 'Itinerary', href: '#itinerary' },
  { label: "FAQ's", href: '#faqs' },
  {
    label: 'More',
    href: '#',
    children: [
      { label: 'About Us', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ],
  },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#243F83] text-white z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, '#home')}
              className="text-xl font-bold hover:text-gray-300 transition-colors"
            >
              CSRNOW
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <button
                    className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="hover:text-gray-300 transition-colors"
                  >
                    {item.label}
                  </a>
                )}

                {item.children && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#243F83] rounded-md shadow-lg py-1 hidden group-hover:block">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={(e) => handleNavClick(e, child.href)}
                        className="block px-4 py-2 text-sm hover:bg-[#1a2f61] transition-colors"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[#1a2f61] transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      className="w-full flex items-center justify-between px-3 py-2 text-base hover:bg-[#1a2f61] transition-colors"
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="pl-4">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={(e) => handleNavClick(e, child.href)}
                            className="block px-3 py-2 text-base text-gray-300 hover:bg-[#1a2f61] transition-colors"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="block px-3 py-2 text-base hover:bg-[#1a2f61] transition-colors"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}