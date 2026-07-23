import { ImageResponse } from 'next/og'

/**
 * Home-screen icon for iOS. Same wheel glyph as `icon.tsx`, but sitting on a
 * paper square rather than bleeding to the edge — iOS masks the corners itself
 * and composites transparency onto black, which would put a dark ring around
 * a full-bleed ink circle.
 */

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const WHEEL = 144
const RING = 0.6875
const HUB = 0.3542
const CENTER = 0.1333
const LUG = 0.0479
const LUG_ORBIT = 0.1229
const LUG_ANGLES: readonly number[] = [0, 45, 90, 135, 180, 225, 270, 315]

export default function AppleIcon() {
  const lug = WHEEL * LUG
  const orbit = WHEEL * LUG_ORBIT

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            width: WHEEL,
            height: WHEEL,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: '#0b0b12',
            borderRadius: WHEEL,
          }}
        >
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              width: WHEEL * RING,
              height: WHEEL * RING,
              borderRadius: WHEEL,
              borderWidth: WHEEL * 0.05,
              borderStyle: 'dashed',
              borderColor: '#c8ff2e',
            }}
          />
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              width: WHEEL * HUB,
              height: WHEEL * HUB,
              borderRadius: WHEEL,
              background: '#6b3bff',
            }}
          />
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              width: WHEEL * CENTER,
              height: WHEEL * CENTER,
              borderRadius: WHEEL,
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
                  borderRadius: WHEEL,
                  background: '#ffffff',
                  left: WHEEL / 2 + Math.cos(radians) * orbit - lug / 2,
                  top: WHEEL / 2 + Math.sin(radians) * orbit - lug / 2,
                }}
              />
            )
          })}
        </div>
      </div>
    ),
    { ...size }
  )
}
