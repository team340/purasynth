import { ImageResponse } from 'next/og'

/**
 * Favicon — the wheel glyph from `components/layout/logo.tsx`, redrawn with
 * plain boxes because ImageResponse renders a small CSS subset and no SVG.
 * Ratios are lifted straight from the 48-unit viewBox in that file so the tab
 * icon and the header logo stay the same shape.
 */

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

const RING = 0.6875
const HUB = 0.3542
const CENTER = 0.1333
const LUG = 0.0479
const LUG_ORBIT = 0.1229
const LUG_ANGLES: readonly number[] = [0, 45, 90, 135, 180, 225, 270, 315]

export default function Icon() {
  const box = size.width
  const lug = Math.max(box * LUG, 1)
  const orbit = box * LUG_ORBIT

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: '#0b0b12',
          borderRadius: box,
        }}
      >
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            width: box * RING,
            height: box * RING,
            borderRadius: box,
            borderWidth: Math.max(box * 0.05, 1),
            borderStyle: 'dashed',
            borderColor: '#c8ff2e',
          }}
        />
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            width: box * HUB,
            height: box * HUB,
            borderRadius: box,
            background: '#6b3bff',
          }}
        />
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            width: box * CENTER,
            height: box * CENTER,
            borderRadius: box,
            background: '#ffffff',
          }}
        />
        {LUG_ANGLES.map((angle) => {
          const radians = (angle * Math.PI) / 180

          return (
            <div
              key={angle}
              style={{
                position: 'absolute',
                display: 'flex',
                width: lug,
                height: lug,
                borderRadius: box,
                background: '#ffffff',
                left: box / 2 + Math.cos(radians) * orbit - lug / 2,
                top: box / 2 + Math.sin(radians) * orbit - lug / 2,
              }}
            />
          )
        })}
      </div>
    ),
    { ...size }
  )
}
