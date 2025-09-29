import { UTApi } from 'uploadthing/server';

export const utapi = new UTApi({ token: import.meta.env.VITE_UPLOADTHING_TOKEN });
