export interface SubcategoryConfig {
  slug: string;
  /** key under pages.public.products.{category}.items.{key} */
  key: string;
}

export interface CategoryConfig {
  slug: string;
  /** key under pages.public.products.{key} */
  key: string;
  /** whether /images/products/{slug}/ has {sub}-1.webp/-2.webp for each subcategory */
  hasImages: boolean;
  /** whether /images/products/{slug}/category.webp exists (hero). Defaults to hasImages. */
  hasHeroImage?: boolean;
  subcategories: SubcategoryConfig[];
}

export const PRODUCT_CATEGORIES: CategoryConfig[] = [
  {
    slug: 'indoor',
    key: 'indoor',
    hasImages: true,
    subcategories: [
      { slug: 'led-walls', key: 'ledWalls' },
      { slug: 'corner-installations', key: 'cornerInstallations' },
      { slug: 'storefront-systems', key: 'storefrontSystems' },
      { slug: 'mobile-solutions', key: 'mobileSolutions' }
    ]
  },
  {
    slug: 'outdoor',
    key: 'outdoor',
    hasImages: true,
    subcategories: [
      { slug: 'billboard-panels', key: 'billboardPanels' },
      { slug: 'media-facades', key: 'mediaFacades' },
      { slug: 'outdoor-storefront', key: 'outdoorStorefront' },
      { slug: 'urban-info-panels', key: 'urbanInfoPanels' },
      { slug: 'transport-screens', key: 'transportScreens' },
      { slug: 'stadium-event-systems', key: 'stadiumEventSystems' }
    ]
  },
  {
    slug: 'transparent',
    key: 'transparent',
    hasImages: true,
    subcategories: [
      { slug: 'storefront-transparent', key: 'storefrontTransparent' },
      { slug: 'facade-transparent', key: 'facadeTransparent' },
      { slug: 'stage-transparent', key: 'stageTransparent' }
    ]
  },
  {
    slug: 'soft',
    key: 'soft',
    hasImages: true,
    subcategories: [
      { slug: 'round-columns', key: 'roundColumns' },
      { slug: 'curved-displays', key: 'curvedDisplays' },
      { slug: 'custom-shapes', key: 'customShapes' }
    ]
  },
  {
    slug: 'rental',
    key: 'rental',
    hasImages: false,
    hasHeroImage: true,
    subcategories: [
      { slug: 'outdoor-rental', key: 'outdoorRental' },
      { slug: 'indoor-rental', key: 'indoorRental' }
    ]
  },
  {
    slug: 'ready-made',
    key: 'readyMade',
    hasImages: false,
    subcategories: []
  }
];

export const getCategory = (slug: string) =>
  PRODUCT_CATEGORIES.find((category) => category.slug === slug);

export const getSubcategory = (categorySlug: string, subcategorySlug: string) => {
  const category = getCategory(categorySlug);
  if (!category) return undefined;

  const subcategory = category.subcategories.find((sub) => sub.slug === subcategorySlug);
  if (!subcategory) return undefined;

  return { category, subcategory };
};

export const getCategoryImage = (categorySlug: string) => `/images/products/${categorySlug}/category.webp`;

export const getSubcategoryImage = (categorySlug: string, subcategorySlug: string, variant: 1 | 2 | 3 = 1) =>
  `/images/products/${categorySlug}/${subcategorySlug}-${variant}.webp`;
