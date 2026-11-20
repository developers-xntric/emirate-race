import { loadEnvConfig } from "@next/env";
import path from "node:path";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import { CmsDocuments } from "./src/payload/collections/CmsDocuments";
import { Media } from "./src/payload/collections/Media";
import { Submissions } from "./src/payload/collections/Submissions";
import { Users } from "./src/payload/collections/Users";

const root = process.cwd();
loadEnvConfig(root);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "development-secret-change-me",
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(root, "src"), importMapFile: path.resolve(root, "src", "app", "(payload)", "admin", "importMap.ts") },
    components: {
      beforeNavLinks: ["@/payload/components/AnalyticsNavigation", "@/payload/components/PageNavigation"],
      views: {
        analytics: {
          Component: "@/payload/components/AnalyticsDashboard",
          path: "/analytics",
        },
      },
    },
    livePreview: { breakpoints: [{ label: "Mobile", name: "mobile", width: 375, height: 667 }, { label: "Desktop", name: "desktop", width: 1440, height: 900 }] },
  },
  collections: [Users, Media, CmsDocuments, Submissions],
  db: postgresAdapter({
    // Do not introspect/push the complete schema on every dev-server start.
    // The deployed Neon database is managed through Payload migrations.
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL,
      // Neon pooler connections can be closed while the dev server is idle.
      // Keep the pool deliberately small, detect failed connects quickly, and
      // rotate clients before a stale session reaches an admin request.
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10_000,
      maxLifetimeSeconds: 300,
    },
  }),
  typescript: { outputFile: path.resolve(root, "src", "payload-types.ts") },
});