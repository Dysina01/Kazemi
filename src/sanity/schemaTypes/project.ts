import { defineArrayMember, defineField, defineType } from "sanity";

const imageField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        validation: (rule) => rule.required(),
      }),
    ],
  });

export const projectType = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isVisible",
      title: "Visible on website",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Show on home page",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "category",
      title: "Project type",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hero",
      title: "Hero media",
      type: "object",
      fields: [
        defineField({
          name: "mediaType",
          title: "Media type",
          type: "string",
          options: {
            layout: "radio",
            list: [
              { title: "Image", value: "image" },
              { title: "Video", value: "video" },
            ],
          },
          initialValue: "image",
        }),
        imageField("image", "Hero image"),
        defineField({
          name: "video",
          title: "Hero video",
          type: "file",
          options: { accept: "video/*" },
        }),
      ],
    }),
    defineField({
      name: "facts",
      title: "Project facts",
      description: "Add as many items as this project needs.",
      type: "array",
      of: [
        defineArrayMember({
          name: "fact",
          title: "Fact",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        }),
      ],
    }),
    defineField({
      name: "externalUrl",
      title: "Live product URL",
      type: "url",
    }),
    defineField({
      name: "sections",
      title: "Case study sections",
      description: "Drag to reorder. Every block is optional.",
      type: "array",
      of: [
        defineArrayMember({
          name: "contentSection",
          title: "Text / Text + image",
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Anchor ID",
              type: "string",
              description: "Example: overview or problem",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "label", title: "Small label", type: "string" }),
            defineField({ name: "heading", title: "Heading", type: "string" }),
            defineField({
              name: "showInNavigation",
              title: "Show in floating navigation",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [{ type: "block" }],
            }),
            imageField("media", "Optional image"),
          ],
          preview: {
            select: { title: "heading", subtitle: "label", media: "media" },
          },
        }),
        defineArrayMember({
          name: "gallerySection",
          title: "Gallery",
          type: "object",
          fields: [
            defineField({
              name: "items",
              title: "Gallery images",
              type: "array",
              of: [
                defineArrayMember({
                  name: "galleryItem",
                  title: "Gallery item",
                  type: "object",
                  fields: [
                    imageField("image", "Image"),
                    defineField({
                      name: "size",
                      title: "Desktop width",
                      type: "string",
                      options: {
                        layout: "radio",
                        list: [
                          { title: "Wide", value: "wide" },
                          { title: "Narrow", value: "narrow" },
                        ],
                      },
                      initialValue: "wide",
                    }),
                    defineField({ name: "title", title: "Caption title", type: "string" }),
                    defineField({ name: "description", title: "Caption description", type: "string" }),
                  ],
                  preview: {
                    select: { title: "title", subtitle: "description", media: "image" },
                  },
                }),
              ],
            }),
          ],
          preview: {
            prepare: () => ({ title: "Gallery" }),
          },
        }),
        defineArrayMember({
          name: "metricsSection",
          title: "Metrics / Results",
          type: "object",
          fields: [
            defineField({ name: "id", title: "Anchor ID", type: "string" }),
            defineField({ name: "label", title: "Small label", type: "string" }),
            defineField({ name: "heading", title: "Heading", type: "string" }),
            defineField({
              name: "showInNavigation",
              title: "Show in floating navigation",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "items",
              title: "Metrics",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "value", title: "Value", type: "string" }),
                    defineField({ name: "label", title: "Label", type: "string" }),
                  ],
                }),
              ],
            }),
          ],
        }),
        defineArrayMember({
          name: "quoteSection",
          title: "Quote",
          type: "object",
          fields: [
            defineField({ name: "id", title: "Anchor ID", type: "string" }),
            defineField({ name: "quote", title: "Quote", type: "text", rows: 4 }),
            defineField({ name: "attribution", title: "Attribution", type: "string" }),
          ],
        }),
        defineArrayMember({
          name: "beforeAfterSection",
          title: "Before / After",
          type: "object",
          fields: [
            defineField({ name: "id", title: "Anchor ID", type: "string" }),
            defineField({ name: "label", title: "Small label", type: "string" }),
            defineField({ name: "heading", title: "Heading", type: "string" }),
            defineField({
              name: "showInNavigation",
              title: "Show in floating navigation",
              type: "boolean",
              initialValue: false,
            }),
            imageField("before", "Before"),
            imageField("after", "After"),
          ],
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "title", title: "SEO title", type: "string" }),
        defineField({ name: "description", title: "SEO description", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "hero.image",
    },
  },
});

