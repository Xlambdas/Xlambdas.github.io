import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Dev-only seed export plugin
function seedExportPlugin() {
    return {
        name: 'seed-export',
        configureServer(server: any) {
            server.middlewares.use('/api/export-seed', (req: any, res: any) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405
                    res.end('Method not allowed')
                    return
                }
                let body = ''
                req.on('data', (chunk: any) => { body += chunk })
                req.on('end', () => {
                    try {
                        const data = JSON.parse(body)
                        const dataDir = path.resolve(__dirname, 'src/pages/poise/data')

                        // exercises.ts — seed + custom merged, all marked isCustom: false
                        const exercises = data.exercises.map((e: any) => ({ ...e, isCustom: false }))
                        fs.writeFileSync(
                            path.join(dataDir, 'exercises.ts'),
                            `import type { Exercise } from '../types/exercise'\n\nexport const SEED_EXERCISES: Exercise[] = ${JSON.stringify(exercises, null, 2)}\n`
                        )

                        // sessions.ts — seed + custom merged
                        const sessions = data.sessions.map((s: any) => ({ ...s, isCustom: false }))
                        fs.writeFileSync(
                            path.join(dataDir, 'sessions.ts'),
                            `import type { Session } from '../types/session'\n\nexport const SEED_SESSIONS: Session[] = ${JSON.stringify(sessions, null, 2)}\n`
                        )

                        // routines.ts — seed + custom merged
                        const routines = data.routines.map((r: any) => ({ ...r, isCustom: false }))
                        fs.writeFileSync(
                            path.join(dataDir, 'routines.ts'),
                            `import type { Routine } from '../types/routine'\n\nexport const SEED_ROUTINES: Routine[] = ${JSON.stringify(routines, null, 2)}\n`
                        )

                        // userData.json — user state only
                        fs.writeFileSync(
                            path.join(dataDir, 'userData.json'),
                            JSON.stringify({
                                exportedAt: data.exportedAt,
                                calendarEvents: data.calendarEvents,
                                dailyRoutineConfigs: data.dailyRoutineConfigs,
                                runConfigs: data.runConfigs,
                                sessionFeedbacks: data.sessionFeedbacks,
                                preferences: data.preferences,
                            }, null, 2)
                        )

                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, written: ['exercises.ts', 'sessions.ts', 'routines.ts', 'userData.json'] }))
                    } catch (e: any) {
                        res.statusCode = 500
                        res.end(JSON.stringify({ error: e.message }))
                    }
                })
            })
        }
    }
}


// --- PWA ---

import { VitePWA } from 'vite-plugin-pwa'

// Inside defineConfig plugins array, add:
VitePWA({
    registerType: 'autoUpdate',
    scope: '/sandbox/poise/',
    base: '/sandbox/poise/',
    manifest: {
        name: 'Poise',
        short_name: 'Poise',
        description: 'Personal fitness training — sessions, routines, calendar',
        start_url: '/sandbox/poise/',
        scope: '/sandbox/poise/',
        display: 'standalone',
        background_color: '#0D0D0D',
        theme_color: '#0D0D0D',
        orientation: 'portrait',
        icons: [
            {
                src: '/sandbox/poise/icons/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable',
            },
            {
                src: '/sandbox/poise/icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
    },
    workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: null,
        // Only cache requests under /sandbox/poise/
        navigateFallbackAllowlist: [/^\/sandbox\/poise/],
        runtimeCaching: [
            {
                urlPattern: /^\/sandbox\/poise\/.*/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'poise-runtime',
                    expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
                },
            },
        ],
    },
})



// --- general ---

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), seedExportPlugin()],
    base: '/'
})
