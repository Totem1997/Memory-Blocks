/**
 * Sample photos for quick preview and instant demonstration
 * Matches the warm, personal memory style shown in the reference UI
 */

export interface SamplePhoto {
  id: string;
  name: string;
  url: string;
}

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'sample_couple',
    name: 'Golden Hour Smile',
    // High quality warm couple portrait resembling the reference image
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'sample_friends',
    name: 'Best Friends',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'sample_family',
    name: 'Family Laughs',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'sample_pet',
    name: 'Puppy Love',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop',
  },
];
