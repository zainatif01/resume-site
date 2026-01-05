export interface ResumeContact {
  email: string;
  phone: string;
  location: string;
}

export interface ResumeItem {
  paragraph: string;
  boldLeft?: string;
  boldRight?: string;
  italicLeft?: string;
  italicRight?: string;
  bullets?: string[];
}

export interface ResumeSection {
  id: string;
  title: string;
  items: ResumeItem[];
}

export interface ResumeData {
  name: string;
  contact: ResumeContact;
  sections: ResumeSection[];
  copyright?: string;
}
