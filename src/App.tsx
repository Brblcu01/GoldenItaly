import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { ArrowDown, ArrowUpRight, MapPin, Menu, Phone, Quote, Star, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { dishes, interiors, restaurant, reviews } from './config'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
ScrollTrigger.config({ ignoreMobileResize: true })
const useSafeLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function useManagedVideoPlayback(videoRef: RefObject<HTMLVideoElement>, enabled: boolean) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let visible = false

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
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor || !root.contains(anchor)) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return
      event.preventDefault()
      const destination = target.getBoundingClientRect().top + window.scrollY
      const distance = Math.abs(window.scrollY - destination)
      const duration = gsap.utils.clamp(.65, 1.25, distance / 1400)
      gsap.to(window, {
        scrollTo: { y: destination, autoKill: true },
        duration,
        ease: 'power3.inOut',
        overwrite: 'auto',
      })
      window.history.replaceState(null, '', hash)
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [scope])
}

function useCinematicMotion(scope: RefObject<HTMLElement>) {
  useSafeLayoutEffect(() => {
    if (!scope.current) return
    let disposed = false
    let refreshFrame = 0
    const mm = gsap.matchMedia()

    mm.add({ isMobile: '(max-width: 768px)', isDesktop: '(min-width: 769px)', reduceMotion: '(prefers-reduced-motion: reduce)' }, (context) => {
      const { isMobile, reduceMotion } = context.conditions as { isMobile: boolean; reduceMotion: boolean }
      if (reduceMotion) {
        gsap.set('[data-reveal], [data-hero-line], .review-card, .dish-card, .footer-mark span', { clearProps: 'all' })
        gsap.fromTo('.welcome-shot',
          { autoAlpha: 0, '--reveal-wash': 1 },
          {
            autoAlpha: 1,
            '--reveal-wash': 0,
            duration: .75,
            stagger: .08,
            ease: 'power1.out',
            immediateRender: true,
            scrollTrigger: { trigger: '.welcome-gallery', start: 'top 64%', toggleActions: 'restart none none reset' },
          },
        )
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
        if (node.closest('.welcome-head')) {
          gsap.from(node, {
            y: isMobile ? 20 : 32,
            filter: 'blur(10px)',
            clipPath: 'inset(0 0 18% 0)',
            duration: isMobile ? .82 : 1.05,
            ease: 'power3.out',
            immediateRender: true,
            onComplete: () => gsap.set(node, { clearProps: 'transform,filter,clipPath' }),
            scrollTrigger: { trigger: node, start: 'top 86%', once: true },
          })
          return
        }
        gsap.from(node, { y: isMobile ? 24 : 38, duration: isMobile ? .72 : .95, ease: 'power3.out', immediateRender: true, onComplete: () => gsap.set(node, { clearProps: 'transform' }), scrollTrigger: { trigger: node, start: 'top 84%', once: true } })
      })

      const welcomeTimeline = gsap.timeline({ scrollTrigger: { trigger: '.welcome-gallery', start: 'top 64%', toggleActions: 'restart none none reset' } })
      welcomeTimeline
        .fromTo('.welcome-shot', { '--reveal-wash': 1 }, { '--reveal-wash': 0, duration: 1.35, stagger: .12, ease: 'power2.out', immediateRender: true }, 0)
        .from('.welcome-exterior', { autoAlpha: 0, x: isMobile ? 0 : -34, y: isMobile ? 24 : 0, scale: 1.035, filter: 'blur(14px) brightness(.78) saturate(.72)', duration: 1.25, ease: 'power3.out', immediateRender: true, willChange: 'transform,filter,opacity' }, 0)
        .from('.welcome-exterior img', { scale: 1.08, filter: 'blur(7px)', duration: 1.4, ease: 'power3.out', immediateRender: true, willChange: 'transform,filter' }, '<')
        .from('.welcome-dining, .welcome-counter', { autoAlpha: 0, y: isMobile ? 24 : 34, scale: 1.025, filter: 'blur(11px) brightness(.84) saturate(.78)', duration: 1.02, stagger: .14, ease: 'power3.out', immediateRender: true, willChange: 'transform,filter,opacity' }, '-=.76')
        .from('.welcome-dining img, .welcome-counter img', { scale: 1.065, filter: 'blur(6px)', duration: 1.15, stagger: .14, ease: 'power3.out', immediateRender: true, willChange: 'transform,filter' }, '<')
        .from('.welcome-gallery blockquote', { y: 26, filter: 'blur(7px)', clipPath: 'inset(0 0 100% 0)', duration: .92, ease: 'power3.out', immediateRender: true, willChange: 'transform,filter,clip-path' }, '-=.58')
        .from('.welcome-shot figcaption', { x: 16, filter: 'blur(5px)', duration: .58, stagger: .09, ease: 'power2.out', immediateRender: true, willChange: 'transform,filter' }, '-=.52')
        .eventCallback('onComplete', () => gsap.set('.welcome-shot, .welcome-shot img, .welcome-gallery blockquote, .welcome-shot figcaption', { clearProps: 'transform,opacity,visibility,filter,clipPath,willChange' }))

      gsap.from('.welcome-tags span', { y: 16, stagger: .08, duration: .58, ease: 'power2.out', immediateRender: true, onComplete: () => gsap.set('.welcome-tags span', { clearProps: 'transform' }), scrollTrigger: { trigger: '.welcome-tags', start: 'top 86%', once: true } })

      const dishHeadingTimeline = gsap.timeline({ scrollTrigger: { trigger: '.dish-heading', start: 'top 80%', once: true } })
      dishHeadingTimeline
        .from('.dish-heading > div', { y: 34, duration: .9, ease: 'power3.out', immediateRender: true })
        .from('.dish-heading > p', { y: 24, duration: .75, ease: 'power3.out', immediateRender: true }, '-=.5')
        .eventCallback('onComplete', () => gsap.set('.dish-heading > *', { clearProps: 'transform' }))

      gsap.utils.toArray<HTMLElement>('.dish-card').forEach((card, index) => {
        gsap.from(card, { x: isMobile ? 0 : index % 2 === 0 ? -34 : 34, y: isMobile ? 26 : 30, duration: .95, ease: 'power3.out', immediateRender: true, onComplete: () => gsap.set(card, { clearProps: 'transform' }), scrollTrigger: { trigger: card, start: 'top 82%', once: true } })
      })

      const reviewTimeline = gsap.timeline({ scrollTrigger: { trigger: '.reviews', start: 'top 76%', once: true } })
      reviewTimeline
        .from('.reviews-heading > *', { y: 30, duration: .85, stagger: .1, ease: 'power3.out', immediateRender: true })
        .from('.review-card', { y: 34, duration: .82, stagger: .08, ease: 'power3.out', immediateRender: true }, '-=.42')
        .eventCallback('onComplete', () => gsap.set('.reviews-heading > *, .review-card', { clearProps: 'transform' }))

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
  }, [scope])
}

function Overline({ children }: { children: ReactNode }) {
  return <p className="overline" data-reveal><span aria-hidden="true" />{children}</p>
}

function Header() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Golden Italy, torna all'inizio"><span>Golden</span><span>Italy</span></a>
      <button className="nav-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-nav"><span>{open ? 'Chiudi' : 'Esplora'}</span>{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'main-nav is-open' : 'main-nav'} id="main-nav" aria-label="Navigazione principale">
        <a href="#storia" onClick={() => setOpen(false)}>Atmosfera</a><a href="#tavola" onClick={() => setOpen(false)}>La tavola</a><a href="#piatti" onClick={() => setOpen(false)}>Piatti</a><a href="#visita" onClick={() => setOpen(false)}>Visita</a>
        <a className="nav-reserve" href={restaurant.phoneHref}>Prenota <ArrowUpRight /></a>
      </nav>
    </header>
  )
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)
  useManagedVideoPlayback(videoRef, true)
  return (
    <section className="hero" id="top" aria-label="Benvenuti da Golden Italy">
      <div className={loaded ? 'hero-media is-loaded' : 'hero-media'}>
        <video ref={videoRef} className="hero-film" autoPlay muted loop playsInline preload="auto" poster={restaurant.heroPoster} onCanPlay={() => setLoaded(true)} aria-label="Atmosfera cinematografica di Golden Italy"><source media="(max-width: 640px)" src={restaurant.heroMobileVideo} type="video/mp4" /><source src={restaurant.heroVideo} type="video/mp4" /></video>
        <div className="hero-shade" />
      </div>
      <div className="hero-copy">
        <p className="hero-kicker" data-hero-meta>{restaurant.eyebrow}</p>
        <h1><span className="line-mask"><span data-hero-line>Una tavola</span></span><span className="line-mask"><span data-hero-line>accesa nel cuore</span></span><span className="line-mask italic"><span data-hero-line>di Ostia.</span></span></h1>
        <div className="hero-actions" data-hero-meta><a className="pill pill-light" href={restaurant.phoneHref}>Prenota un tavolo <ArrowUpRight /></a><a className="text-link" href="#storia">Entra nel ristorante <ArrowDown /></a></div>
      </div>
      <div className="hero-index" data-hero-meta><span>RM</span><span>41°44′N</span></div>
      <div className="scroll-cue" aria-hidden="true"><span>Scorri</span><i /></div>
    </section>
  )
}

function Welcome() {
  return <section className="welcome section-pad" id="storia">
      <div className="welcome-head">
        <div className="welcome-index"><Overline>Benvenuti a tavola</Overline><span className="section-no">01</span></div>
        <h2 data-reveal>Il tempo rallenta.<br />La serata <em>comincia.</em></h2>
        <div className="welcome-copy" data-reveal><p>Un percorso visivo dentro Golden Italy: dalla porta alla sala, fino al gesto semplice di accomodarsi.</p><div className="welcome-tags"><span>Lido di Ostia</span><span>Cucina italiana</span><span>Sapori di mare</span></div></div>
      </div>
      <div className="welcome-gallery" aria-label="Un primo sguardo a Golden Italy">
        <figure className="welcome-shot welcome-exterior"><div><img src={interiors.exterior} alt="L'ingresso illuminato di Golden Italy la sera" /></div><figcaption>Corso Regina Maria Pia, 24</figcaption></figure>
        <figure className="welcome-shot welcome-dining"><div><img src={interiors.diningRoom} alt="La sala di Golden Italy pronta ad accogliere gli ospiti" loading="lazy" /></div><figcaption>La sala</figcaption></figure>
        <figure className="welcome-shot welcome-counter"><div><img src={interiors.serviceCounter} alt="Il banco in pietra al centro del ristorante" loading="lazy" /></div><figcaption>Dentro Golden Italy</figcaption></figure>
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
    const line = section.querySelector<HTMLElement>('.room-copy .overline > span')
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      copy?.animate([
        { transform: 'translate3d(-32px,0,0)' },
        { transform: 'translate3d(0,0,0)' },
      ], { duration: 620, easing: 'cubic-bezier(.22,1,.36,1)' })
      line?.animate([
        { transform: 'scaleX(0)', transformOrigin: 'left center' },
        { transform: 'scaleX(1)', transformOrigin: 'left center' },
      ], { duration: 500, delay: 100, easing: 'cubic-bezier(.22,1,.36,1)' })
    }, { threshold: .5 })
    observer.observe(visual ?? section)
    return () => observer.disconnect()
  }, [])
  return <section ref={roomRef} className="room section-pad"><div className="room-copy"><Overline>L’atmosfera</Overline><h2 data-reveal>Calore italiano,<br /><em>anima di mare.</em></h2><p data-reveal>Materiali avvolgenti, luce morbida, conversazioni che riempiono la stanza. Il nostro racconto parte dallo spazio e arriva alla tavola.</p></div><div className="room-visual image-window"><div className="scene scene-room"><img className="scene-photo dining-photo" src={interiors.diningRoom} alt="La sala interna di Golden Italy apparecchiata per la sera" loading="lazy" decoding="async" /></div><span className="caption">Golden hour, ogni sera</span></div></section>
}

function TableSection() {
  return <section className="table-story" id="tavola"><div className="table-sticky"><div className="table-scene"><img src={interiors.tableRitual} alt="Una tavola di Golden Italy apparecchiata con piatti da condividere" loading="lazy" decoding="async" /></div><div className="table-overlay"><span className="section-no">02</span><div><Overline>Il rito della tavola</Overline><h2>Ogni dettaglio<br />prepara <em>l’incontro.</em></h2></div><p>La mise en place è il primo assaggio: semplice, luminosa, pronta ad accogliere.</p></div></div></section>
}

function Dishes() {
  return <section className="dishes section-pad" id="piatti"><div className="dish-heading"><div><Overline>Dalla cucina</Overline><h2 data-reveal>Quattro <em>incontri</em><br />con il gusto.</h2></div><p data-reveal>Non un menu, ma un’anteprima. I piatti raccontano una cucina italiana legata al mare e alla convivialità.</p></div><div className="dish-grid">
    {dishes.map((dish, index) => <article className={`dish-card dish-${dish.tone}`} key={dish.name}><div className="dish-art"><img className="dish-photo" src={dish.image} alt={dish.name} loading="lazy" /></div><div className="dish-info"><span>{dish.number}</span><h3>{dish.name}</h3><p>{dish.note}</p></div>{index === 0 && <span className="dish-feature">In evidenza</span>}</article>)}
    </div><p className="menu-note" data-reveal>Il menu digitale completo arriverà in un progetto dedicato. Qui assaggi l’esperienza.</p></section>
}

function Reviews() {
  return <section className="reviews section-pad" id="recensioni">
    <div className="reviews-heading">
      <div><Overline>Dicono di noi</Overline><h2>Le parole<br />dopo <em>la tavola.</em></h2></div>
      <div className="reviews-intro"><p>Una selezione editoriale di recensioni a 4 e 5 stelle pubblicate dagli ospiti su Tripadvisor.</p><a className="reviews-link" href={restaurant.tripadvisorHref} target="_blank" rel="noreferrer">Tutte le recensioni su Tripadvisor <ArrowUpRight /></a></div>
    </div>
    <div className="reviews-grid" aria-label="Recensioni selezionate da Tripadvisor">
      {reviews.map((review) => <article className={review.featured ? 'review-card review-featured' : 'review-card'} key={`${review.author}-${review.date}`}>
        <div className="review-top"><span className="review-avatar" aria-hidden="true">{review.initials}</span><div className="review-stars" aria-label={`${review.rating} stelle su 5`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={index < review.rating ? 'is-filled' : ''} />)}</div></div>
        <Quote className="review-quote" aria-hidden="true" />
        <h3>{review.title}</h3><p>{review.summary}</p>
        <div className="review-meta"><span><b>{review.author}</b>{review.date}</span><a href={restaurant.tripadvisorHref} target="_blank" rel="noreferrer" aria-label={`Leggi le recensioni di Golden Italy su Tripadvisor, recensione selezionata di ${review.author}`}>Tripadvisor <ArrowUpRight /></a></div>
      </article>)}
    </div>
    <p className="reviews-disclosure">Testi sintetizzati dalle recensioni originali. Le opinioni appartengono agli utenti Tripadvisor.</p>
  </section>
}

function Visit() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useManagedVideoPlayback(videoRef, true)

  return <section className="visit" id="visita"><div className="visit-atmosphere"><video ref={videoRef} className="visit-film" autoPlay muted loop playsInline preload="auto" poster={restaurant.visitPoster} aria-hidden="true"><source src={restaurant.visitVideo} type="video/mp4" /></video><p>Ci vediamo<br /><em>a Ostia.</em></p></div><div className="visit-panel"><Overline>Organizza la visita</Overline><h2>Il tuo tavolo<br />ti aspetta.</h2><div className="visit-details"><div><MapPin /><span><b>Indirizzo</b>{restaurant.address}</span></div><div><Phone /><span><b>Telefono</b><a href={restaurant.phoneHref}>{restaurant.phoneDisplay}</a></span></div><div className="hours"><span className="status-dot" /><span><b>{restaurant.hoursStatus}</b>{restaurant.hoursNote}</span></div></div><div className="visit-actions"><a className="pill pill-dark" href={restaurant.phoneHref}>Chiama per prenotare <ArrowUpRight /></a><a className="text-link dark" href={restaurant.directionsHref} target="_blank" rel="noreferrer">Apri le indicazioni <ArrowUpRight /></a></div></div></section>
}

function Footer() {
  return <footer id="contatti">
    <div className="footer-topline">
      <div><p className="footer-eyebrow">Golden Italy · Lido di Ostia</p><h2>Il prossimo posto<br />a tavola è <em>il tuo.</em></h2></div>
      <a className="footer-book" href={restaurant.phoneHref}><span>Prenota<br />un tavolo</span><ArrowUpRight /></a>
    </div>

    <div className="footer-main">
      <div className="footer-identity">
        <a className="footer-mark" href="#top" aria-label="Golden Italy, torna all’inizio"><span>Golden</span><span>Italy</span></a>
        <p>Ristorante e pizzeria italiana<br />nel cuore di Lido di Ostia.</p>
      </div>

      <nav className="footer-directory" aria-label="Navigazione a piè di pagina">
        <div><span>Esplora</span><a href="#storia">Atmosfera</a><a href="#tavola">La tavola</a><a href="#piatti">Piatti</a><a href="#recensioni">Recensioni</a></div>
        <div><span>Vieni a trovarci</span><a href={restaurant.phoneHref}>Prenota per telefono <ArrowUpRight /></a><a href={restaurant.directionsHref} target="_blank" rel="noreferrer">Indicazioni stradali <ArrowUpRight /></a><a href="#visita">Informazioni visita</a></div>
        <div><span>Online</span><a href={restaurant.tripadvisorHref} target="_blank" rel="noreferrer">Tripadvisor <ArrowUpRight /></a><a href="#top">Torna all’inizio ↑</a></div>
      </nav>
    </div>

    <div className="footer-contact">
      <a href={restaurant.directionsHref} target="_blank" rel="noreferrer"><MapPin /><span><b>Dove siamo</b>{restaurant.address}</span></a>
      <a href={restaurant.phoneHref}><Phone /><span><b>Telefono e prenotazioni</b>{restaurant.phoneDisplay}</span></a>
      <p><span>© {new Date().getFullYear()} Golden Italy</span><span>Foto dei piatti e orari da confermare prima del lancio.</span></p>
    </div>
  </footer>
}

export default function App() {
  const appRef = useRef<HTMLDivElement>(null)
  useCinematicMotion(appRef as RefObject<HTMLElement>)
  useSmoothAnchorNavigation(appRef as RefObject<HTMLElement>)
  return <div ref={appRef} className="app"><a className="skip-link" href="#storia">Vai al contenuto</a><Header /><main><div className="hero-push"><Hero /><Welcome /></div><Room /><TableSection /><Dishes /><Reviews /><Visit /></main><Footer /><div className="mobile-cta"><a href={restaurant.phoneHref}><Phone /> Prenota</a><a href={restaurant.directionsHref} target="_blank" rel="noreferrer"><MapPin /> Indicazioni</a></div></div>
}
