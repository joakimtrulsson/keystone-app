export default function buildSlug(title: string): string {
  let slug = title.trim();

  slug = slug.replace(/\s+/g, '-');

  slug = slug.toLowerCase();

  return slug;
}
