import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getFirstModuleRoute, getParcours, parcours } from '../src/config/parcours.js';
import { parcoursSidebar } from '../src/config/navigation/parcours.js';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = join(siteRoot, 'src/content/docs');
const expectedIds = ['bonheur', 'stress', 'sommeil', 'relations', 'sante', 'esprit'];
const expectedNavigationLabels = [
  '😊 Être plus heureux',
  '😰 Gérer le stress',
  '😴 Améliorer le sommeil',
  '👥 Relations sociales',
  '💪 Renforcer la santé',
  "🧠 Comprendre l'esprit",
];
const errors = [];
const seenIds = new Set();
const routeOwners = new Map();

function fail(message) {
  errors.push(message);
}

function contentCandidates(link) {
  const route = link.replace(/^\//, '').replace(/\/$/, '');
  return [
    join(docsRoot, `${route}.md`),
    join(docsRoot, `${route}.mdx`),
    join(docsRoot, route, 'index.md'),
    join(docsRoot, route, 'index.mdx'),
  ];
}

if (parcours.length !== expectedIds.length) {
  fail(`Expected ${expectedIds.length} parcours, found ${parcours.length}.`);
}

if (parcours.map(({ id }) => id).join(',') !== expectedIds.join(',')) {
  fail(`Expected parcours IDs in order: ${expectedIds.join(', ')}.`);
}

for (const entry of parcours) {
  if (typeof entry.id !== 'string' || entry.id.trim() === '') {
    fail('Every parcours must have a non-empty string ID.');
    continue;
  }

  if (seenIds.has(entry.id)) {
    fail(`Duplicate parcours ID: "${entry.id}".`);
  }
  seenIds.add(entry.id);

  for (const field of ['title', 'icon', 'description', 'color']) {
    if (typeof entry[field] !== 'string' || entry[field].trim() === '') {
      fail(`Parcours "${entry.id}" has an empty ${field}.`);
    }
  }

  if (
    entry.metaDescription !== undefined &&
    (typeof entry.metaDescription !== 'string' || entry.metaDescription.trim() === '')
  ) {
    fail(`Parcours "${entry.id}" has an invalid metaDescription.`);
  }

  if (!Array.isArray(entry.modules) || entry.modules.length !== 6) {
    fail(`Parcours "${entry.id}" must contain exactly 6 modules.`);
    continue;
  }

  const localLinks = new Set();
  entry.modules.forEach((module, index) => {
    const position = index + 1;
    if (typeof module.title !== 'string' || module.title.trim() === '') {
      fail(`Parcours "${entry.id}" module ${position} has an empty title.`);
    }
    if (typeof module.link !== 'string' || module.link.trim() === '') {
      fail(`Parcours "${entry.id}" module ${position} has an empty link.`);
      return;
    }

    if (!/^\/[a-z0-9][a-z0-9/-]*\/?$/i.test(module.link) || module.link.startsWith('//')) {
      fail(
        `Parcours "${entry.id}" module ${position} has an invalid internal link: "${module.link}".`
      );
    }
    if (localLinks.has(module.link)) {
      fail(`Parcours "${entry.id}" repeats module link "${module.link}".`);
    }
    localLinks.add(module.link);

    const owner = routeOwners.get(module.link);
    if (owner) {
      fail(`Module route "${module.link}" is owned by both "${owner}" and "${entry.id}".`);
    } else {
      routeOwners.set(module.link, entry.id);
    }

    if (!contentCandidates(module.link).some(existsSync)) {
      fail(`Parcours "${entry.id}" module route has no matching content file: "${module.link}".`);
    }
  });

  if (getParcours(entry.id) !== entry) {
    fail(`getParcours("${entry.id}") does not return its canonical entry.`);
  }
  if (getFirstModuleRoute(entry) !== entry.modules[0]?.link) {
    fail(`Parcours "${entry.id}" first module route does not match its first module.`);
  }

  const pagePath = join(siteRoot, 'src/pages/parcours', `${entry.id}.astro`);
  if (!existsSync(pagePath)) {
    fail(`Missing parcours page for "${entry.id}": ${pagePath}`);
  } else {
    const page = readFileSync(pagePath, 'utf8');
    if (!page.includes(`getParcours('${entry.id}')`)) {
      fail(`Page "${entry.id}.astro" does not resolve getParcours('${entry.id}').`);
    }
    if (!page.includes('modules={parcours.modules}')) {
      fail(`Page "${entry.id}.astro" does not consume canonical modules.`);
    }
    if (!page.includes('link: getFirstModuleRoute(parcours)')) {
      fail(`Page "${entry.id}.astro" does not consume the derived first module route.`);
    }
    if (/description\s*=\s*["']/.test(page)) {
      fail(`Page "${entry.id}.astro" redeclares description as a literal.`);
    }

    const canonicalDescriptionExpression = entry.metaDescription
      ? 'description={parcours.metaDescription ?? parcours.description}'
      : 'description={parcours.description}';
    if (!page.includes(canonicalDescriptionExpression)) {
      fail(
        `Page "${entry.id}.astro" must use canonical description expression: ${canonicalDescriptionExpression}.`
      );
    }
  }
}

try {
  getParcours('__unknown_parcours__');
  fail('getParcours must throw for an unknown ID.');
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes('__unknown_parcours__')) {
    fail('getParcours unknown-ID error must name the rejected ID.');
  }
}

const actualNavigationLabels = parcoursSidebar.items.map(({ label }) => label);
if (actualNavigationLabels.join('\n') !== expectedNavigationLabels.join('\n')) {
  fail('Parcours navigation labels or order changed unexpectedly.');
}

parcoursSidebar.items.forEach((item, index) => {
  const expectedLink = `/parcours/${expectedIds[index]}`;
  if (item.link !== expectedLink) {
    fail(`Navigation item ${index + 1} should link to "${expectedLink}", found "${item.link}".`);
  }
});

const homepageGridPath = join(siteRoot, 'src/components/ParcoursGrid.astro');
const homepageGrid = readFileSync(homepageGridPath, 'utf8');
if (!homepageGrid.includes("import { parcours } from '../config/parcours.js'")) {
  fail('ParcoursGrid must consume the canonical parcours collection.');
}

if (errors.length > 0) {
  console.error(`Parcours contract check failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Parcours contract valid: ${parcours.length} parcours, ${routeOwners.size} unique modules, all routes resolved.`
);
