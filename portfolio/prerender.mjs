// Step 3: write one static .html file per route into dist/corentin-gassien/
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(here, '../dist/corentin-gassien')
const ssrDir = path.join(here, '.ssr')
const BASE = '/corentin-gassien/'

const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
const { ROUTES, render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

for (const route of ROUTES) {
    const { head, html, lang } = render(route)
    const page = template
        .replace('__LANG__', lang)
        .replace('<!--head-->', head)
        .replace('<!--app-->', html)

    const file = path.join(outDir, route.path.slice(BASE.length), 'index.html')
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, page)
    console.log('  prerendered', route.path)
}

fs.rmSync(ssrDir, { recursive: true, force: true })
