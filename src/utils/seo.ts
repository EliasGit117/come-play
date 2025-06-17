export interface ISeoParams {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}


export const seo = (params: ISeoParams) => {
  const { title, description, keywords, image } = params;

  const res = [
    // { title: title },
    // { name: 'description', content: description },
    // { name: 'keywords', content: keywords },
    // { name: 'twitter:title', content: title },
    // { name: 'twitter:description', content: description },
    // { name: 'twitter:creator', content: '@tannerlinsley' },
    // { name: 'twitter:site', content: '@tannerlinsley' },
    // { name: 'og:type', content: 'website' },
    // { name: 'og:title', content: title },
    // { name: 'og:description', content: description }
  ];

  if (image)
    res.push(
      { name: 'twitter:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'og:image', content: image }
    );

  return res;
};
