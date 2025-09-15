#!/usr/bin/env node

// Debug script to check module federation URLs
const https = require("https");
const http = require("http");

const remoteUrls = [
  "https://auth-8nq1b1tbv-arthur-marques-projects-08ec456b.vercel.app/assets/remoteEntry.js",
  "https://clients-1wbxdrugl-arthur-marques-projects-08ec456b.vercel.app/assets/remoteEntry.js",
  "https://design-system-five-hazel.vercel.app/assets/remoteEntry.js",
];

const checkUrl = (url) => {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;

    client
      .get(url, (res) => {
        console.log(`✓ ${url}`);
        console.log(`  Status: ${res.statusCode} ${res.statusMessage}`);
        console.log(`  Content-Type: ${res.headers["content-type"]}`);
        console.log(
          `  Access-Control-Allow-Origin: ${res.headers["access-control-allow-origin"]}`
        );
        console.log(`  Content-Length: ${res.headers["content-length"]}`);
        console.log("");
        resolve(true);
      })
      .on("error", (err) => {
        console.log(`✗ ${url}`);
        console.log(`  Error: ${err.message}`);
        console.log("");
        resolve(false);
      });
  });
};

async function main() {
  console.log("🔍 Checking Module Federation Remote Entries...\n");

  let allSuccessful = true;
  for (const url of remoteUrls) {
    const success = await checkUrl(url);
    if (!success) allSuccessful = false;
  }

  if (allSuccessful) {
    console.log("🎉 All remote entries are accessible!");
  } else {
    console.log(
      "❌ Some remote entries are not accessible. Check your deployments."
    );
  }
}

main().catch(console.error);
