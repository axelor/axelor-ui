#!/usr/bin/env node

/**
 * get-tag.js
 * Determines the appropriate npm tag for the current version of the package
 *
 * Usage: node get-tag.js
 *
 * Returns:
 * - "latest" if this is the newest version
 * - "x-y-stable" if this is a backport/patch for an older version
 * - prerelease identifier (e.g., "alpha", "beta", "rc") for prereleases
 */

import fse from "fs-extra";
import https from "https";
import path from "path";
import { parse, valid, prerelease, gt, rcompare } from "semver";

let packageName;
let packageVersion;

try {
  const packageJson = fse.readJsonSync(
    path.resolve(import.meta.dirname, "../package.json"),
    {
      encoding: "utf8",
    },
  );
  packageName = packageJson.name;
  packageVersion = packageJson.version;
} catch (err) {
  console.error("Error: Could not read package.json", err);
  process.exit(1);
}

if (!packageName || !packageVersion) {
  console.error("Error: Could not determine package name or version");
  process.exit(1);
}

// Validate semver
if (!valid(packageVersion)) {
  console.error(`Error: Invalid semantic version: ${packageVersion}`);
  process.exit(1);
}

/**
 * Fetch package metadata from npm registry
 */
function fetchPackageData(packageName) {
  return new Promise((resolve, reject) => {
    const url = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;

    https
      .get(url, (res) => {
        let data = "";

        if (res.statusCode === 404) {
          resolve({ versions: {} });
          return;
        }

        if (res.statusCode !== 200) {
          reject(
            new Error(`HTTP ${res.statusCode}: Failed to fetch package data`),
          );
          return;
        }

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            reject(
              new Error(
                `Failed to parse npm registry response: ${err.message}`,
              ),
            );
          }
        });
      })
      .on("error", (err) => {
        reject(new Error(`Failed to fetch package data: ${err.message}`));
      });
  });
}

/**
 * Determine the appropriate dist-tag
 */
function determineTag(packageVersion, publishedVersions) {
  // Check if this is a prerelease
  const prereleaseInfo = prerelease(packageVersion);

  if (prereleaseInfo && prereleaseInfo.length > 0) {
    // Return the prerelease identifier (e.g., "beta", "alpha", "rc")
    const prereleaseTag = prereleaseInfo[0].toString();
    return prereleaseTag;
  }

  // Get all stable (non-prerelease) versions
  const stableVersions = publishedVersions.filter((v) => !prerelease(v));

  // If no stable versions exist, this is the first stable release
  if (stableVersions.length === 0) {
    return "latest";
  }

  // Find the highest stable version
  const highestStable = stableVersions.sort(rcompare)[0];

  // Compare current version with highest stable
  if (gt(packageVersion, highestStable)) {
    // This is the new latest version
    return "latest";
  } else {
    // This is a backport/patch for an older version
    const parsed = parse(packageVersion);
    return `${parsed.major}-${parsed.minor}-stable`;
  }
}

async function main() {
  try {
    // Fetch package data
    const packageData = await fetchPackageData(packageName);

    // Get all published versions
    const publishedVersions = Object.keys(packageData.versions || {});

    // Determine the tag
    const tag = determineTag(packageVersion, publishedVersions);

    // Output the tag (this is what will be captured by the CI)
    console.log(tag);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
