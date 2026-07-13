# Golden Italy — Detailed Delivery Plan

Status: Planning only  
Version: 1.0  
Created: 13 July 2026  
Canonical product brief: [`Product.md`](./Product.md)

## 1. Purpose

This document defines the complete sequence for turning the approved Golden Italy product and brand brief into a responsive, production-ready restaurant landing page. It is an execution plan, not an implementation artifact.

No Figma file, application code, production integration, analytics property, domain change, or deployment should begin until the relevant dependencies and approval gates in this plan are satisfied.

## 2. Scope

### Included

- Business-information verification.
- Content strategy and final Italian copy.
- Optional English localisation planning.
- Information architecture and conversion flow.
- Brand and design-system definition.
- Responsive Figma design and prototype.
- Emergent/build handoff preparation.
- Frontend implementation planning.
- Hero-video optimisation and fallback strategy.
- Reservation, phone, map, guided-tour, and dish-showcase actions.
- Local SEO and Restaurant structured data.
- Consent-aware analytics planning.
- Accessibility, performance, browser, device, and content QA.
- Launch, rollback, monitoring, and post-launch optimisation.

### Excluded unless separately approved

- A custom reservation backend.
- A custom online-ordering or payment system.
- Menu-management CMS or menu-application development; that work belongs to a separate future project.
- Professional photography or video production.
- Logo redesign or trademark work.
- Reputation management or review solicitation.
- Social-media management.
- Paid advertising campaigns.
- Ongoing hosting, maintenance, or content updates beyond the initial launch window.

## 3. Fixed product direction

The following decisions are treated as approved planning assumptions until changed in writing:

- Product: one-page, mobile-first restaurant landing page.
- Brand: Golden Italy, Lido di Ostia.
- Primary language: Italian.
- Primary conversion: table reservation.
- Secondary conversions: call, directions, tour progression, and dish-gallery engagement.
- Hero direction: MotionSites `Visual Hero`, adapted for restaurant conversion.
- Hero asset: the supplied 20.04-second nighttime storefront MP4.
- Visual mood: warm, cinematic, local, generous, and direct.
- Display font direction: Instrument Serif.
- Body/UI font direction: Barlow.
- Primary surface: dark/night palette derived from the video.
- Primary CTA label: “Prenota un tavolo.”
- No fabricated ratings, awards, testimonials, menu items, hours, or claims.
- No use of Tripadvisor user images without explicit rights.
- No scroll-jacking, mandatory custom cursor, or canvas-based boomerang playback.
- No full menu, price catalogue, cart, ordering flow, menu PDF, or menu navigation in this project.
- The food chapter is an editorial showcase of four or five current dishes, not a functional menu.
- Motion is a primary part of the premium experience: every major chapter receives contextual parallax, layered reveals, or cinematic transitions while preserving native scrolling and immediate access to content.

### Pinterest-derived experience model

The approved UI/UX direction synthesises the researched Pinterest references without copying any one design:

- Dark, cinematic hospitality imagery with warm interior light.
- Oversized editorial serif typography balanced by restrained sans-serif UI.
- Minimal anchor navigation with a persistent reservation action.
- Alternating full-width room photography and close table/food details.
- A visual journey from street to doorway to dining room to table to dishes.
- A final practical-information and reservation chapter.

Primary references are the [modern restaurant template](https://it.pinterest.com/pin/438045501279208929/), [Laurent restaurant theme](https://ru.pinterest.com/pin/laurent-elegant-restaurant-theme--921760248721123109/), [clean minimalist restaurant UI](https://www.pinterest.com/pin/clean-and-minimalist-restaurant-web-design--650840583676249166/), [Italian pasta website](https://it.pinterest.com/pin/italian-pasta-restaurant-website-webmotion--364862007324938525/), and [Mamma Mia concept](https://www.pinterest.com/pin/mamma-mia-italian-restaurant-food-delivery-by-elizaveta-schukina--633387440688415/).

Adopt their visual hierarchy, photographic confidence, whitespace, and CTA clarity. Reject their fine-dining pretence, template-like menu grids, e-commerce patterns, fabricated ratings, and decorative complexity.

### Premium motion and parallax specification

The website should feel richly animated, but never like an effects demo. Motion must communicate physical movement through the restaurant: approach, entry, discovery, intimacy, appetite, and arrival at the table.

#### Motion principles

1. **Spatial meaning first.** Parallax represents depth between foreground architecture, people, furniture, tables, dishes, and background light.
2. **One visual lead per moment.** Several layers may move, but only one subject should dominate attention in each viewport.
3. **Native scroll remains in control.** No scroll hijacking, forced delays, trapped pinning, or animation that prevents a visitor from reaching practical information.
4. **Transform and opacity only where possible.** Avoid animated layout properties that trigger reflow.
5. **Premium restraint.** Use slow, smooth, precisely timed movement; avoid bouncing, spinning, constant floating, generic fade-up repetition, or excessive 3D tilt.
6. **Photography stays authentic.** Animation may reveal or add depth to an image but must not distort the food or restaurant interior.
7. **Motion intensity follows the story.** Arrival and interior chapters are most cinematic; practical information becomes calm and stable; the final CTA closes with a focused accent.
8. **Motion is progressive enhancement.** The complete narrative and every action must work when all animation is disabled.

#### Motion tiers

| Tier | Context | Behaviour |
|---|---|---|
| Full | Desktop/laptop, precise pointer, adequate performance, no reduced-motion request | Layered parallax, masked reveals, subtle scale, light sweeps, and chapter transitions |
| Balanced | Tablet and capable touch devices | Reduced layer count, smaller travel distances, no pointer effects, short reveals |
| Essential | Mobile, constrained connection, or lower performance | Simple opacity/translate reveals, poster-first media, no continuous parallax |
| Reduced | `prefers-reduced-motion: reduce` | Static poster/images, instant or short crossfades, no parallax, pinning, scrub, or auto motion |

#### Global motion language

- **Entrance easing:** smooth deceleration such as `power3.out` or an equivalent custom curve.
- **Exit easing:** shorter and quieter than entrance, approximately 60–70% of the entrance duration.
- **Scroll-linked movement:** scrubbed gently with interpolation; never attach raw scroll values directly to large transforms.
- **Parallax distance:** usually 2–6% of the viewport or media frame; absolute maximum approximately 60px on large desktop.
- **Image scale:** normally `1.00 → 1.06`; never exceed the crop needed to hide transform edges.
- **Text reveals:** line or phrase masks with 30–50ms stagger; no character-by-character effect on paragraphs.
- **Micro-interactions:** 150–300ms.
- **Chapter transitions:** generally 500–900ms when scroll-driven, interruptible, and non-blocking.
- **Focus/press states:** immediate enough to acknowledge input within 100ms.
- **Cursor response:** no custom cursor; optional pointer parallax affects decorative layers only.
- **Neon behaviour:** rare low-amplitude glow or light sweep, never a continuous flashing sign.

#### Section-by-section choreography

| Chapter | Premium animation plan | Parallax layers | Mobile/reduced fallback |
|---|---|---|---|
| Global navigation | Transparent/glass pill enters after the hero copy, then subtly compacts after the first chapter; active anchor changes without layout shift | Navigation remains fixed; only opacity, blur, and small scale change | Static compact header; no backdrop animation when performance is weak |
| Arrival / storefront hero | Video begins from poster; hero copy reveals through a soft vertical mask; street-level foreground drifts slightly faster than storefront; CTA appears last; scroll cue responds once | Foreground pedestrians/reflection if separable, storefront/video plane, text plane, soft neon glow | Static poster or normal video with simple text crossfade; no pointer parallax |
| Threshold / entrance | A dark foreground edge or doorway mask opens as the interior image moves forward by a subtle scale; copy crosses from exterior alignment to interior alignment | Doorframe foreground, entrance image, warm-light overlay, short copy | Single image crossfade with no mask scrub |
| Dining room reveal | Wide room image uses slow opposing depth: foreground furniture moves slightly faster than the background; chapter title remains stable long enough to read; detail image enters from the direction of implied movement | Foreground table/chair crop, room image, ambient-light gradient, detail frame | One wide image plus static detail below; basic fade/translate only |
| Table chapter | Editorial frames overlap with controlled vertical separation; glassware or place-setting close-up receives a tiny scale/rotation response; text reveals as a single block | Background surface, primary table image, secondary close-up, decorative rule | Vertical stack; no overlap that risks clipping or text collision |
| Dish showcase | Each dish enters through an image mask inspired by plating/serving direction; alternating images move at different scroll speeds; names remain crisp and stable; optional desktop hover zoom is limited to 2–3% | Background colour field, dish photograph, caption/name, subtle highlight/shadow | Vertical editorial stack; one reveal per image; no 3D tilt or horizontal-only carousel |
| Shared-table bridge | A wide communal image or serving moment expands from a contained frame toward full width, creating a visual crescendo before practical details | Image crop, edge vignette, short bridge line | Static full-width image with short fade |
| Practical information | Motion deliberately settles; information rows appear with short stagger, map/directions element fades once, and nothing moves continuously behind hours or phone details | Surface and restrained accent only | Static content; instant focus and interaction states |
| Final reservation | Background returns to Night Ink; a warm light sweep or subtle neon underline draws attention once; CTA receives a calm magnetic proximity effect on desktop without moving its hit target | Background glow, headline, CTA accent | Standard button hover/press; no magnetic effect on touch/reduced motion |
| Footer | Minimal opacity transition only; no decorative parallax after the conversion climax | None | Static |

#### Context rules

- Parallax direction must agree with the visual composition. A subject on the left should not drift across copy or contradict the implied camera movement.
- Text must never move at a speed that harms reading; body text is normally not scrubbed.
- Food photographs may scale or reveal but must not rotate enough to make plates appear tilted unnaturally.
- Background movement must pause while a modal, consent panel, or booking overlay is open.
- Fixed/sticky elements need defined z-index ownership so transformed parents do not create unexpected stacking contexts.
- When a chapter contains several animated assets, load and animate only those near the viewport.
- No animation may delay a reservation, call, or directions action.

#### Performance budget for motion

- Keep continuous work within the frame budget on target devices; aim for 60fps and accept a stable 30fps only for video playback on constrained hardware, never for input response.
- Limit simultaneous continuous parallax layers to three in a viewport; additional elements use one-time reveals.
- Use a single coordinated animation system rather than mixing several scroll libraries.
- Register and destroy observers/timelines by component lifecycle.
- Pause requestAnimationFrame work outside the viewport and when the page is hidden.
- Avoid large blur animation; prefer precomposed gradients or opacity changes.
- Avoid animating `filter`, `box-shadow`, and backdrop blur continuously on mobile.
- Use `will-change` temporarily around active transitions, not permanently on every element.
- Recalculate measurements on resize/orientation changes with debouncing.
- Disable premium tiers automatically when device capability or runtime performance falls below the agreed threshold.

#### Accessibility and control

- Respect `prefers-reduced-motion` before timelines initialise, not after motion has already begun.
- Provide an accessible pause/play control for the hero video.
- Do not require users to understand content while it is moving.
- Keyboard focus must not trigger large parallax or unexpected scroll motion.
- Anchor navigation should account for fixed-header offsets without animated overshoot.
- Screen-reader order follows semantic DOM order and remains independent of overlapping visual layers.
- Motion must not flash more than accessibility thresholds; avoid strobing and rapid luminance changes entirely.

## 4. Success criteria

The project is successful when all of the following are true:

### Business

- Visitors can reserve, call, find the restaurant, and visually understand the space and representative dishes without confusion.
- The primary reservation action is visible in the hero and remains easy to access on mobile.
- Every public business fact has an identified owner-approved source.
- The final page distinguishes Golden Italy from generic Italian-restaurant templates.

### User experience

- A first-time mobile visitor can identify the cuisine, location, and main action within five seconds.
- The page remains usable when video autoplay is blocked or JavaScript fails.
- No critical task relies on hover, parallax, sound, or animation.
- Navigation, CTAs, map links, tour chapters, and dish content are keyboard and touch accessible.

### Quality

- WCAG 2.2 AA checks pass for critical flows and content.
- Normal text meets at least 4.5:1 contrast; large text and meaningful UI graphics meet at least 3:1.
- Touch targets are at least 44×44px with suitable spacing.
- No horizontal scrolling occurs at approved breakpoints.
- Cumulative Layout Shift target is below 0.1.
- Hero media has a tested poster, mobile treatment, reduced-motion state, and failure fallback.
- All production links, phone numbers, hours, featured-dish data, image rights, and schema fields are verified immediately before launch.

### Measurement

- Reservation, call, directions, tour progression, and dish-chapter engagement are measurable after valid consent where required.
- Event names and reporting definitions are documented before implementation.
- A launch baseline exists for traffic, conversion actions, performance, and errors.

## 5. Critical path

The project must follow this dependency order:

1. Owner confirms facts, links, rights, and business goals.
2. Content and conversion rules are finalised.
3. Information architecture and responsive wireframes are approved.
4. Design tokens and Figma foundations are approved.
5. High-fidelity responsive design and prototype are approved.
6. Build handoff and technical decisions are approved.
7. Implementation and integrations are completed.
8. Accessibility, performance, content, and functional QA pass.
9. Final business-data verification and launch approval are recorded.
10. Production is released, monitored, and measured.

Work may be explored in parallel, but no downstream artifact becomes final while an upstream dependency remains unresolved.

## 6. Decision owners

| Decision area | Required owner | Required evidence |
|---|---|---|
| Business name, address, phone, hours | Restaurant owner/manager | Written confirmation |
| Reservation destination | Restaurant owner/manager | Tested official URL or provider account |
| Dish subjects and names | Restaurant owner/manager | Current approved shortlist |
| Food/interior photography | Rights holder | Written reuse licence or new owned photography |
| Photography, video, logo rights | Rights holder | Written ownership/licence confirmation |
| Italian copy | Restaurant owner/manager | Final text approval |
| English translation | Owner plus fluent reviewer | Translation approval |
| Visual design | Project owner | Figma approval recorded by version |
| Analytics/cookies | Project owner and legal adviser if needed | Approved tool list and consent rules |
| Domain/DNS/deployment | Domain and hosting owner | Access confirmation and rollback plan |

## 7. Required input checklist

### Business data

- [ ] Official legal/public business name.
- [ ] Canonical street address and map place URL.
- [ ] Confirmed phone number.
- [ ] Confirmed weekly service hours, including split shifts.
- [ ] Holiday and exceptional-hours process.
- [ ] Reservation provider, URL, and fallback method.
- [ ] Accepted payment methods and accessibility features, if advertised.
- [ ] Primary business email, if it will be published.

### Dish showcase and content

- [ ] Confirmed cuisine/category wording.
- [ ] Four or five current dishes approved for visual presentation.
- [ ] Confirmed display name for every featured dish.
- [ ] Owner-approved one-line caption, if captions are used.
- [ ] No unverified ingredient, price, freshness, dietary, or allergen claim.
- [ ] Short restaurant story approved by the owner.
- [ ] Approved Italian hero and section copy.
- [ ] Approved English copy if bilingual launch is selected.

### Brand and media

- [ ] Official logo in SVG, PDF, EPS, or high-resolution transparent PNG.
- [ ] Logo-use rules, if any.
- [ ] Rights confirmation for the supplied MP4.
- [ ] Owned/licensed food and interior photography.
- [ ] Rights confirmation for each production image.
- [ ] Written permission from the original Tripadvisor photographer for any Tripadvisor image selected for production, or a replacement shoot of the same dish subject.
- [ ] Approved social-sharing image.
- [ ] Favicon or permission to derive one from the official logo.

### Technical and operational

- [ ] Domain registrar access.
- [ ] Existing website/hosting access and backup.
- [ ] Analytics and consent platform decision.
- [ ] Privacy-policy and cookie-policy ownership.
- [ ] Deployment environment decision.
- [ ] Named launch approver and emergency contact.

## 8. Phase 0 — Project control and approvals

### Objective

Establish the source of truth, owners, approval rules, and change-control process before design work begins.

### Tasks

- [ ] **P0.1 — Confirm project location.** Treat `C:\Users\Utente\Documents\GoldenItaly` as the working project directory.
- [ ] **P0.2 — Freeze the brief version.** Record the approved `Product.md` version/date.
- [ ] **P0.3 — Name decision owners.** Assign one approver for business facts, one for design, and one for launch; one person may hold multiple roles.
- [ ] **P0.4 — Define approval evidence.** Use written approval tied to an artifact name and date, not verbal “looks good” feedback.
- [ ] **P0.5 — Create a decision log.** Record date, decision, owner, affected artifacts, and reason.
- [ ] **P0.6 — Create a change rule.** Changes to goals, language, booking, tour structure, featured dishes, or integrations after Figma approval require impact review.
- [ ] **P0.7 — Define review rounds.** Plan one wireframe review, two visual-design rounds, one pre-build sign-off, and one pre-launch sign-off.

### Deliverables

- Approved project scope.
- Named decision owners.
- Approval and change-control procedure.
- Open-questions register.

### Exit criteria

- Every critical decision area has an accountable owner.
- Stakeholders understand that unverified directory data is not production truth.
- The project can distinguish “proposed,” “approved,” and “published” information.

## 9. Phase 1 — Business discovery and fact verification

### Objective

Replace directory assumptions with owner-approved facts and document provenance for every public claim.

### Tasks

- [ ] **P1.1 — Verify identity.** Confirm name, spelling, address, phone, website, and map listing.
- [ ] **P1.2 — Resolve hours conflict.** Establish normal hours by weekday, split service periods, kitchen closing time, and exceptional-day procedure.
- [ ] **P1.3 — Confirm reservation flow.** Test the official destination on desktop and mobile; document failure fallback.
- [ ] **P1.4 — Confirm tour scope.** Approve the journey sequence: street, threshold, dining room, table, dishes, practical information, reservation.
- [ ] **P1.5 — Validate restaurant features.** Confirm takeaway, outdoor seating, wheelchair access, highchairs, alcohol, Wi-Fi, and payment methods before displaying them.
- [ ] **P1.6 — Verify dish currency.** Confirm every featured dish is currently served and name the person responsible for approving future replacements.
- [ ] **P1.7 — Verify media rights.** Establish whether the supplied video accurately represents the premises and is licensed for public commercial use.
- [ ] **P1.8 — Establish review policy.** Decide whether reviews will be omitted, embedded, or quoted with permission.
- [ ] **P1.9 — Establish privacy requirements.** List analytics, embeds, maps, booking widgets, fonts, and third-party scripts that may affect consent.

### Deliverables

- Business-facts sheet with source, owner, approval date, and expiry/recheck date.
- Confirmed reservation URL and phone/directions destinations.
- Approved asset-rights register.
- Approved featured-dish and visual-story shortlist.
- Third-party services inventory.

### Exit criteria

- No critical public field remains sourced only from Tripadvisor or another directory.
- Reservation and phone actions have working, approved destinations.
- The supplied video has a clear publication-rights decision.

## 10. Phase 2 — Content strategy and copy

### Objective

Produce concise, accurate, conversion-oriented content before high-fidelity design.

### Tasks

- [ ] **P2.1 — Confirm message hierarchy.** Finalise eyebrow, headline, supporting line, primary CTA, secondary CTA, and “Entra nel ristorante” tour link.
- [ ] **P2.2 — Write restaurant introduction.** Target 40–70 Italian words focused on place, cuisine, and atmosphere.
- [ ] **P2.3 — Define the dish chapter.** Select four or five owner-approved dishes; show no prices, menu categories, ordering controls, or implied full-menu coverage.
- [ ] **P2.4 — Write atmosphere section.** Connect the nighttime storefront and Ostia context without inventing history.
- [ ] **P2.5 — Write practical information.** Use scannable labels for hours, location, phone, reservations, accessibility, and directions.
- [ ] **P2.6 — Write final CTA.** Reinforce the same reservation action without adding a competing conversion.
- [ ] **P2.7 — Draft empty/error states.** Include unavailable booking, failed map/embed, missing dish/interior media, and blocked-video fallback copy.
- [ ] **P2.8 — Define testimonial policy.** If used, approve exact quote, attribution, platform, permission, and retrieval date.
- [ ] **P2.9 — Define SEO copy.** Draft title, meta description, canonical description, social title, social description, and image alt text.
- [ ] **P2.10 — Plan translation.** If bilingual, translate meaning rather than word order and verify all UI labels at real layout widths.
- [ ] **P2.11 — Conduct claim audit.** Label every statement as factual, subjective brand language, or prohibited/unverified.

### Content model

| Content object | Required fields |
|---|---|
| Hero | Eyebrow, H1, support text, primary CTA, secondary CTA, background-media description |
| Dish portrait | Confirmed name, optional sensory caption, current-status approval, licensed image, alt text |
| Practical info | Address, hours, phone, map URL, reservation URL, accessibility notes |
| Testimonial optional | Exact quote, name/initial, platform, permission, date, source URL |
| SEO | Title, description, canonical URL, locale, OG image, structured-data fields |

### Deliverables

- Approved Italian copy deck.
- Optional approved English copy deck.
- Claims register.
- SEO metadata draft.
- Image and video accessibility descriptions.

### Exit criteria

- Copy fits the planned hierarchy without placeholder text.
- Every claim has an approval state.
- CTA labels are consistent across hero, navigation, mobile bar, and footer.

## 11. Phase 3 — Information architecture and low-fidelity UX

### Objective

Validate page order, conversion paths, and responsive behaviour before visual styling.

### Planned page order

1. Arrival: nighttime storefront video.
2. Threshold: entrance transition.
3. Dining room: wide interior reveal.
4. Table chapter: intimate details and human atmosphere.
5. Dish chapter: four or five editorial food portraits.
6. Practical information and location.
7. Final reservation CTA.
8. Footer with legal and contact links.

### Tasks

- [ ] **P3.1 — Map user intents.** Cover “reserve now,” “call,” “where is it,” “what does it feel like,” “which dishes represent it,” and “when is it open.”
- [ ] **P3.2 — Define navigation.** Keep only useful anchors such as Esperienza, Sapori, Dove siamo, and Prenota. Do not label the dish chapter “Menu.”
- [ ] **P3.3 — Define CTA hierarchy.** One primary reservation CTA; call and tour-entry actions remain visually secondary.
- [ ] **P3.4 — Wireframe mobile first.** Begin at 375px and account for browser chrome and safe areas.
- [ ] **P3.5 — Wireframe desktop.** Adapt composition at 1440px without changing content priority.
- [ ] **P3.6 — Define sticky behaviour.** Specify when the mobile action bar appears, hides, and clears footer content.
- [ ] **P3.7 — Define fallback behaviour.** Design poster-only, blocked-autoplay, slow-network, missing-image, and unavailable-booking states.
- [ ] **P3.8 — Define focus order.** Ensure DOM and visual reading orders match.
- [ ] **P3.9 — Validate line length.** Target 35–60 characters per line on mobile and 60–75 on desktop.
- [ ] **P3.10 — Conduct five-second test.** Confirm users can identify name, cuisine/location, and primary action.
- [ ] **P3.11 — Conduct task-path review.** Reservation, call, directions, and access to practical information should require no unnecessary intermediate UI.
- [ ] **P3.12 — Storyboard the tour.** For every chapter, define entrance frame, visual subject, copy limit, motion purpose, transition, fallback, and next-step cue.
- [ ] **P3.13 — Protect scroll agency.** The experience must use native vertical scrolling; no pinned sequences may trap the user or delay access to practical information.
- [ ] **P3.14 — Define dish-gallery behaviour.** Desktop may use alternating editorial compositions; mobile uses a vertical stack with every dish reachable without horizontal gestures.

### Deliverables

- Mobile and desktop low-fidelity wireframes.
- Tour storyboard from exterior to final table reservation.
- Navigation and anchor specification.
- CTA/state matrix.
- Responsive behaviour notes.
- Approved section order.

### Exit criteria

- All primary intents have an obvious route.
- No critical action depends on video or motion.
- Mobile fixed controls do not obscure content.
- Stakeholders approve structure before visual design begins.

## 12. Phase 4 — Design system and Figma foundations

### Objective

Create reusable tokens and components before composing final screens.

### Figma file structure

- `00 Cover & Status`
- `01 Foundations`
- `02 Components`
- `03 Wireframes`
- `04 Desktop`
- `05 Mobile`
- `06 Prototype`
- `07 Accessibility & States`
- `08 Handoff`
- `99 Archive`

### Variable collections

- Colour: primitive and semantic tokens.
- Typography: display, heading, body, label, button, caption.
- Spacing: 4/8-based scale.
- Radius: small, medium, pill.
- Border: default, subtle, focus.
- Elevation: overlay and glass only.
- Motion: fast, standard, slow; enter, exit, and reduced-motion variants.
- Breakpoints/reference frames: 375, 768, 1024, 1440.

### Tasks

- [ ] **P4.1 — Create colour primitives.** Add Night Ink, Warm Ivory, Espresso, Golden Amber, Neon Rosso, Neon Verde, and neutral alpha values.
- [ ] **P4.2 — Create semantic colours.** Define background, surface, surface-overlay, text-primary, text-secondary, action-primary, action-primary-hover, border, focus, error, and success.
- [ ] **P4.3 — Validate contrast.** Test every planned text, button, focus, and icon pairing over solid surfaces and representative video frames.
- [ ] **P4.4 — Define typography styles.** Establish responsive display sizes and body/UI hierarchy with fallback behaviour.
- [ ] **P4.5 — Define spacing rhythm.** Use a documented 4/8px system and spacious section intervals.
- [ ] **P4.6 — Define motion tokens.** Micro-interactions use 150–300ms; time-based UI transitions remain at or below 400ms; cinematic chapter motion may unfold across 500–900ms of user-controlled scroll progress; reduced-motion removes nonessential movement.
- [ ] **P4.6a — Define parallax tokens.** Create named depth levels for background, base, foreground, and accent with approved maximum travel and scale.
- [ ] **P4.6b — Define chapter-transition tokens.** Specify mask direction, image scale range, copy reveal, easing, and interruption behaviour.
- [ ] **P4.6c — Define capability modes.** Document Full, Balanced, Essential, and Reduced behaviour for every animated component.
- [ ] **P4.6d — Define motion z-index map.** Prevent transformed wrappers from isolating navigation, video controls, focus rings, or consent UI.
- [ ] **P4.7 — Build component foundations.** Buttons, links, navigation, sticky mobile bar, info rows, dish portraits, media frame, section heading, language switch optional, and footer.
- [ ] **P4.7a — Build tour components.** Add chapter marker, full-bleed scene, editorial split frame, room-detail frame, dish portrait, photo credit optional, and progress cue.
- [ ] **P4.8 — Add component states.** Default, hover, focus-visible, pressed, disabled, loading, error, and reduced-motion where applicable.
- [ ] **P4.9 — Document icon policy.** One SVG icon family with consistent size and stroke; labels accompany important icons.
- [ ] **P4.10 — Document media treatment.** Video scrim, poster treatment, object position, safe text zones, and fallback surface.

### Deliverables

- Figma foundations page.
- Token table ready for CSS mapping.
- Reusable component set with states.
- Contrast audit.
- Media-treatment specification.

### Exit criteria

- Components use variables rather than detached values.
- Focus, disabled, loading, and error states exist before screen composition.
- Video overlays remain readable on the lightest sampled frame.
- The system supports both mobile and desktop without duplicate component families.

## 13. Phase 5 — High-fidelity Figma design and prototype

### Objective

Create and approve the complete responsive experience before implementation.

### Tasks

- [ ] **P5.1 — Design desktop hero.** Compose video, scrim, wordmark/header, restaurant context, H1, support copy, reservation CTA, call action, and scroll cue.
- [ ] **P5.2 — Design mobile hero.** Protect sign visibility, copy readability, safe areas, and CTA reachability at 375px.
- [ ] **P5.3 — Design tour chapters.** Compose threshold, room, table, and dish sequences with a clear sense of moving inward while retaining native scroll.
- [ ] **P5.4 — Design practical information.** Make hours, address, phone, directions, and reservation action scannable without opening accordions.
- [ ] **P5.5 — Design sticky mobile action bar.** Define appearance threshold, safe-area padding, button priority, and footer collision behaviour.
- [ ] **P5.6 — Design fallback states.** Poster-only, reduced motion, video error, booking unavailable, and missing-media cases.
- [ ] **P5.7 — Create prototype.** Include anchor navigation, reservation/call interactions, video control concept, and mobile bar behaviour.
- [ ] **P5.8 — Annotate motion.** Specify trigger, property, duration, easing, interruptibility, and reduced-motion alternative.
- [ ] **P5.8a — Storyboard animation keyframes.** Add start, midpoint, and end frames for every chapter-level effect rather than relying on prose alone.
- [ ] **P5.8b — Prototype representative motion.** Prototype the hero, threshold, one interior parallax chapter, one dish reveal, and final CTA before approving the motion language for all sections.
- [ ] **P5.8c — Check reading stability.** Ensure body copy remains readable without tracking a moving plane and that headings settle before the next chapter competes.
- [ ] **P5.9 — Annotate responsive changes.** Record stacking, cropping, text-size, spacing, and navigation changes at each breakpoint.
- [ ] **P5.10 — Accessibility review.** Verify focus order, labels, contrast, touch targets, text scaling, and non-motion alternatives.
- [ ] **P5.11 — Content-fit review.** Use final Italian copy and longest expected English variants if localisation is planned.
- [ ] **P5.12 — Stakeholder review.** Capture feedback by priority and resolve contradictions through the named design approver.
- [ ] **P5.13 — Freeze approved version.** Name the approved Figma version and archive rejected explorations.
- [ ] **P5.14 — Review photographic continuity.** Confirm colour temperature, crop direction, human presence, eyeline, and visual movement connect each chapter.
- [ ] **P5.15 — Review dish authenticity.** Compare every designed food image with the owner-approved current dish and rights record.

### Required frames

- Desktop 1440px: full page.
- Laptop 1024px: full page or responsive reference.
- Tablet 768px: critical sections and navigation.
- Mobile 375px: full page.
- Mobile landscape: hero and sticky controls.
- Reduced-motion hero.
- Video-failure hero.
- Full-motion hero and threshold keyframes.
- Desktop interior-parallax keyframes.
- Dish-reveal keyframes and mobile simplification.
- Full/Balanced/Essential/Reduced motion comparison sheet.
- Navigation and component state sheet.

### Deliverables

- Approved high-fidelity Figma file.
- Interactive prototype.
- Responsive annotations.
- Accessibility/state page.
- Export and asset manifest.
- Versioned approval record.

### Exit criteria

- All production content is represented or clearly marked as awaiting approved input.
- Mobile and desktop are approved together.
- No interaction is specified only through appearance.
- Every motion effect has a reduced-motion equivalent.
- Handoff contains no ambiguous detached styling.

## 14. Phase 6 — Technical definition and build handoff

### Objective

Translate the approved design into an unambiguous implementation specification without beginning the build prematurely.

### Decisions

- Framework and hosting platform.
- Static versus CMS-managed content.
- Reservation link versus embedded widget.
- Map link versus embedded map.
- Analytics and consent platform.
- Font hosting method.
- Video encoding and CDN strategy.
- Deployment environments and branch/release process.

### Planned frontend structure

```text
src/
  components/
    Header
    HeroVideo
    VideoControls
    PrimaryCTA
    MobileActionBar
    SectionHeading
    RestaurantTour
    DishShowcase
    AtmosphereSection
    PracticalInfo
    FinalCTA
    Footer
  content/
    restaurant
    dishes
    seo
  styles/
    tokens
    globals
    motion
  assets/
    video
    posters
    images
    icons
```

This is a planning structure and may be adapted to the final framework.

### Tasks

- [ ] **P6.1 — Map Figma variables to semantic code tokens.** Avoid raw component-level hex values.
- [ ] **P6.2 — Create component contract sheet.** Inputs, states, responsive rules, events, and accessibility requirements.
- [ ] **P6.3 — Define content schema.** Keep business facts, tour chapters, and featured-dish content separate from presentation.
- [ ] **P6.4 — Define event schema.** Specify analytics events before wiring interactions.
- [ ] **P6.5 — Define media pipeline.** Source, poster, desktop encode, mobile encode, dimensions, codec, cache, preload, and fallback.
- [ ] **P6.5a — Select one motion engine.** Prefer GSAP with ScrollTrigger for coordinated scroll-linked chapters if the final stack supports it; use CSS transitions and IntersectionObserver for simple reveals.
- [ ] **P6.5b — Define lifecycle ownership.** Each section creates, refreshes, pauses, and destroys its own timelines/observers without leaking listeners.
- [ ] **P6.5c — Define performance adaptation.** Specify capability detection, layer limits, off-screen pausing, and automatic downgrade rules.
- [ ] **P6.5d — Define reduced-motion architecture.** Avoid creating scrubbed timelines at all when reduced motion is active.
- [ ] **P6.6 — Define third-party loading policy.** Consent status, async/defer rules, failure behaviour, and privacy ownership.
- [ ] **P6.7 — Define environments.** Local, preview/staging, and production.
- [ ] **P6.8 — Define browser support.** Current Chrome, Edge, Firefox, Safari, iOS Safari, and Android Chrome, with an agreed backward-support boundary.
- [ ] **P6.9 — Define security headers.** CSP, Referrer-Policy, Permissions-Policy, HSTS where hosting supports it.
- [ ] **P6.10 — Prepare Emergent prompt.** Reference `Product.md`, this plan, approved Figma frames, exact assets, and non-negotiable acceptance criteria.

### Deliverables

- Technical decision record.
- Component and content contracts.
- Design-token mapping.
- Analytics event plan.
- Media pipeline specification.
- Emergent/build handoff prompt.

### Exit criteria

- No key implementation decision is left to an AI builder’s default assumptions.
- Third-party dependencies and privacy consequences are known.
- Build acceptance criteria match the approved Figma version.

## 15. Phase 7 — Planned implementation sequence

This section defines future build order only.

### 7.1 Foundation

- [ ] Initialise the approved framework and quality tooling.
- [ ] Add semantic tokens, global typography, reset, and focus styles.
- [ ] Add page landmarks, skip link, and content containers.
- [ ] Establish responsive breakpoints and z-index scale.
- [ ] Add test and preview commands.

### 7.2 Hero media

- [ ] Add optimised poster and responsive video sources.
- [ ] Implement muted `playsInline` behaviour with accessible pause/play control.
- [ ] Use `preload="metadata"` or approved poster-first loading.
- [ ] Pause video outside the viewport and when the document is hidden.
- [ ] Handle blocked autoplay and playback errors.
- [ ] Implement reduced-motion poster state.
- [ ] Apply a responsive scrim and object-position rules.
- [ ] Add the approved layered desktop hero parallax if performance and accessibility gates pass.
- [ ] Coordinate poster-to-video, hero-copy mask, CTA entrance, neon accent, and scroll cue as one interruptible timeline.

### 7.2a Motion foundation

- [ ] Add semantic duration, easing, distance, depth, scale, and stagger tokens.
- [ ] Create a shared motion-preference/capability service used by every chapter.
- [ ] Implement one reusable parallax controller with bounded transforms and smoothing.
- [ ] Implement one reusable reveal system for masks, images, text blocks, and chapter markers.
- [ ] Ensure animations initialise only near the viewport.
- [ ] Pause all continuous timelines when the document is hidden.
- [ ] Restore the correct visual state after resize, orientation change, back navigation, or browser history restoration.
- [ ] Prevent transform wrappers from clipping focus indicators or fixed UI.

### 7.3 Hero interface

- [ ] Implement semantic navigation and wordmark treatment.
- [ ] Add H1, supporting copy, primary CTA, call action, and tour-entry link.
- [ ] Ensure focus visibility and touch sizes over moving media.
- [ ] Verify controls remain readable at every sampled video frame.

### 7.4 Tour and content sections

- [ ] Implement restaurant introduction.
- [ ] Implement threshold, dining-room, and table chapters from approved media only.
- [ ] Implement the dish showcase from the approved four-or-five-dish shortlist.
- [ ] Keep the dish showcase free of prices, menu categories, ordering controls, and horizontal-only navigation.
- [ ] Implement the section-specific choreography exactly as approved, including motion-tier fallbacks.
- [ ] Use layered parallax only where foreground/background separation is visually credible.
- [ ] Keep practical information and footer intentionally calm after the motion-rich tour.
- [ ] Implement practical information with confirmed fields.
- [ ] Implement final CTA and footer.
- [ ] Add responsive image formats, dimensions, and lazy loading.

### 7.5 Mobile actions

- [ ] Implement fixed reservation/call bar.
- [ ] Respect bottom safe area.
- [ ] Reserve page padding so content is not hidden.
- [ ] Hide or transform the bar near the final CTA/footer according to the approved state spec.

### 7.6 Integrations

- [ ] Add reservation destination with failure fallback.
- [ ] Add `tel:` link after final verification.
- [ ] Add directions link to the approved place.
- [ ] Add maps/embeds only under the approved privacy strategy.

### 7.7 Metadata and structured data

- [x] Add title, description, canonical URL, robots rules, and social metadata.
- [x] Add Restaurant JSON-LD from verified facts, omitting menu/order fields until the separate menu project exists.
- [x] Add sitemap and appropriate language alternates if bilingual.
- [x] Add favicon and social image from approved assets.

### Exit criteria

- Implementation visually matches approved responsive frames.
- All critical actions work without motion or autoplay.
- No placeholder, directory-only, or unapproved content remains.

## 16. Phase 8 — Analytics, privacy, and operational planning

### Event taxonomy

| Event | Trigger | Suggested properties |
|---|---|---|
| `reservation_click` | Any approved reservation CTA | placement, language, destination |
| `phone_click` | Phone link activation | placement, language |
| `directions_click` | Map/directions activation | placement, language |
| `tour_chapter_view` | A major visual chapter enters the viewport | chapter, device class, language |
| `dish_showcase_view` | Dish chapter reaches the agreed visibility threshold | device class, language |
| `tour_complete` | Visitor reaches practical information/final CTA | device class, language |
| `video_play` | User explicitly plays video | device class, reduced_motion false |
| `video_pause` | User pauses video | device class, elapsed bracket |
| `language_change` | Locale switch | from, to |

### Rules

- Do not send names, phone numbers, reservation details, or free-text user data to analytics.
- Do not fire nonessential analytics before valid consent where consent is legally required.
- Avoid duplicate events from nested CTA elements.
- Document whether click events indicate intent, not completed reservations.
- Keep booking-provider conversion reporting separate from landing-page click reporting.
- Define retention, access, and ownership for analytics data.

### Deliverables

- Event dictionary.
- Consent and script-loading map.
- Privacy-policy update requirements.
- Analytics QA checklist.

## 17. Phase 9 — SEO and local discovery plan

### On-page work

- Use one descriptive H1.
- Include restaurant type and Lido di Ostia naturally in visible copy.
- Keep name, address, and phone consistent across page and schema.
- Publish opening hours only from the verified source.
- Describe the cuisine and representative dishes in indexable text without presenting a full menu.
- Use descriptive image filenames and Italian alt text where appropriate.
- Add internal anchor links without replacing normal document structure.

### Structured data

Plan `Restaurant` JSON-LD fields for:

- `name`
- `url`
- `image`
- `telephone`
- `address`
- `geo`, if verified
- `servesCuisine`
- `priceRange`, if approved
- `openingHoursSpecification`
- `acceptsReservations`
- `sameAs`, only for official profiles

Do not copy Tripadvisor aggregate ratings into structured data unless policy, ownership, freshness, and on-page display requirements are satisfied.

### Local consistency

- Compare website name/address/phone with official Google Business Profile and other owner-managed profiles.
- Correct inconsistent directory details through the appropriate owner accounts, outside the website deployment scope.
- Establish a process for holiday-hour updates.

### Deliverables

- Metadata sheet.
- Structured-data field sheet.
- Local consistency checklist.
- Search-console setup plan.

## 18. Phase 10 — QA plan

### Functional QA

- [ ] All navigation anchors land correctly and update focus appropriately.
- [ ] Reservation CTAs use the approved destination.
- [ ] Phone link uses the final confirmed number.
- [ ] Directions link opens the correct place.
- [ ] Every tour chapter appears in the intended order and remains skippable through normal scrolling.
- [ ] Every dish portrait uses the approved image, name, caption, alt text, and credit if required.
- [ ] External links have appropriate target/rel behaviour.
- [ ] Sticky mobile bar never covers critical content.
- [ ] Video play/pause, failure, blocked autoplay, and visibility pausing behave correctly.

### Content QA

- [ ] Business name, address, phone, hours, featured dish names, image rights, and URLs match the final facts sheet.
- [ ] Italian spelling, punctuation, accents, and tone are approved.
- [ ] English version, if any, is complete with no mixed-language UI.
- [ ] No placeholder or unapproved claims remain.
- [ ] Alt text reflects the actual production image.
- [ ] Copyright/rights records cover every production asset.

### Accessibility QA

- [ ] Keyboard-only completion of all tasks.
- [ ] Visible focus at all times.
- [ ] Logical landmark and heading structure.
- [ ] Meaningful accessible names for controls.
- [ ] 200% browser zoom without content loss.
- [ ] Text resizing without clipped controls.
- [ ] Reduced-motion mode removes autoplay/parallax as specified.
- [ ] Reduced-motion preference is honoured before first paint/animation initialisation without a visible motion flash.
- [ ] Every chapter remains complete and understandable with animation styles disabled.
- [ ] Keyboard focus and anchor navigation do not trigger unexpected scrubbed movement.
- [ ] Touch targets and spacing meet requirements.
- [ ] Contrast verified over representative video frames.
- [ ] Screen-reader smoke test on at least one desktop and one mobile platform.
- [ ] Automated checks are reviewed manually; zero automated errors is not treated as complete proof.

### Responsive QA matrix

| Width/context | Required checks |
|---|---|
| 320–375px | Small-phone fit, CTA reach, no overflow, video crop, long Italian labels |
| 390–430px | Large-phone spacing and sticky bar |
| Mobile landscape | Safe areas, hero height, navigation, sticky controls |
| 768px | Tablet stacking, line length, media crop |
| 1024px | Laptop/tablet transition and navigation mode |
| 1280–1440px | Desktop composition and max-width behaviour |
| 1920px+ | Media scaling, text measure, excessive empty space |

### Browser/device matrix

- Current Chrome on Windows and Android.
- Current Edge on Windows.
- Current Firefox on Windows.
- Current Safari on macOS.
- Current iOS Safari on a real or representative device.
- At least one lower-performance mobile device or throttled equivalent.

### Performance QA

- [ ] Test cold load and repeat load.
- [ ] Test slow/limited mobile network.
- [ ] Confirm poster renders before or instead of video as planned.
- [ ] Confirm video does not block text/CTA rendering.
- [ ] Confirm below-fold images lazy-load with reserved dimensions.
- [ ] Inspect LCP, CLS, INP, transferred bytes, main-thread work, and third-party cost.
- [ ] Confirm no continuous animation consumes resources off-screen.
- [ ] Record animation smoothness and long-frame counts for hero, threshold, interior, dish showcase, and final CTA.
- [ ] Confirm no viewport exceeds the three-layer continuous-parallax budget.
- [ ] Confirm Full mode downgrades cleanly to Balanced/Essential without content or layout changes.
- [ ] Test throttled CPU/GPU conditions and disable premium effects when the capability rule requires it.
- [ ] Verify animation teardown after route changes, page restoration, resize, and tab visibility changes.
- [ ] Confirm fonts use an approved loading strategy without invisible text.
- [ ] Confirm production compression, caching, and CDN headers.

### SEO/metadata QA

- [ ] Title, description, canonical, robots, social metadata, and favicon.
- [ ] Structured data validates and matches visible content.
- [ ] Sitemap/robots files reference production URLs.
- [ ] No staging URL is indexable.
- [ ] Locale and alternate-language links are correct if bilingual.

### Analytics/privacy QA

- [ ] No nonessential events before required consent.
- [ ] One user action generates one intended event.
- [ ] Event properties contain no personal data.
- [ ] Decline and withdrawal paths work.
- [ ] Third-party scripts fail gracefully.

### Exit criteria

- No open critical or high-severity defects.
- Medium defects have written acceptance or a scheduled fix.
- Final business facts are rechecked within 24 hours of launch.
- Launch approver signs the release candidate.

## 19. Phase 11 — Launch plan

### Pre-launch

- [ ] Freeze production content.
- [ ] Back up the existing website and relevant DNS/hosting configuration.
- [ ] Record current DNS values and rollback steps.
- [ ] Validate production environment variables and third-party destinations.
- [ ] Recheck reservation, phone, directions, featured dishes, and production media rights.
- [ ] Confirm analytics/consent production IDs.
- [ ] Confirm privacy and cookie documents are published.
- [ ] Run final smoke tests on the release candidate.
- [ ] Set launch window, approver, implementer, and rollback owner.

### Release

- [ ] Deploy production build.
- [ ] Validate HTTPS, canonical host, redirects, and security headers.
- [ ] Purge/refresh caches if required.
- [ ] Test primary conversions from a real mobile connection.
- [ ] Confirm structured data and social sharing on the production URL.
- [ ] Confirm staging remains private/non-indexable.

### Immediate monitoring

- [ ] Monitor errors, availability, media delivery, and third-party failures.
- [ ] Verify analytics events in production.
- [ ] Check reservation and call actions from multiple devices.
- [ ] Check performance after CDN caches warm.
- [ ] Record launch time, version, known issues, and decisions.

### Rollback triggers

Rollback or disable the affected feature if:

- The site or primary CTA is unavailable.
- Reservation traffic goes to the wrong destination.
- Phone, address, or hours are materially incorrect.
- Video causes severe mobile failure or prevents page interaction.
- Consent/privacy behaviour is noncompliant with the approved plan.
- A production asset lacks confirmed rights.

## 20. Phase 12 — Post-launch optimisation

### First 24 hours

- Review availability, errors, CTA functionality, media delivery, and consent behaviour.
- Correct critical factual or functional issues immediately.
- Record baseline performance and conversion-event counts.

### First 7 days

- Review CTA placement performance by device.
- Check common screen sizes, browsers, and traffic sources.
- Review missed or broken search queries in Search Console when available.
- Identify exits before practical information or reservation actions.
- Gather owner feedback on calls, bookings, and customer questions.

### First 30 days

- Compare reservation-click, call, directions, dish-showcase reach, and tour-completion rates.
- Test only one meaningful hypothesis at a time.
- Potential tests: hero support copy, CTA wording, mobile bar timing, dish-image order, poster frame, or practical-information placement.
- Do not optimise solely for clicks if booking quality or customer clarity decreases.
- Revalidate hours, featured dishes, image rights, and third-party destinations.

### Maintenance cadence

- Weekly: hours exceptions and featured-dish availability during the active launch period.
- Monthly: links, featured-dish/photo approvals, analytics health, errors, and basic performance.
- Quarterly: content accuracy, accessibility regression, structured data, media rights, and dependency updates.
- Before holidays: exceptional hours and booking availability.

## 21. Risk register

| Risk | Probability | Impact | Mitigation | Blocking gate |
|---|---|---|---|---|
| Hours are incorrect or conflicting | High | High | Owner-approved hours sheet; recheck before launch | Yes |
| Reservation provider is unknown | High | High | Confirm URL/provider before CTA finalisation | Yes |
| Supplied video is AI-generated or inaccurate | Medium | High | Written representation and commercial-use approval | Yes |
| Video is heavy on mobile | High | High | Poster-first loading, mobile encode, pause off-screen, reduced-motion state | Yes |
| Video text contrast changes frame by frame | High | High | Responsive scrim and frame-sampled contrast testing | Yes |
| Tripadvisor assets are reused without rights | Medium | High | Use owned/licensed media only | Yes |
| Rating/review claims become stale | High | Medium | Avoid central dynamic rating; date and source any approved use | No |
| Featured dish no longer matches reality | Medium | High | Owner approval, dated dish shortlist, and replacement process | Yes |
| Tripadvisor food photo lacks reuse permission | High | High | Written photographer licence or newly commissioned replacement | Yes |
| Sticky mobile CTA covers content | Medium | High | Safe-area and footer-collision specification plus device QA | Yes |
| Third-party widget harms privacy/performance | Medium | High | Link-first integration; consent map; lazy loading | Yes |
| Motion causes discomfort | Medium | High | Reduced-motion poster, no scroll-jacking, bounded contextual parallax, and automatic capability downgrade | Yes |
| Figma/build drift | Medium | Medium | Approved version, token mapping, visual regression review | No |
| English translation expands beyond layout | Medium | Medium | Longest-string design test and fluent review | No |
| Owner cannot update holiday hours | Medium | High | Define operational update path before launch | Yes |
| Domain/DNS access is unavailable | Medium | High | Verify access and backup early | Yes |

## 22. Planned analytics interpretation

The landing page can measure intent but may not be able to measure completed reservations if the booking provider does not return a confirmation signal.

### Primary indicators

- Reservation click-through rate.
- Mobile reservation click-through rate.
- Phone-click rate.
- Directions-click rate.
- Dish-showcase reach rate.
- Tour-completion rate.
- Booking-provider completion rate, only if reliably available.

### Diagnostic indicators

- Hero CTA versus sticky-bar CTA share.
- Conversion action by device class.
- Conversion action by language.
- Video play/pause behaviour when user-controlled.
- Performance and error rate by device/browser.

### Guardrails

- No dark patterns or artificial urgency.
- No automatic sound.
- No misleading “reservation completed” measurement from a simple outbound click.
- No personal data in analytics events.
- No optimisation that hides essential business information.

## 23. Definition of done

The project is complete only when:

- [ ] `Product.md` and this plan reflect the final approved scope.
- [ ] Business facts, hours, booking, phone, map, featured dishes, and media rights are approved.
- [ ] Italian copy is final; optional English copy is complete and reviewed.
- [ ] Figma foundations, desktop, mobile, states, and prototype are approved by version.
- [ ] Implementation matches approved design and content.
- [x] Hero video has optimised sources, poster, control, fallback, pause, and reduced-motion behaviour.
- [ ] Reservation, call, directions, tour chapters, and dish showcase pass production tests.
- [ ] Accessibility testing passes critical tasks with no open critical/high defects.
- [ ] Responsive and browser matrices are completed.
- [ ] Performance targets and third-party budgets are accepted.
- [ ] Metadata, structured data, sitemap, and production indexing rules are verified.
- [ ] Consent, privacy, and analytics behaviour match the approved plan.
- [ ] Asset rights are documented.
- [ ] Deployment backup, rollback, and monitoring are operational.
- [ ] Final owner approval and launch approval are recorded.
- [ ] Post-launch monitoring produces no unresolved critical issue.

## 24. Next authorised action

When planning is approved, the next action is **Phase 1 business verification**, not Figma or implementation. The first working session should resolve:

1. Reservation method and official URL.
2. Current address, phone, and weekly hours.
3. Four or five current featured dishes and their approved display names.
4. Reuse permission for selected Tripadvisor photographs or a replacement food-photography plan.
5. Rights and accuracy of the supplied video.
6. Official logo and owned interior photography.
7. Italian-only versus bilingual launch.

Only after those inputs are recorded should wireframes and Figma foundations begin.
