import { APP_VERSION } from "../config/version";

export async function checkForUpdates() {
  try {
    const response = await fetch("/version.json");

    const data = await response.json();

    return {
      updateAvailable: data.version !== APP_VERSION,
      latestVersion: data.version,
      releaseUrl: data.releaseUrl,
    };
  } catch (error) {
    console.error("Update check failed:", error);

    return {
      updateAvailable: false,
    };
  }
}
