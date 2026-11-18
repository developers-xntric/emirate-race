/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "node_modules", "payload", "dist", "bin", "loadEnv.js");
const source = fs.readFileSync(file, "utf8");
const broken = "import nextEnvImport from '@next/env';";
const fixed = "import * as nextEnvImport from '@next/env';";
if (source.includes(broken)) fs.writeFileSync(file, source.replace(broken, fixed));