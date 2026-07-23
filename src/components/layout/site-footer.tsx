import Link from 'next/link'
import { Mail, MapPin, Truck } from 'lucide-react'

import { Logo } from '@/components/layout/logo'
import { Marquee } from '@/components/motion/marquee'
import { PaymentStrip } from '@/components/payment/payment-marks'
import { Container } from '@/components/ui/container'
import { addressLines, helpNav, legalNav, site } from '@/lib/site'

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
              and GM one-ton trucks. {site.name} is {site.ownerRole} from
              Tomball, Texas.
            </p>
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
          </div>
        </div>

        {/*
          The marks are how the emailed invoice can be settled, not a checkout.
          The caption has to carry that, so nobody reads the row as a promise
          that a card can be entered here.
        */}
        <div className="mt-12 flex flex-col gap-5 border-t border-ink/10 pt-9 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <h2 className="font-mono text-[0.7rem] font-bold tracking-[0.2em] text-slate uppercase">
              Ways to pay your invoice
            </h2>
            <p className="mt-2.5 text-[0.85rem] leading-relaxed text-graphite">
              No card details are taken on this site. You place the order, we
              confirm fitment, then email an invoice you can settle by card,
              Apple Pay, Google Pay or bank transfer.
            </p>
          </div>

          <PaymentStrip className="lg:shrink-0 lg:justify-end" />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ink/10 pt-7 text-[0.8rem] text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Independently owned and operated.
          </p>
          <p>
            {site.name} is a {site.businessType}, not an incorporated business.
            Vehicle and wheel brand names are used for fitment reference only.
          </p>
        </div>
      </Container>
    </footer>
  )
}
