import { UTApi } from 'uploadthing/server';
import { serverEnvConfig } from './config/server-env-config';

export const utapi = new UTApi({ token: serverEnvConfig.uploadthingToken });
