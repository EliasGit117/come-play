export interface CaseStudyConfig {
  /** key under pages.public.solutions.{category}.items.{sub}.caseStudy */
  photo: string;
  video: string;
}

export interface SubcategoryConfig {
  slug: string;
  /** key under pages.public.solutions.{category}.items.{key} */
  key: string;
  caseStudy?: CaseStudyConfig;
}

export interface CategoryConfig {
  slug: string;
  /** key under pages.public.solutions.{key} */
  key: string;
  subcategories: SubcategoryConfig[];
}

export const SOLUTION_CATEGORIES: CategoryConfig[] = [
  {
    slug: 'indoor',
    key: 'indoor',
    subcategories: [
      {
        slug: 'led-walls',
        key: 'ledWalls',
        caseStudy: {
          photo: '/images/solutions/case-studies/led-walls.webp',
          video: '/videos/solutions/led-walls.mp4'
        }
      },
      { slug: 'storefront-systems', key: 'storefrontSystems' },
      {
        slug: 'mobile-solutions',
        key: 'mobileSolutions',
        caseStudy: {
          photo: '/images/solutions/case-studies/mobile-solutions.webp',
          video: '/videos/solutions/mobile-solutions.mp4'
        }
      },
      { slug: 'corner-installations', key: 'cornerInstallations' }
    ]
  },
  {
    slug: 'outdoor',
    key: 'outdoor',
    subcategories: [
      { slug: 'billboard-panels', key: 'billboardPanels' },
      { slug: 'transport-screens', key: 'transportScreens' },
      {
        slug: 'outdoor-storefront',
        key: 'outdoorStorefront',
        caseStudy: {
          photo: '/images/solutions/case-studies/outdoor-storefront.webp',
          video: '/videos/solutions/outdoor-storefront.mp4'
        }
      },
      { slug: 'urban-info-panels', key: 'urbanInfoPanels' },
      {
        slug: 'media-facades',
        key: 'mediaFacades',
        caseStudy: {
          photo: '/images/solutions/case-studies/media-facades.webp',
          video: '/videos/solutions/media-facades.mp4'
        }
      },
      { slug: 'stadium-event-systems', key: 'stadiumEventSystems' }
    ]
  },
  {
    slug: 'transparent',
    key: 'transparent',
    subcategories: [
      { slug: 'storefront-transparent', key: 'storefrontTransparent' },
      { slug: 'museum-exhibition', key: 'museumExhibition' },
      { slug: 'stage-transparent', key: 'stageTransparent' },
      { slug: 'facade-transparent', key: 'facadeTransparent' }
    ]
  },
  {
    slug: 'flexible',
    key: 'flexible',
    subcategories: [
      { slug: 'custom-shapes', key: 'customShapes' },
      { slug: 'round-columns', key: 'roundColumns' },
      { slug: 'curved-displays', key: 'curvedDisplays' }
    ]
  }
];

export const getCategory = (slug: string) =>
  SOLUTION_CATEGORIES.find((category) => category.slug === slug);

export const getSubcategory = (categorySlug: string, subcategorySlug: string) => {
  const category = getCategory(categorySlug);
  if (!category) return undefined;

  const subcategory = category.subcategories.find((sub) => sub.slug === subcategorySlug);
  if (!subcategory) return undefined;

  return { category, subcategory };
};

export const getCategoryImage = (categorySlug: string) => `/images/solutions/${categorySlug}/category.webp`;

export const getSubcategoryImage = (categorySlug: string, subcategorySlug: string, variant: 1 | 2 = 1) =>
  `/images/solutions/${categorySlug}/${subcategorySlug}-${variant}.webp`;
