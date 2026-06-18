"use client";

import { useEffect, useState } from "react";
import type { HomeSectionId } from "@/lib/home-nav";

interface UseActiveSectionOptions {
  sectionIds: readonly HomeSectionId[];
  defaultSection?: HomeSectionId;
}

export function useActiveSection({
  sectionIds,
  defaultSection = "hero",
}: UseActiveSectionOptions): HomeSectionId {
  const [activeSection, setActiveSection] =
    useState<HomeSectionId>(defaultSection);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id as HomeSectionId);
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
