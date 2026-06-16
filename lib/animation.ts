type NetworkEffectiveType = "slow-2g" | "2g" | "3g" | "4g";

interface NetworkInformation {
  effectiveType?: NetworkEffectiveType;
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

const SLOW_CONNECTION_TYPES: ReadonlySet<NetworkEffectiveType> = new Set([
  "slow-2g",
  "2g",
  "3g"
]);

export function shouldSkipAnimation(): boolean {
  const effectiveType = (navigator as NavigatorWithConnection).connection?.effectiveType;

  if (!effectiveType) {
    return false;
  }

  return SLOW_CONNECTION_TYPES.has(effectiveType);
}
