import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, posix } from "node:path";

const ROOT = process.cwd();
const README_PATH = join(ROOT, "README.md");
const SRC_PATH = join(ROOT, "src");

function sortEntries(a, b) {
  // Keep files before directories at each level to mirror the current README style.
  if (a.isDirectory !== b.isDirectory) {
    return a.isDirectory ? 1 : -1;
  }
  return a.name.localeCompare(b.name, "en");
}

function readTree(dirPath, relPath = "") {
  const names = readdirSync(dirPath, { withFileTypes: true })
    .map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      absPath: join(dirPath, entry.name),
      relPath: relPath ? posix.join(relPath, entry.name) : entry.name,
    }))
    .sort(sortEntries);

  return names.map((entry) => {
    if (!entry.isDirectory) {
      return {
        name: entry.name,
        isDirectory: false,
        children: [],
      };
    }

    return {
      name: entry.name,
      isDirectory: true,
      children: readTree(entry.absPath, entry.relPath),
    };
  });
}

function renderTree(nodes, prefix = "") {
  return nodes.flatMap((node, index) => {
    const isLast = index === nodes.length - 1;
    const branch = isLast ? "└── " : "├── ";
    const nextPrefix = prefix + (isLast ? "    " : "│   ");
    const label = `${prefix}${branch}${node.name}${node.isDirectory ? "/" : ""}`;

    if (!node.isDirectory || node.children.length === 0) {
      return [label];
    }

    return [label, ...renderTree(node.children, nextPrefix)];
  });
}

function buildStructureBlock() {
  if (!statSync(SRC_PATH).isDirectory()) {
    throw new Error("src directory was not found.");
  }

  const tree = readTree(SRC_PATH);
  const lines = ["src/", ...renderTree(tree)];
  return ["```", ...lines, "```"].join("\n");
}

function updateReadmeStructure(readmeContent, structureBlock) {
  const structureSectionRegex = /(## Project Structure[\s\S]*?)(```\s*\r?\nsrc\/[\s\S]*?```)/;
  const match = readmeContent.match(structureSectionRegex);

  if (!match) {
    throw new Error("Could not find '## Project Structure' code block in README.md");
  }

  return readmeContent.replace(structureSectionRegex, `$1${structureBlock}`);
}

const originalReadme = readFileSync(README_PATH, "utf8");
const updatedReadme = updateReadmeStructure(originalReadme, buildStructureBlock());

if (updatedReadme !== originalReadme) {
  writeFileSync(README_PATH, updatedReadme, "utf8");
  console.log("README project structure updated.");
} else {
  console.log("README project structure already up to date.");
}
