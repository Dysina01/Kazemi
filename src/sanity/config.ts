import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./env";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "parnaz-portfolio",
  title: "Parnaz Kazemi Portfolio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});

