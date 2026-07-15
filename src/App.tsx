import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode, type RefObject } from 'react'
import { ArrowDown, ArrowUpRight, Clock, MapPin, Menu, Phone, Quote, Star, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { faqItems } from './data/faq'
import { featuredDishes, menuLastUpdated, menuSections } from './data/menu'
import { interiors, media, restaurant, restaurantAddress, restaurantLinks } from './data/restaurant'
import { reviews } from './data/reviews'
import { getRoute } from './seo/routes'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
ScrollTrigger.config({ ignoreMobileResize: true })
const useSafeLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function reloadLandingPage(event: ReactMouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  const homeUrl = new URL('/', window.location.origin)
  homeUrl.searchParams.set('__refresh', Date.now().toString())
  window.location.replace(homeUrl.toString())
}

function useManagedVideoPlayback(videoRef: RefObject<HTMLVideoElement>, enabled: boolean) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const rect = video.getBoundingClientRect()
    let visible = rect.bottom > 0 && rect.top < window.innerHeight

    const syncPlayback = () => {
      if (enabled && visible && !document.hidden) void video.play().catch(() => undefined)
      else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > .08
      syncPlayback()
    }, { threshold: [0, .08, .25] })

    observer.observe(video)
    document.addEventListener('visibilitychange', syncPlayback)
    syncPlayback()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      video.pause()
    }
  }, [videoRef, enabled])
}

function useSmoothAnchorNavigation(scope: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = scope.current
    if (!root) return
    const pendingHashKey = 'golden-italy:pending-anchor'
    let navigationTimer = 0
    let scrollTween: gsap.core.Tween | null = null

    const normalizePath = (pathname: string) => pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}/`
    const scrollToHash = (hash: string, pathname = window.location.pathname) => {
      if (!hash || hash === '#') return false
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (!target) return false
      scrollTween?.kill()
      const destination = Math.max(0, target.getBoundingClientRect().top + window.scrollY)
      const distance = Math.abs(destination - window.scrollY)
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      scrollTween = gsap.to(window, {
        scrollTo: { y: destination, autoKill: false },
        duration: reduceMotion ? .55 : gsap.utils.clamp(1.05, 1.65, distance / 1100),
        ease: reduceMotion ? 'power1.inOut' : 'power3.inOut',
        overwrite: true,
        onComplete: () => {
          scrollTween = null
          window.history.replaceState(null, '', `${pathname}${hash}`)
        },
      })
      return true
    }

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]')
      if (!anchor || !root.contains(anchor)) return
      const destinationUrl = new URL(anchor.href, window.location.href)
      if (destinationUrl.origin !== window.location.origin) return
      const hash = destinationUrl.hash
      if (!hash || hash === '#') return
      const fromMobileMenu = window.matchMedia('(max-width: 960px)').matches && Boolean(anchor.closest('.main-nav'))

      if (normalizePath(destinationUrl.pathname) !== normalizePath(window.location.pathname)) {
        event.preventDefault()
        document.body.classList.remove('nav-open')
        window.sessionStorage.setItem(pendingHashKey, hash)
        navigationTimer = window.setTimeout(() => window.location.assign(destinationUrl.pathname), fromMobileMenu ? 260 : 0)
        return
      }

      if (!document.getElementById(decodeURIComponent(hash.slice(1)))) return
      event.preventDefault()
      document.body.classList.remove('nav-open')
      const navigate = () => scrollToHash(hash, destinationUrl.pathname)
      if (fromMobileMenu) navigationTimer = window.setTimeout(navigate, 260)
      else navigate()
    }

    const pendingHash = window.sessionStorage.getItem(pendingHashKey)
    const initialHash = pendingHash || window.location.hash
    if (initialHash) {
      navigationTimer = window.setTimeout(() => {
        if (scrollToHash(initialHash)) window.sessionStorage.removeItem(pendingHashKey)
      }, 120)
    }

    document.addEventListener('click', onClick, true)
    return () => {
      window.clearTimeout(navigationTimer)
      scrollTween?.kill()
      document.removeEventListener('click', onClick, true)
    }
  }, [scope])
}

function useCinematicMotion(scope: RefObject<HTMLElement>, enabled: boolean) {
  useSafeLayoutEffect(() => {
    if (!scope.current || !enabled) return
    let disposed = false
    let refreshFrame = 0
    const mm = gsap.matchMedia()

    mm.add({ isMobile: '(max-width: 768px)', isDesktop: '(min-width: 769px)', reduceMotion: '(prefers-reduced-motion: reduce)' }, (context) => {
      const { isMobile, reduceMotion } = context.conditions as { isMobile: boolean; reduceMotion: boolean }
      if (reduceMotion) {
        gsap.set('[data-reveal], [data-hero-line], .review-card, .dish-card, .footer-mark span', { clearProps: 'all' })
        return
      }

      const heroIntro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroIntro
        .from('.hero h1 [data-hero-line]', { yPercent: 108, duration: 1.05, stagger: .1 })
        .from('.hero-kicker, .hero-actions', { y: 16, duration: .65, stagger: .08 }, '-=.55')
        .eventCallback('onComplete', () => gsap.set('.hero h1 [data-hero-line], .hero-kicker, .hero-actions', { clearProps: 'transform' }))

      gsap.timeline({ scrollTrigger: { trigger: '.hero-push', start: 'top top', end: () => `+=${window.innerHeight}`, scrub: .8, invalidateOnRefresh: true } })
        .to('.hero-copy', { yPercent: isMobile ? 5 : 10, ease: 'none' }, 0)
        .to('.hero-shade', { opacity: .72, ease: 'none' }, 0)
        .to('.hero-index, .scroll-cue', { y: 22, opacity: 0, ease: 'none' }, 0)

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((node) => {
        if (node.closest('.table-overlay') || node.closest('.visit-panel') || node.closest('.room-copy') || node.closest('.dish-heading') || node.closest('.reviews-heading')) return
        gsap.from(node, { y: isMobile ? 24 : 38, duration: isMobile ? .72 : .95, ease: 'power3.out', immediateRender: true, onComplete: () => gsap.set(node, { clearProps: 'transform' }), scrollTrigger: { trigger: node, start: 'top 84%', once: true } })
      })

      const welcomeTimeline = gsap.timeline({ scrollTrigger: { trigger: '.welcome-gallery', start: 'top 78%', once: true } })
      welcomeTimeline
        .from('.welcome-exterior', { x: isMobile ? 0 : -42, y: isMobile ? 28 : 0, duration: 1, ease: 'power3.out', immediateRender: true })
        .from('.welcome-dining, .welcome-counter', { y: 38, duration: .85, stagger: .12, ease: 'power3.out', immediateRender: true }, '-=.62')
        .from('.welcome-gallery blockquote', { y: 30, duration: .8, ease: 'power3.out', immediateRender: true }, '-=.48')
        .from('.welcome-shot figcaption', { x: 18, duration: .5, stagger: .08, ease: 'power2.out', immediateRender: true }, '-=.5')
        .eventCallback('onComplete', () => gsap.set('.welcome-shot, .welcome-gallery blockquote, .welcome-shot figcaption', { clearProps: 'transform' }))

      gsap.from('.welcome-tags span', { y: 16, stagger: .08, duration: .58, ease: 'power2.out', immediateRender: true, onComplete: () => gsap.set('.welcome-tags span', { clearProps: 'transform' }), scrollTrigger: { trigger: '.welcome-tags', start: 'top 86%', once: true } })

      const dishHeadingTimeline = gsap.timeline({ scrollTrigger: { trigger: '.dish-heading', start: 'top 80%', once: true } })
      dishHeadingTimeline
        .from('.dish-heading > div', { y: 34, duration: .9, ease: 'power3.out', immediateRender: true })
        .from('.dish-heading > p', { y: 24, duration: .75, ease: 'power3.out', immediateRender: true }, '-=.5')
        .eventCallback('onComplete', () => gsap.set('.dish-heading > *', { clearProps: 'transform' }))

      gsap.utils.toArray<HTMLElement>('.dish-card').forEach((card, index) => {
        gsap.from(card, { x: isMobile ? 0 : index % 2 === 0 ? -34 : 34, y: isMobile ? 26 : 30, duration: .95, ease: 'power3.out', immediateRender: true, onComplete: () => gsap.set(card, { clearProps: 'transform' }), scrollTrigger: { trigger: card, start: 'top 82%', once: true } })
      })

      gsap.from('.footer-mark span', { yPercent: 14, stagger: .1, duration: 1, ease: 'power3.out', immediateRender: true, onComplete: () => gsap.set('.footer-mark span', { clearProps: 'transform' }), scrollTrigger: { trigger: 'footer', start: 'top 78%', once: true } })
      gsap.from('.footer-topline > *, .footer-directory > *, .footer-contact > *', { y: 20, stagger: .055, duration: .68, ease: 'power3.out', immediateRender: true, onComplete: () => gsap.set('.footer-topline > *, .footer-directory > *, .footer-contact > *', { clearProps: 'transform' }), scrollTrigger: { trigger: 'footer', start: 'top 78%', once: true } })
    }, scope.current)

    const refresh = () => {
      if (disposed) return
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    if (document.readyState === 'complete') refresh()
    else window.addEventListener('load', refresh, { once: true })
    void document.fonts?.ready.then(refresh)

    return () => {
      disposed = true
      cancelAnimationFrame(refreshFrame)
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [scope, enabled])
}

function useDeferredMedia(scope: RefObject<Element>, rootMargin = '320px') {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const element = scope.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setEnabled(true)
      observer.disconnect()
    }, { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [scope, rootMargin])
  return enabled
}

function Overline({ children }: { children: ReactNode }) {
  return <p className="overline" data-reveal><span aria-hidden="true" />{children}</p>
}

function Header({ isHome }: { isHome: boolean }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])
  const closeMenu = () => {
    document.body.classList.remove('nav-open')
    setOpen(false)
  }
  return (
    <header className="site-header">
      <a className="wordmark" href="/" onClick={reloadLandingPage} aria-label="Golden Italy, ricarica e torna alla homepage"><span>Golden</span><span>Italy</span></a>
      <button className="nav-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-nav"><span>{open ? 'Chiudi' : 'Esplora'}</span>{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'main-nav is-open' : 'main-nav'} id="main-nav" aria-label="Navigazione principale">
        <a href={isHome ? '#atmosfera' : '/#atmosfera'} onClick={closeMenu}>Atmosfera</a><a href="/menu/" onClick={closeMenu}>Menu</a><a href="/domande-frequenti/" onClick={closeMenu}>FAQ</a><a href="/contatti/" onClick={closeMenu}>Contatti</a>
        <a className="nav-reserve" href={restaurantLinks.phone} data-analytics-event="click_reservation" onClick={closeMenu}>Prenota <ArrowUpRight /></a>
      </nav>
      <noscript><nav className="noscript-nav" aria-label="Navigazione senza JavaScript"><a href="/">Home</a><a href="/menu/">Menu</a><a href="/domande-frequenti/">FAQ</a><a href="/contatti/">Contatti</a></nav></noscript>
    </header>
  )
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useManagedVideoPlayback(videoRef, true)
  return (
    <section className="hero" id="top" aria-label="Benvenuti da Golden Italy">
      <div className="hero-media">
        <picture className="hero-poster"><source media="(max-width: 640px)" srcSet={media.heroPosterMobile} /><img src={media.heroPoster} alt="L’ingresso illuminato di Golden Italy a Lido di Ostia" width="1264" height="720" {...{ fetchpriority: 'high' }} /></picture>
        <video ref={videoRef} className="hero-film" autoPlay muted loop playsInline preload="metadata" poster={media.heroPoster} aria-label="Atmosfera cinematografica di Golden Italy"><source media="(max-width: 640px)" src={media.heroMobileVideo} type="video/mp4" /><source src={media.heroVideo} type="video/mp4" /></video>
        <div className="hero-shade" />
      </div>
      <div className="hero-copy">
        <p className="hero-kicker" data-hero-meta>Ristorante di pesce · Pizzeria · Ostia centro</p>
        <h1><span className="line-mask"><span data-hero-line>Una tavola</span></span><span className="line-mask"><span data-hero-line>accesa nel cuore</span></span><span className="line-mask italic"><span data-hero-line>di Ostia.</span></span></h1>
        <p className="hero-support">{restaurant.description}</p>
        <div className="hero-actions" data-hero-meta><a className="pill pill-light" href={restaurantLinks.phone} data-analytics-event="click_reservation">Prenota un tavolo <ArrowUpRight /></a><a className="text-link" href="/menu/" data-analytics-event="click_menu">Scopri il menu <ArrowDown /></a></div>
      </div>
      <div className="hero-index" data-hero-meta><span>RM</span><span>Lido di Ostia</span></div>
      <div className="scroll-cue" aria-hidden="true"><span>Scorri</span><i /></div>
    </section>
  )
}

function Welcome() {
  return <section className="welcome section-pad" id="storia" aria-labelledby="ristorante-ostia-title">
      <div className="welcome-head">
        <div className="welcome-index"><Overline>Benvenuti a tavola</Overline><span className="section-no">01</span></div>
        <h2 id="ristorante-ostia-title" data-reveal>Ristorante di pesce<br />e pizzeria <em>a Ostia centro.</em></h2>
        <div className="welcome-copy" data-reveal><p>Golden Italy propone cucina italiana, pizza e primi di mare nel centro di Lido di Ostia. Per prenotare è possibile chiamare direttamente il ristorante; la pagina menu raccoglie in testo i piatti già presentati sul sito.</p><div className="welcome-tags"><span>Lido di Ostia</span>{restaurant.cuisines.map((cuisine) => <span key={cuisine}>{cuisine}</span>)}</div></div>
      </div>
      <div className="welcome-gallery" aria-label="Un primo sguardo a Golden Italy">
        <figure className="welcome-shot welcome-exterior"><div><img src={interiors.exterior.src} srcSet={`${interiors.exterior.small} 800w, ${interiors.exterior.src} 1672w`} sizes="(max-width: 640px) 100vw, 70vw" width={interiors.exterior.width} height={interiors.exterior.height} alt="L'ingresso illuminato di Golden Italy la sera" loading="lazy" decoding="async" /></div><figcaption>Corso Regina Maria Pia, 24</figcaption></figure>
        <figure className="welcome-shot welcome-dining"><div><img src={interiors.diningRoom.src} srcSet={`${interiors.diningRoom.small} 800w, ${interiors.diningRoom.src} 1448w`} sizes="(max-width: 640px) 50vw, 30vw" width={interiors.diningRoom.width} height={interiors.diningRoom.height} alt="La sala di Golden Italy pronta ad accogliere gli ospiti" loading="lazy" decoding="async" /></div><figcaption>La sala</figcaption></figure>
        <figure className="welcome-shot welcome-counter"><div><img src={interiors.serviceCounter.src} srcSet={`${interiors.serviceCounter.small} 800w, ${interiors.serviceCounter.src} 1448w`} sizes="(max-width: 640px) 50vw, 30vw" width={interiors.serviceCounter.width} height={interiors.serviceCounter.height} alt="Il banco in pietra al centro del ristorante" loading="lazy" decoding="async" /></div><figcaption>Dentro Golden Italy</figcaption></figure>
        <blockquote>Qui ogni serata comincia da un gesto semplice: <em>accomodarsi.</em></blockquote>
      </div>
    </section>
}

function Room() {
  const roomRef = useRef<HTMLElement>(null)
  useSafeLayoutEffect(() => {
    const section = roomRef.current
    if (!section) return
    const copy = section.querySelector<HTMLElement>('.room-copy')
    const visual = section.querySelector<HTMLElement>('.room-visual')
    const image = section.querySelector<HTMLElement>('.room-visual img')
    const caption = section.querySelector<HTMLElement>('.room-visual .caption')
    const wash = section.querySelector<HTMLElement>('.room-reveal-wash')
    const line = section.querySelector<HTMLElement>('.room-copy .overline > span')
    const animations: Animation[] = []
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const play = (target: HTMLElement | null, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      if (!target) return
      animations.push(target.animate(frames, options))
    }

    if (copy) {
      copy.style.transform = 'translate3d(-84px,0,0)'
      copy.style.filter = 'blur(16px)'
      copy.style.clipPath = 'inset(0 30% 0 0)'
    }
    if (visual) {
      visual.style.opacity = '0'
      visual.style.transform = 'translate3d(64px,0,0) scale(1.08)'
      visual.style.filter = 'blur(24px) brightness(.52) saturate(.58)'
      visual.style.clipPath = 'inset(10% 12% 10% 12%)'
    }
    if (image) {
      image.style.transform = 'scale(1.15)'
      image.style.filter = 'blur(11px)'
    }
    if (wash) wash.style.opacity = '1'
    if (caption) {
      caption.style.transform = 'translate3d(0,22px,0)'
      caption.style.filter = 'blur(8px)'
    }
    if (line) {
      line.style.transform = 'scaleX(0)'
      line.style.transformOrigin = 'left center'
    }

    const copyObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      copyObserver.disconnect()
      play(copy, [
          { transform: 'translate3d(-84px,0,0)', filter: 'blur(16px)', clipPath: 'inset(0 30% 0 0)' },
          { transform: 'translate3d(0,0,0)', filter: 'blur(0)', clipPath: 'inset(0 0 0 0)' },
        ], { duration: 1350, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' })
      play(line, [
        { transform: 'scaleX(0)', transformOrigin: 'left center' },
        { transform: 'scaleX(1)', transformOrigin: 'left center' },
      ], { duration: 650, delay: 220, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' })
    }, { threshold: .01, rootMargin: '0px 0px -8% 0px' })

    const visualObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      visualObserver.disconnect()
      play(visual, [
          { opacity: 0, transform: 'translate3d(64px,0,0) scale(1.08)', filter: 'blur(24px) brightness(.52) saturate(.58)', clipPath: 'inset(10% 12% 10% 12%)' },
          { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0) brightness(1) saturate(1)', clipPath: 'inset(0 0 0 0)' },
        ], { duration: 1650, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' })
        play(image, [
          { transform: 'scale(1.15)', filter: 'blur(11px)' },
          { transform: 'scale(1)', filter: 'blur(0)' },
        ], { duration: 1900, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' })
        play(wash, [
          { opacity: 1 },
          { opacity: 0 },
        ], { duration: 1550, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' })
        play(caption, [
          { transform: 'translate3d(0,22px,0)', filter: 'blur(8px)' },
          { transform: 'translate3d(0,0,0)', filter: 'blur(0)' },
        ], { duration: 850, delay: 820, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' })
    }, { threshold: .02, rootMargin: '0px 0px -5% 0px' })

    copyObserver.observe(section)
    visualObserver.observe(visual ?? section)
    return () => {
      copyObserver.disconnect()
      visualObserver.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [])
  return <section ref={roomRef} className="room section-pad" id="atmosfera"><div className="room-copy"><Overline>L’atmosfera</Overline><h2 data-reveal>Calore italiano,<br /><em>anima di mare.</em></h2><p data-reveal>Materiali avvolgenti, luce morbida, conversazioni che riempiono la stanza. Il nostro racconto parte dallo spazio e arriva alla tavola.</p></div><div className="room-visual image-window"><div className="scene scene-room"><img className="scene-photo dining-photo" src={interiors.diningRoom.src} srcSet={`${interiors.diningRoom.small} 800w, ${interiors.diningRoom.src} 1448w`} sizes="(max-width: 640px) 100vw, 58vw" width={interiors.diningRoom.width} height={interiors.diningRoom.height} alt="La sala interna di Golden Italy apparecchiata per la sera" loading="lazy" decoding="async" /></div><span className="room-reveal-wash" aria-hidden="true" /><span className="caption">La sala di Golden Italy</span></div></section>
}

function TableSection() {
  return <section className="table-story" id="tavola"><div className="table-sticky"><div className="table-scene"><img src={interiors.tableRitual.src} srcSet={`${interiors.tableRitual.small} 800w, ${interiors.tableRitual.src} 1672w`} sizes="100vw" width={interiors.tableRitual.width} height={interiors.tableRitual.height} alt="Una tavola di Golden Italy apparecchiata con piatti da condividere" loading="lazy" decoding="async" /></div><div className="table-overlay"><span className="section-no">02</span><div><Overline>Il rito della tavola</Overline><h2>Ogni dettaglio<br />prepara <em>l’incontro.</em></h2></div><p>La mise en place è il primo assaggio: semplice, luminosa, pronta ad accogliere.</p></div></div></section>
}

function Dishes() {
  return <section className="dishes section-pad" id="piatti"><div className="dish-heading"><div><Overline>Dalla cucina</Overline><h2 data-reveal>Quattro <em>incontri</em><br />con il gusto.</h2></div><p data-reveal>Non un menu, ma un’anteprima. I piatti raccontano una cucina italiana legata al mare e alla convivialità.</p></div><div className="dish-grid">
    {featuredDishes.map((dish, index) => <article className={`dish-card dish-${dish.tone}`} key={dish.name}><div className="dish-art"><img className="dish-photo" src={dish.image} srcSet={`${dish.imageSmall} 800w, ${dish.image} ${dish.imageWidth}w`} sizes="(max-width: 640px) 82vw, (max-width: 960px) 42vw, 25vw" width={dish.imageWidth} height={dish.imageHeight} alt={`${dish.name} presentato da Golden Italy`} loading="lazy" decoding="async" /></div><div className="dish-info"><span>{dish.number}</span><h3>{dish.name}</h3><p>{dish.description}</p></div>{index === 0 && <span className="dish-feature">In evidenza</span>}</article>)}
    </div><p className="menu-note" data-reveal>Questa è un’anteprima dei piatti già presentati sul sito. <a href="/menu/" data-analytics-event="click_menu">Consulta la pagina menu in formato testuale</a>; prezzi e allergeni saranno pubblicati soltanto dopo verifica con il ristorante.</p></section>
}

function Reviews() {
  const reviewsRef = useRef<HTMLElement>(null)
  useSafeLayoutEffect(() => {
    const section = reviewsRef.current
    if (!section) return
    const grid = section.querySelector<HTMLElement>('.reviews-grid')
    const cards = Array.from(section.querySelectorAll<HTMLElement>('.review-card'))
    const headingParts = Array.from(section.querySelectorAll<HTMLElement>('.reviews-heading > *'))
    if (!grid || cards.length === 0) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return
    const isCarousel = window.matchMedia('(max-width: 960px)').matches
    const revealOrder = [...cards]
    if (!isCarousel) {
      for (let index = revealOrder.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        ;[revealOrder[index], revealOrder[randomIndex]] = [revealOrder[randomIndex], revealOrder[index]]
      }
    }

    const directions = new Map(cards.map((card) => [card, Math.random() < .5 ? -1 : 1]))
    const animations: Animation[] = []
    let disposed = false
    const play = (
      target: HTMLElement,
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
      finalStyles: Partial<CSSStyleDeclaration>,
    ) => {
      const animation = target.animate(frames, options)
      animations.push(animation)
      void animation.finished.then(() => {
        if (disposed) return
        Object.assign(target.style, finalStyles)
        animation.cancel()
      }).catch(() => undefined)
    }

    headingParts.forEach((part) => {
      part.style.transform = 'translate3d(0,34px,0)'
      part.style.filter = 'blur(10px)'
      part.style.clipPath = 'inset(0 0 24% 0)'
    })
    cards.forEach((card) => {
      const direction = directions.get(card) ?? 1
      card.style.opacity = '0'
      if (!reducedMotion) {
        card.style.transform = `translate3d(${direction * 34}px,48px,0) scale(.94)`
        card.style.filter = 'blur(18px) brightness(.72) saturate(.7)'
        card.style.clipPath = 'inset(10% 8% 10% 8%)'
      }
    })

    const headingObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      headingObserver.disconnect()
      headingParts.forEach((part, index) => {
        play(part, [
          { transform: 'translate3d(0,34px,0)', filter: 'blur(10px)', clipPath: 'inset(0 0 24% 0)' },
          { transform: 'translate3d(0,0,0)', filter: 'blur(0)', clipPath: 'inset(0 0 0 0)' },
        ], { duration: 900, delay: index * 110, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }, {
          transform: 'none', filter: 'none', clipPath: 'inset(0 0 0 0)',
        })
      })
    }, { threshold: .01, rootMargin: '0px 0px 8% 0px' })

    const cardsObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      cardsObserver.disconnect()
      revealOrder.forEach((card, index) => {
        const direction = directions.get(card) ?? 1
        const delay = index * (isCarousel ? 180 : 520)
        const frames: Keyframe[] = reducedMotion
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: `translate3d(${direction * 34}px,48px,0) scale(.94)`, filter: 'blur(18px) brightness(.72) saturate(.7)', clipPath: 'inset(10% 8% 10% 8%)' },
              { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0) brightness(1) saturate(1)', clipPath: 'inset(0 0 0 0)' },
            ]
        play(card, frames, {
          duration: reducedMotion ? 520 : 980,
          delay,
          easing: 'cubic-bezier(.16,1,.3,1)',
          fill: 'both',
        }, {
          opacity: '1', transform: 'none', filter: 'none', clipPath: 'inset(0 0 0 0)',
        })
      })
    }, { threshold: .01, rootMargin: '0px 0px 12% 0px' })

    headingObserver.observe(section)
    cardsObserver.observe(grid)
    return () => {
      disposed = true
      headingObserver.disconnect()
      cardsObserver.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [])

  return <section ref={reviewsRef} className="reviews section-pad" id="recensioni">
    <div className="reviews-heading">
      <div><Overline>Dicono di noi</Overline><h2>Le parole<br />dopo <em>la tavola.</em></h2></div>
      <div className="reviews-intro"><p>Una selezione editoriale di recensioni pubblicate dagli ospiti su Tripadvisor.</p><a className="reviews-link" href={restaurant.tripadvisorUrl} target="_blank" rel="noopener noreferrer" data-analytics-event="click_tripadvisor">Tutte le recensioni su Tripadvisor <ArrowUpRight /></a></div>
    </div>
    <div className="reviews-grid" aria-label="Recensioni selezionate da Tripadvisor">
      {reviews.map((review) => <article className={review.featured ? 'review-card review-featured' : 'review-card'} key={`${review.author}-${review.date}`}>
        <div className="review-top"><span className="review-avatar" aria-hidden="true">{review.initials}</span><div className="review-stars" aria-label={`${review.rating} stelle su 5`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={index < review.rating ? 'is-filled' : ''} />)}</div></div>
        <Quote className="review-quote" aria-hidden="true" />
        <h3>{review.title}</h3><p>{review.summary}</p>
        <div className="review-meta"><span><b>{review.author}</b>{review.date}</span><a href={restaurant.tripadvisorUrl} target="_blank" rel="noopener noreferrer" data-analytics-event="click_tripadvisor" aria-label={`Leggi le recensioni di Golden Italy su Tripadvisor, recensione selezionata di ${review.author}`}>Tripadvisor <ArrowUpRight /></a></div>
      </article>)}
    </div>
    <p className="reviews-disclosure">Testi sintetizzati dalle recensioni originali. Le opinioni appartengono agli utenti Tripadvisor.</p>
  </section>
}

function Visit() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const videoEnabled = useDeferredMedia(sectionRef)
  useManagedVideoPlayback(videoRef, videoEnabled)

  return <section ref={sectionRef} className="visit" id="visita" data-contact-section><div className="visit-atmosphere"><img className="visit-poster" src={media.visitPoster} alt="Atmosfera serale all’interno di Golden Italy" width="848" height="1072" loading="lazy" decoding="async" />{videoEnabled && <video ref={videoRef} className="visit-film" autoPlay muted loop playsInline preload="metadata" poster={media.visitPoster} aria-hidden="true"><source src={media.visitVideo} type="video/mp4" /></video>}<p>Ci vediamo<br /><em>a Ostia.</em></p></div><div className="visit-panel"><Overline>Organizza la visita</Overline><h2>Il tuo tavolo<br />ti aspetta.</h2><div className="visit-details"><div><MapPin /><span><b>Indirizzo</b>{restaurantAddress}</span></div><div><Phone /><span><b>Telefono</b><a href={restaurantLinks.phone} data-analytics-event="click_phone">{restaurant.phoneDisplay}</a></span></div><div className="hours"><Clock /><span><b>Orari ufficiali</b>Verificali telefonicamente prima della visita.</span></div></div><div className="visit-actions"><a className="pill pill-dark" href={restaurantLinks.phone} data-analytics-event="click_reservation">Chiama per prenotare <ArrowUpRight /></a><a className="text-link dark" href={restaurantLinks.directions} target="_blank" rel="noopener noreferrer" data-analytics-event="click_directions">Apri le indicazioni <ArrowUpRight /></a></div></div></section>
}

function Footer({ isHome }: { isHome: boolean }) {
  return <footer id="contatti">
    <div className="footer-topline">
      <div><p className="footer-eyebrow">Golden Italy · Lido di Ostia</p><h2>Il prossimo posto<br />a tavola è <em>il tuo.</em></h2></div>
      <a className="footer-book" href={restaurantLinks.phone} data-analytics-event="click_reservation"><span>Prenota<br />un tavolo</span><ArrowUpRight /></a>
    </div>

    <div className="footer-main">
      <div className="footer-identity">
        <img className="footer-logo" src={media.logo} alt="Logo Golden Italy" width="512" height="512" loading="lazy" decoding="async" />
        <a className="footer-mark" href="/" onClick={reloadLandingPage} aria-label="Golden Italy, ricarica e torna alla homepage"><span>Golden</span><span>Italy</span></a>
        <p>{restaurant.shortDescription}</p>
      </div>

      <nav className="footer-directory" aria-label="Navigazione a piè di pagina">
        <div><span>Esplora</span><a href={isHome ? '#atmosfera' : '/#atmosfera'}>Atmosfera</a><a href="/menu/" data-analytics-event="click_menu">Menu</a><a href="/domande-frequenti/">Domande frequenti</a><a href="/privacy-policy/">Privacy</a></div>
        <div><span>Vieni a trovarci</span><a href={restaurantLinks.phone} data-analytics-event="click_reservation">Prenota per telefono <ArrowUpRight /></a><a href={restaurantLinks.directions} target="_blank" rel="noopener noreferrer" data-analytics-event="click_directions">Indicazioni stradali <ArrowUpRight /></a><a href="/contatti/">Informazioni e contatti</a></div>
        <div><span>Online</span><a href={restaurant.tripadvisorUrl} target="_blank" rel="noopener noreferrer" data-analytics-event="click_tripadvisor">Tripadvisor <ArrowUpRight /></a><a href="/">Homepage</a></div>
      </nav>
    </div>

    <div className="footer-contact">
      <a href={restaurantLinks.directions} target="_blank" rel="noopener noreferrer" data-analytics-event="click_directions"><MapPin /><span><b>Dove siamo</b>{restaurantAddress}</span></a>
      <a href={restaurantLinks.phone} data-analytics-event="click_phone"><Phone /><span><b>Telefono e prenotazioni</b>{restaurant.phoneDisplay}</span></a>
      <p><span>© {new Date().getFullYear()} Golden Italy</span><span>Informazioni aziendali centralizzate e aggiornabili.</span></p>
    </div>
  </footer>
}

function FaqSection({ page = false }: { page?: boolean }) {
  return <section className={page ? 'faq-block faq-page-block' : 'faq-block section-pad'} aria-labelledby={page ? undefined : 'faq-home-title'}>
    {!page && <div className="faq-heading"><Overline>Prima di venire</Overline><h2 id="faq-home-title">Domande frequenti<br /><em>su Golden Italy.</em></h2></div>}
    <div className="faq-list">
      {faqItems.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
    </div>
    {!page && <a className="inline-arrow" href="/domande-frequenti/">Tutte le risposte <ArrowUpRight /></a>}
  </section>
}

function Breadcrumb({ current }: { current: string }) {
  return <nav className="breadcrumb" aria-label="Percorso"><ol><li><a href="/">Home</a></li><li aria-current="page">{current}</li></ol></nav>
}

function InternalHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <header className="internal-hero"><Overline>{eyebrow}</Overline><h1>{title}</h1><p>{intro}</p></header>
}

function MenuPage({ description }: { description: string }) {
  return <><Breadcrumb current="Menu" /><InternalHero eyebrow="Dalla cucina" title="Menu Golden Italy: pesce, cucina italiana e pizza a Ostia" intro={description} />
    <div className="menu-status"><p><strong>Nota sul menu</strong> Questa è un’anteprima editoriale, non il menu completo del ristorante. Prezzi e allergeni non sono pubblicati perché non ancora verificati direttamente; disponibilità e composizione dei piatti possono cambiare.</p><p>Pagina aggiornata il <time dateTime="2026-07-15">{menuLastUpdated}</time>.</p></div>
    <div className="text-menu">
      {menuSections.map((section) => <section key={section.name} aria-labelledby={`menu-${section.name.toLowerCase().replaceAll(' ', '-')}`}><h2 id={`menu-${section.name.toLowerCase().replaceAll(' ', '-')}`}>{section.name}</h2><div className="menu-items">
        {section.items.map((item) => <article key={item.name}><img src={item.imageSmall} srcSet={`${item.imageSmall} 800w, ${item.image} ${item.imageWidth}w`} sizes="(max-width: 760px) 100vw, 36vw" width={item.imageWidth} height={item.imageHeight} alt={`${item.name} presentato da Golden Italy`} loading="lazy" decoding="async" /><div><h3>{item.name}</h3><p>{item.description}</p>{item.price !== undefined && <data value={item.price.toFixed(2)}>{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(item.price)}</data>}</div></article>)}
      </div></section>)}
    </div>
    <aside className="page-cta"><p>Per conoscere disponibilità, menu completo e prezzi aggiornati, contatta direttamente Golden Italy.</p><a className="pill pill-dark" href={restaurantLinks.phone} data-analytics-event="click_reservation">Chiama {restaurant.phoneDisplay} <ArrowUpRight /></a></aside>
  </>
}

function FaqPage({ description }: { description: string }) {
  return <><Breadcrumb current="Domande frequenti" /><InternalHero eyebrow="Informazioni utili" title="Domande frequenti su Golden Italy a Ostia" intro={description} /><FaqSection page /><aside className="page-cta"><p>Hai bisogno di un’informazione non presente?</p><a className="pill pill-dark" href={restaurantLinks.phone} data-analytics-event="click_phone">Chiama Golden Italy <ArrowUpRight /></a></aside></>
}

function ContactsPage({ description }: { description: string }) {
  return <><Breadcrumb current="Contatti" /><InternalHero eyebrow="Organizza la visita" title="Contatti e indicazioni per Golden Italy a Ostia" intro={description} />
    <section className="contact-cards" aria-label="Informazioni di contatto" data-contact-section>
      <article><MapPin /><h2>Indirizzo</h2><address>{restaurantAddress}</address><a href={restaurantLinks.directions} target="_blank" rel="noopener noreferrer" data-analytics-event="click_directions">Apri le indicazioni <ArrowUpRight /></a></article>
      <article><Phone /><h2>Telefono e prenotazioni</h2><p><a href={restaurantLinks.phone} data-analytics-event="click_phone">{restaurant.phoneDisplay}</a></p><a href={restaurantLinks.phone} data-analytics-event="click_reservation">Chiama per prenotare <ArrowUpRight /></a></article>
      <article><Clock /><h2>Orari ufficiali</h2><p>Gli orari non sono ancora pubblicati sul sito. Verificali telefonicamente prima della visita.</p><a href={restaurantLinks.phone} data-analytics-event="click_phone">Verifica gli orari <ArrowUpRight /></a></article>
    </section>
  </>
}

function PrivacyPage({ description }: { description: string }) {
  return <><Breadcrumb current="Privacy policy" /><InternalHero eyebrow="Trasparenza" title="Privacy policy del sito Golden Italy" intro={description} />
    <article className="legal-copy">
      <p className="legal-updated">Ultimo aggiornamento: <time dateTime="2026-07-15">15 luglio 2026</time>.</p>
      <h2>Riferimento e contatti</h2><p>Il sito è riferito a Golden Italy, in {restaurantAddress}. Per richieste relative al sito è disponibile il numero <a href={restaurantLinks.phone}>{restaurant.phoneDisplay}</a>.</p>
      <h2>Dati trattati dal sito</h2><p>Il sito non contiene moduli, account utente o sistemi di pagamento. Il provider di hosting può trattare dati tecnici di connessione, come indirizzo IP, data, ora, pagina richiesta e informazioni del browser, per sicurezza e funzionamento del servizio.</p>
      <h2>Analytics e cookie non essenziali</h2><p>Il sito non attiva servizi di analytics o tracciamento pubblicitario. L’adapter interno per gli eventi rimane inattivo finché non viene configurato consapevolmente un servizio compatibile con gli obblighi di informativa e consenso.</p>
      <h2>Servizi esterni</h2><p>I collegamenti a telefono, Google Maps e Tripadvisor si attivano solo quando vengono selezionati. Da quel momento si applicano le informative dei rispettivi fornitori. I font del sito sono forniti da Google Fonts e la richiesta tecnica può comportare il trasferimento dell’indirizzo IP al fornitore.</p>
      <h2>Aggiornamenti</h2><p>Questa informativa sarà aggiornata prima dell’eventuale aggiunta di analytics, moduli, sistemi di prenotazione o altri servizi esterni che modifichino il trattamento dei dati.</p>
    </article>
  </>
}

function NotFoundPage({ description }: { description: string }) {
  return <div className="not-found"><p className="overline">Errore 404</p><h1>Questa pagina non è a tavola.</h1><p>{description}</p><div><a className="pill pill-light" href="/">Torna alla homepage</a><a className="text-link" href="/menu/">Vai al menu</a></div></div>
}

function HomePage() {
  return <main id="main-content"><div className="hero-push"><Hero /><Welcome /></div><Room /><TableSection /><Dishes /><Reviews /><FaqSection /><Visit /></main>
}

function MobileActions() {
  return <div className="mobile-cta"><a href="/menu/" data-analytics-event="click_menu"><Menu /> Menu</a><a href={restaurantLinks.phone} data-analytics-event="click_reservation"><Phone /> Prenota</a><a href={restaurantLinks.directions} target="_blank" rel="noopener noreferrer" data-analytics-event="click_directions"><MapPin /> Indicazioni</a></div>
}

export default function App({ pathname = '/' }: { pathname?: string }) {
  const appRef = useRef<HTMLDivElement>(null)
  const route = getRoute(pathname)
  const isHome = route.path === '/'
  useCinematicMotion(appRef as RefObject<HTMLElement>, isHome)
  useSmoothAnchorNavigation(appRef as RefObject<HTMLElement>)
  const page = route.path === '/menu/' ? <MenuPage description={route.description} />
    : route.path === '/domande-frequenti/' ? <FaqPage description={route.description} />
      : route.path === '/contatti/' ? <ContactsPage description={route.description} />
        : route.path === '/privacy-policy/' ? <PrivacyPage description={route.description} />
          : route.path === '/404.html' ? <NotFoundPage description={route.description} />
            : <HomePage />
  return <div ref={appRef} className={isHome ? 'app' : 'app internal-app'}><a className="skip-link" href="#main-content">Vai al contenuto</a><Header isHome={isHome} />{isHome ? page : <main id="main-content" className="internal-main">{page}</main>}<Footer isHome={isHome} /><MobileActions /></div>
}
