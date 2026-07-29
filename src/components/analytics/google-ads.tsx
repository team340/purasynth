import Script from 'next/script'

import { GOOGLE_ADS_ID } from '@/lib/google-ads'

/**
 * The Google Ads global site tag (gtag.js).
 *
 * `next/script` with `afterInteractive` rather than a raw <script> tag: Next
 * owns script injection in the App Router, and hand-written tags in a layout
 * can be re-executed on client navigations. This loads once, after hydration,
 * so it never blocks first paint on a page whose whole point is being quick.
 *
 * The inline block needs an `id`. Next uses it to dedupe, and without one the
 * config call can run more than once and double-count a pageview.
 *
 * What this does, stated plainly because the policy pages have to match it:
 * it loads a third-party script from googletagmanager.com, sets Google
 * advertising cookies, and reports pageviews to the Ads account so campaigns
 * can be measured and remarketing audiences built.
 */
export function GoogleAdsTag() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  )
}
