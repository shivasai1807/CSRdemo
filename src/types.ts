export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface ContactFormData {
  name: string;
  email: string;
  query: string;
}

export interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  necessary: boolean;
}

export interface Section {
  id: string;
  label: string;
}

export interface Story {
  id: string;
  name: string;
  location: string;
  story: string;
  image: string;
}