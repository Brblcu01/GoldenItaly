export type AnalyticsEvent =
  | 'click_phone'
  | 'click_directions'
  | 'click_menu'
  | 'click_tripadvisor'
  | 'click_reservation'
  | 'view_contact_section'

type AnalyticsAdapter = {
  track: (event: AnalyticsEvent, properties?: Record<string, string>) => void
}

declare global {
  interface Window {
    goldenItalyAnalytics?: AnalyticsAdapter
  }
}

function emit(event: AnalyticsEvent, properties?: Record<string, string>) {
  window.goldenItalyAnalytics?.track(event, properties)
}

export function initAnalyticsAdapter() {
  const onClick = (event: MouseEvent) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('[data-analytics-event]')
    const eventName = target?.dataset.analyticsEvent as AnalyticsEvent | undefined
    if (eventName) emit(eventName, { path: window.location.pathname })
  }
  document.addEventListener('click', onClick)

  const contacts = document.querySelectorAll<HTMLElement>('[data-contact-section]')
  const seen = new WeakSet<Element>()
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || seen.has(entry.target)) continue
      seen.add(entry.target)
      emit('view_contact_section', { path: window.location.pathname })
      observer.unobserve(entry.target)
    }
  }, { threshold: .35 })
  contacts.forEach((element) => observer.observe(element))

  return () => {
    document.removeEventListener('click', onClick)
    observer.disconnect()
  }
}
