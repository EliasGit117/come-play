export const SITE_NAME = 'Led Display';

export interface ISeoParams {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}

type TMetaTag =
  | { title: string }
  | { name: string; content: string };


export const seo = (params: ISeoParams) => {
  const { description, keywords, image } = params;
  const title = params.title.includes(SITE_NAME)
    ? params.title
    : `${params.title} | ${SITE_NAME}`;

  const res: TMetaTag[] = [
    { title },
    { name: 'og:type', content: 'website' },
    { name: 'og:site_name', content: SITE_NAME },
    { name: 'og:title', content: title },
    { name: 'twitter:title', content: title },
    { name: 'twitter:card', content: 'summary_large_image' }
  ];

  if (description)
    res.push(
      { name: 'description', content: description },
      { name: 'og:description', content: description },
      { name: 'twitter:description', content: description }
    );

  if (keywords)
    res.push({ name: 'keywords', content: keywords });

  if (image)
    res.push(
      { name: 'og:image', content: image },
      { name: 'twitter:image', content: image }
    );

  return res;
};
