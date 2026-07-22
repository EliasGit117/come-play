export interface IPreviewImage {
  key: string;
  /** Used as the <img> alt text */
  label: string;
  src: string;
}

/** Drop the matching files into public/images/calculator/ */
export const previewImages: IPreviewImage[] = [
  { key: 'mountains', label: 'Mountains', src: '/images/calculator/mountains.webp' },
  { key: 'city-night', label: 'City at night', src: '/images/calculator/city-night.webp' },
  { key: 'coast', label: 'Coast', src: '/images/calculator/coast.webp' }
];

export const defaultPreviewImage = previewImages[0];
