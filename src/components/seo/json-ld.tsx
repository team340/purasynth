import { safeJsonLd } from '@/lib/utils'

interface JsonLdProps {
  readonly data: Record<string, unknown> | readonly Record<string, unknown>[]
}

/**
 * Render structured data. Serialised through `safeJsonLd`, which escapes `<`
 * so a value containing `</script>` cannot break out of the tag.
 */
export function JsonLd({ data }: JsonLdProps) {
  const blocks = Array.isArray(data) ? data : [data]

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(block) }}
        />
      ))}
    </>
  )
}
