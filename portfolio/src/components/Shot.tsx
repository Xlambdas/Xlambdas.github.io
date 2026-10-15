import type { Shot as ShotType } from '../content/types'

export function Shot({ shot, eager = false }: { shot: ShotType; eager?: boolean }) {
    return (
        <figure className="shot">
            <img
                src={shot.src}
                width={shot.width}
                height={shot.height}
                alt={shot.alt}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
            />
            {shot.caption && <figcaption>{shot.caption}</figcaption>}
        </figure>
    )
}
