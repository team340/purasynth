import { ImageResponse } from 'next/og'

import { site } from '@/lib/site'

/**
 * Default social card.
 *
 * Everything is drawn with boxes and text — ImageResponse renders a small CSS
 * subset with no access to the site's fonts, images or Tailwind tokens, so the
 * palette is repeated here as hex values. Light background, because the site
 * has no dark theme and a card should look like the page it links to.
 */

export const alt = `${site.name}: ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INK = '#0b0b12'
const SLATE = '#55556a'
const VOLT = '#6b3bff'
const VOLT_SOFT = '#efe8ff'
const LIME = '#c8ff2e'
const CORAL = '#ff5a3c'

export default function OpengraphImage() {
  // Built up front: a single text child keeps Satori from laying each
  // interpolated fragment out as its own flex item.
  const strapline = `Dually wheel sets · ${site.address.locality}, ${site.address.region}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          padding: 72,
          background: 'linear-gradient(135deg, #ffffff 0%, #f1eefb 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Geometric accents. Purely decorative, so they sit behind the text. */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            top: -140,
            right: -110,
            width: 460,
            height: 460,
            borderRadius: 460,
            background: VOLT_SOFT,
          }}
        />
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            top: 96,
            right: 118,
            width: 250,
            height: 250,
            borderRadius: 250,
            borderWidth: 14,
            borderStyle: 'solid',
            borderColor: LIME,
          }}
        />
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            bottom: -90,
            left: -70,
            width: 300,
            height: 300,
            borderRadius: 90,
            background: LIME,
            opacity: 0.35,
            transform: 'rotate(24deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            bottom: 128,
            right: 96,
            width: 96,
            height: 96,
            borderRadius: 96,
            background: CORAL,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 56,
              padding: '0 28px',
              borderRadius: 56,
              background: INK,
              color: '#ffffff',
              fontSize: 22,
              letterSpacing: 4,
            }}
          >
            INDEPENDENTLY RUN
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 56,
              padding: '0 28px',
              borderRadius: 56,
              background: VOLT_SOFT,
              color: VOLT,
              fontSize: 22,
              letterSpacing: 4,
            }}
          >
            FREE FREIGHT · LOWER 48
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 168,
              lineHeight: 1,
              letterSpacing: -8,
              color: INK,
            }}
          >
            PURASYNTH
          </div>
          <div style={{ display: 'flex', fontSize: 46, color: SLATE }}>
            {site.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              width: 20,
              height: 20,
              borderRadius: 20,
              background: VOLT,
            }}
          />
          <div style={{ display: 'flex', fontSize: 30, color: INK, letterSpacing: 1 }}>
            {strapline}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
