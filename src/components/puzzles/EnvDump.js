import { createDir, createFile } from "../../data/filesystem";

export const injectEnvPuzzle = () => {
  // 1. Create the hidden application directory
  createDir("/var/www/nexus", "dev", "drwxr-xr-x");

  // 2. Inject the example/decoy config (visible to standard ls)
  createFile(
    "/var/www/nexus/config.example.js",
    "module.exports = {\n  port: 8080,\n  env: 'development',\n  db: 'localhost'\n};",
    "dev",
    "-rw-r--r--",
  );

  // 3. Inject the server script
  createFile(
    "/var/www/nexus/server.js",
    "const express = require('express');\nrequire('dotenv').config({ path: '.env.local' });\n\nconsole.log('Nexus App Initialized on port ' + process.env.PORT);\n// TODO: Ensure .env.local is added to .gitignore before pushing to production repo.",
    "dev",
    "-rw-r--r--",
  );

  // 4. Inject the .env.backup (Honeypot/Decoy)
  createFile(
    "/var/www/nexus/.env.backup",
    "PORT=8080\nNODE_ENV=production\nDB_HOST=10.0.0.5\nDB_PASS=legacy_db_pass_998\n# DEPRECATED FLAG CONFIG\n# PH0ENIX_FLAG=flag{legacy_system_compromised_do_not_use}",
    "root",
    "-rw-------",
    "Feb 10 14:22",
  );

  // 5. Inject the .env.local containing the fragmented real flag
  createFile(
    "/var/www/nexus/.env.local",
    "PORT=3000\nNODE_ENV=local\nDB_HOST=127.0.0.1\nDB_PASS=dev_test_123\n\n# --- DEV SECRETS ---\n# The flag is fragmented to prevent automated scraping\nPH0ENIX_PART_3=_exposed}\nPH0ENIX_PART_1=flag{environment\nPH0ENIX_PART_2=_variables",
    "dev",
    "-rw-r--r--",
    "Feb 19 11:45",
  );
};
