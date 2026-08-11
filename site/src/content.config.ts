import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const navLinkSchema = z.object({
  label: z.string().optional(),
  link: z.string(),
});

const docsSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    pageType: z.enum(['article', 'landing']).default('article'),
    draft: z.boolean().optional(),
    pubDate: z.string().optional(),
    prev: z.union([z.literal(false), navLinkSchema]).optional(),
    next: z.union([z.literal(false), navLinkSchema]).optional(),
    hero: z
      .object({
        title: z.string(),
        tagline: z.string().optional(),
        actions: z
          .array(
            z.object({
              text: z.string(),
              link: z.string(),
              variant: z.enum(['primary', 'secondary', 'minimal']).optional(),
              icon: z.string().optional(),
            }),
          )
          .optional(),
      })
      .optional(),
    sidebar: z
      .object({
        label: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
    schema: docsSchema,
  }),
};
