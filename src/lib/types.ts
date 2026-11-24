export type Project = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  featured: boolean;
};

export type SkillGroup = {
  id: string;
  category: string;
  items: string[];
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
};

export type Experience = {
  id: string;
  role: string;
  org: string;
  period: string;
  bullets: string[];
};

export type GalleryItem = {
  id: string;
  title: string;
  src: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
};

export type SiteContent = {
  profile: {
    name: string;
    headline: string;
    location: string;
    about: string;
    avatar: string;
    email: string;
    instagram: string;
    linkedin: string;
    github: string;
    education: string;
  };
  resumeUrl: string | null;
  projects: Project[];
  skills: SkillGroup[];
  certifications: Certification[];
  experience: Experience[];
  gallery: GalleryItem[];
  music: Track[];
};
