import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const webAppDir = path.join(root, "apps/web/src/app");

const portals = [
  {
    name: "student",
    prefix: "student",
    appDir: path.join(root, "apps/student/src/app"),
  },
  { name: "admin", prefix: "admin", appDir: path.join(root, "apps/admin/src/app") },
  { name: "tutor", prefix: "tutor", appDir: path.join(root, "apps/tutor/src/app") },
];

const ROUTE_FILES = new Set(["page.tsx", "layout.tsx", "route.ts", "loading.tsx"]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (ROUTE_FILES.has(entry.name)) files.push(full);
  }
  return files;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function relImport(fromDir, targetFile) {
  let rel = toPosix(path.relative(fromDir, targetFile));
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel.replace(/\.tsx?$/, "");
}

function parsePortalImports(source) {
  const imports = [];
  const re = /import\s+([\s\S]*?)\s+from\s+["']@\/([^"']+)["']/g;
  let m;
  while ((m = re.exec(source))) {
    imports.push({ spec: m[1].trim(), target: m[2] });
  }
  return imports;
}

function rewritePortalImports(source, portalName, outDir) {
  const portalSrc = path.join(root, "apps", portalName, "src");
  return source.replace(/from\s+["']@\/([^"']+)["']/g, (_, target) => {
    const targetBase = path.join(portalSrc, target);
    const ext = [".tsx", ".ts", ".css"].find((e) =>
      fs.existsSync(targetBase + e),
    );
    const resolved = ext ? targetBase + ext : targetBase;
    return `from "${relImport(outDir, resolved)}"`;
  });
}

function generatePageModule(sourceFile, portalName, outFile) {
  const source = fs.readFileSync(sourceFile, "utf8");
  const outDir = path.dirname(outFile);
  const portalImports = parsePortalImports(source);

  if (portalImports.length === 0) {
    const rel = relImport(outDir, sourceFile);
    return `export { default } from "${rel}";\nexport * from "${rel}";\n`;
  }

  if (portalImports.length === 1) {
    const { spec, target } = portalImports[0];
    const isViewImport = target.startsWith("views/");
    if (isViewImport && /^\{\s*\w+\s*\}$/.test(spec)) {
      const viewName = spec.match(/^\{\s*(\w+)\s*\}$/)?.[1];
      const portalSrc = path.join(root, "apps", portalName, "src");
      const targetFile = path.join(portalSrc, target);
      const ext = [".tsx", ".ts"].find((e) => fs.existsSync(targetFile + e));
      const resolved = ext ? targetFile + ext : targetFile;
      const rel = relImport(outDir, resolved);
      const client = source.trimStart().startsWith('"use client"') ? '"use client";\n\n' : "";
      return `${client}import { ${viewName} } from "${rel}";\n\nexport default function Page() {\n  return <${viewName} />;\n}\n`;
    }
  }

  return rewritePortalImports(source, portalName, outDir);
}

function generateLayoutModule(sourceFile, portalName, outFile) {
  const source = fs.readFileSync(sourceFile, "utf8");
  const portalSrc = path.join(root, "apps", portalName, "src");
  const outDir = path.dirname(outFile);

  return rewritePortalImports(source, portalName, outDir).replace(
    /import\s+["']\.\/globals\.css["']/g,
    () => {
      const globalsFile = path.join(portalSrc, "app/globals.css");
      return `import "${relImport(outDir, globalsFile)}"`;
    },
  );
}

function clearGeneratedAppDir() {
  if (fs.existsSync(webAppDir)) {
    fs.rmSync(webAppDir, { recursive: true, force: true });
  }
  fs.mkdirSync(webAppDir, { recursive: true });
}

function main() {
  clearGeneratedAppDir();

  for (const { name, prefix, appDir } of portals) {
    const files = walk(appDir);
    for (const sourceFile of files) {
      const relWithinApp = path.relative(appDir, sourceFile);
      const outFile = path.join(
        webAppDir,
        prefix ? path.join(prefix, relWithinApp) : relWithinApp,
      );
      fs.mkdirSync(path.dirname(outFile), { recursive: true });

      const base = path.basename(sourceFile);
      let content;
      if (base === "layout.tsx") {
        content = generateLayoutModule(sourceFile, name, outFile);
      } else if (base === "page.tsx") {
        content = generatePageModule(sourceFile, name, outFile);
      } else if (base === "route.ts") {
        const rel = relImport(path.dirname(outFile), sourceFile);
        content = `export * from "${rel}";\n`;
      } else {
        const rel = relImport(path.dirname(outFile), sourceFile);
        content = `export { default } from "${rel}";\nexport * from "${rel}";\n`;
      }

      fs.writeFileSync(outFile, content);
    }
  }

  fs.writeFileSync(
    path.join(webAppDir, "page.tsx"),
    `import { redirect } from "next/navigation";

export default function SiteRootPage() {
  redirect("/student/signup");
}
`,
  );

  console.log("Generated unified web routes in apps/web/src/app");
}

main();
