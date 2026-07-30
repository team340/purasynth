/**
 * Google Ads tag configuration.
 *
 * The tag ID is not a secret. It ships in the HTML of every page by design, so
 * it lives here as a plain constant rather than an environment variable: a
 * missing env var would silently disable tracking in production and the first
 * sign of it would be a month of unattributed ad spend.
 *
 * NOTE ON PRIVACY: loading this tag makes the site set advertising cookies and
 * share pageview data with Google for remarketing. The cookie policy and the
 * privacy policy both describe that, and they must stay in step with whatever
 * is configured here. If this tag is ever removed, those pages need updating
 * in the same commit.
 */

/** Google Ads conversion account. Public by design. */
export const GOOGLE_ADS_ID = 'AW-18346241886'

/**
 * The conversion action label for a placed order, e.g. `AbC-D_efG12h34ij567`.
 *
 * Google issues this per conversion action, and the base tag alone cannot
 * record a conversion without it. Find it in Google Ads under
 * Goals > Conversions > Summary > (your action) > Tag setup > Install manually.
 * The snippet there reads `send_to: 'AW-18346241886/THIS_PART'`.
 *
 * Left empty until that label exists. `hasConversionTracking()` gates the
 * event, so an empty value means no conversion is reported rather than a
 * malformed one being sent to the wrong destination.
 *
 * It must be Google's own opaque string. A human-readable name such as
 * 'page view' or the conversion action's title will not work: the value is
 * concatenated into `send_to` as `AW-18346241886/<label>`, and a destination
 * Google does not recognise is discarded silently. Nothing errors, nothing is
 * recorded, and the setup looks finished while measuring nothing.
 *
 * Also note this constant is only needed for the EVENT snippet route. A
 * page-load conversion configured with a URL rule in the Google Ads interface
 * is detected by the base tag on its own and needs no label and no code here,
 * so an empty value below does not necessarily mean conversions are off.
 */
export const ORDER_CONVERSION_LABEL = ''

export function hasConversionTracking(): boolean {
  return ORDER_CONVERSION_LABEL.trim().length > 0
}

/** Full `send_to` target, or null when no label is configured yet. */
export function orderConversionTarget(): string | null {
  return hasConversionTracking()
    ? `${GOOGLE_ADS_ID}/${ORDER_CONVERSION_LABEL.trim()}`
    : null
}
