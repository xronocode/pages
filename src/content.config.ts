import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    num: z.string(),
    tags: z.array(z.string()).default([]),
    mirrors: z.object({
      ru: z.string().optional(),
      en: z.string().optional(),
      habr: z.string().optional(),
    }).default({}),
  }),
});

const oss = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/oss' }),
  schema: z.object({
    date: z.coerce.date(),
    status: z.enum(['merged', 'open', 'closed']),
    repo: z.string(),
    pr: z.string(),
    title: z.string(),
    description: z.string(),
    num: z.string(),
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
    })).default([]),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    glyph: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    url: z.string().optional(),
  }),
});

const pets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pets' }),
  schema: z.object({
    title: z.string(),
    glyph: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    version: z.string().optional(),
    url: z.string().optional(),
  }),
});

const linkedin = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/linkedin' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    topic: z.string(),
    url: z.string().optional(),
  }),
});

export const collections = { blog, oss, tools, pets, linkedin };
