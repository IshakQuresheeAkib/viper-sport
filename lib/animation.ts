type NetworkEffectiveType = "slow-2g" | "2g" | "3g" | "4g";

interface NetworkInformation {
  effectiveType?: NetworkEffectiveType;
  saveData?: boolean;
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

const SLOW_CONNECTION_TYPES: ReadonlySet<NetworkEffectiveType> = new Set([
  "slow-2g",
  "2g",
  "3g",
]);

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldSkipAnimation(): boolean {
  if (typeof window !== "undefined" && prefersReducedMotion()) {
    return true;
  }

  if (typeof navigator === "undefined") {
    return false;
  }

  const connection = (navigator as NavigatorWithConnection).connection;

  if (!connection) {
    return false;
  }

  if (connection.saveData === true) {
    return true;
  }

  const effectiveType = connection.effectiveType;

  if (!effectiveType) {
    return false;
  }

  return SLOW_CONNECTION_TYPES.has(effectiveType);
}
