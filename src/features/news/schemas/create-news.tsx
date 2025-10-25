import { z } from "zod";
import { newsBaseSchema } from '@/features/news/schemas/news';

export const createNewsSchema = newsBaseSchema.extend({});

export type TCreateNewsSchema = z.infer<typeof newsBaseSchema>;
