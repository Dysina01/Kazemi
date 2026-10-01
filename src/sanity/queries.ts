import { defineQuery } from "next-sanity";

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug && isVisible != false][0] {
    "slug": slug.current,
    title,
    category,
    year,
    description,
    "hero": {
      "src": coalesce(hero.image.asset->url, hero.video.asset->url),
      "alt": coalesce(hero.image.alt, title),
      "width": coalesce(hero.image.asset->metadata.dimensions.width, 900),
      "height": coalesce(hero.image.asset->metadata.dimensions.height, 650)
    },
    facts[]{label, value},
    externalUrl,
    sections[]{
      _key,
      _type,
      id,
      label,
      heading,
      body,
      showInNavigation,
      "media": select(
        defined(media.asset) => {
          "src": media.asset->url,
          "alt": coalesce(media.alt, heading),
          "width": coalesce(media.asset->metadata.dimensions.width, 900),
          "height": coalesce(media.asset->metadata.dimensions.height, 630)
        }
      ),
      items[]{
        _key,
        label,
        value,
        size,
        title,
        description,
        "src": image.asset->url,
        "alt": coalesce(image.alt, title),
        "width": coalesce(image.asset->metadata.dimensions.width, 900),
        "height": coalesce(image.asset->metadata.dimensions.height, 630)
      },
      quote,
      attribution,
      "before": {
        "src": before.asset->url,
        "alt": coalesce(before.alt, "Before"),
        "width": coalesce(before.asset->metadata.dimensions.width, 900),
        "height": coalesce(before.asset->metadata.dimensions.height, 630)
      },
      "after": {
        "src": after.asset->url,
        "alt": coalesce(after.alt, "After"),
        "width": coalesce(after.asset->metadata.dimensions.width, 900),
        "height": coalesce(after.asset->metadata.dimensions.height, 630)
      }
    },
    seo
  }
`);

export const projectSlugsQuery = defineQuery(
  `*[_type == "project" && defined(slug.current) && isVisible != false].slug.current`,
);

