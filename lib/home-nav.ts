export const homeNavLinks = [
  { href: "#hero", label: "Home", sectionId: "hero" },
  { href: "#events", label: "Events", sectionId: "events" },
  { href: "#about", label: "Profile", sectionId: "about" },
  { href: "#contact", label: "Contact", sectionId: "contact" },
] as const;

export type HomeSectionId = (typeof homeNavLinks)[number]["sectionId"];

export const homeScrollSpySectionIds: HomeSectionId[] = homeNavLinks.map(
  (link) => link.sectionId,
);
