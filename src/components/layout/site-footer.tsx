import Link from 'next/link'
import { Mail, MapPin, Truck } from 'lucide-react'

import { Logo } from '@/components/layout/logo'
import { Marquee } from '@/components/motion/marquee'
import { Container } from '@/components/ui/container'
import { addressLines, helpNav, legalNav, site, socialLinks } from '@/lib/site'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t-2 border-ink bg-cream">
      <div className="overflow-hidden border-b border-ink/10 py-6">
        <Marquee speed="slow" itemClassName="gap-8 pr-8">
          {['DUALLY WHEELS', 'FREE FREIGHT', 'TOMBALL, TX', 'RATED HEAVY'].map(
            (word) => (
              <span
                key={word}
                className="font-display text-5xl font-extrabold tracking-tight whitespace-nowrap text-ink/10 sm:text-7xl"
              >
                {word}{' '}
                <span aria-hidden="true" className="text-volt/25">
                  ✦
                </span>
              </span>
            )
          )}
        </Marquee>
      </div>

      <Container size="wide" className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-slate">
              {site.tagline} Heavy-duty six-piece dually wheel sets for Ford, RAM
              and GM one-ton trucks — {site.ownerRole} from Tomball, Texas.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-ink px-4 py-2 font-mono text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-transform duration-200 hover:-translate-y-0.5 hover:bg-lime"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Shop">
            <h2 className="font-mono text-[0.7rem] font-bold tracking-[0.2em] text-slate uppercase">
              Shop
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {helpNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.95rem] font-medium text-graphite underline-offset-4 transition-colors hover:text-volt-deep hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="font-mono text-[0.7rem] font-bold tracking-[0.2em] text-slate uppercase">
              Legal
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {legalNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.95rem] font-medium text-graphite underline-offset-4 transition-colors hover:text-volt-deep hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[0.7rem] font-bold tracking-[0.2em] text-slate uppercase">
              Get in touch
            </h2>

            <address className="mt-5 flex flex-col gap-4 text-[0.95rem] not-italic">
              <a
                href={`mailto:${site.email}`}
                className="flex items-start gap-3 font-medium text-graphite transition-colors hover:text-volt-deep"
              >
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-volt"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
                {site.email}
              </a>

              <span className="flex items-start gap-3 text-slate">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-volt"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
                <span className="flex flex-col">
                  {addressLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </span>

              <span className="flex items-start gap-3 text-slate">
                <Truck
                  className="mt-0.5 h-4 w-4 shrink-0 text-volt"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
                Free freight across the lower 48
              </span>
            </address>

            <p className="mt-5 rounded-2xl bg-volt-soft px-4 py-3 text-[0.8rem] leading-relaxed text-volt-deep">
              No card details are ever collected on this site. You place the
              order, we confirm fitment, then send an invoice with a secure
              payment link.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/10 pt-7 text-[0.8rem] text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Independently owned and operated.
          </p>
          <p>
            {site.name} is a {site.businessType} — not an incorporated business.
            Vehicle and wheel brand names are used for fitment reference only.
          </p>
        </div>
      </Container>
    </footer>
  )
}
