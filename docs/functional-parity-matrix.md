# Functional and Content Parity Matrix

**Purpose:** Source-to-destination register for the repository and public-site audit. The production site at `https://hostleos.org.lk/` is the user-confirmed source of truth. The approved route/content changes are implemented in the working tree; production deployment and dependent service behavior remain unverified.

## Root multipage site

| Source item | Existing content/behavior to preserve | Proposed destination | Audit status |
|---|---|---|---|
| `index.html` | Title; shared navigation/footer/attribution; home eyebrow, heading and paragraph; “Legacy since 1969”, “Youth-led impact”, “Community-first service” pills; “Join Us / Contact” and “Explore Our Story” links; heritage image; four quick-link cards and their exact copy/URLs. | `/` and `/index.html` | Visible production and local page content matched. |
| `about.html` | Title/navigation; About Us hero; both story paragraphs; “Why our story stands apart” heading and all three list items; Leo Club Badge image; cards “Legacy with purpose”, “Community-first”, “Future-ready leadership” and their text. | `/about.html` | Visible production and local page content matched. |
| `impact.html` | Production-matched title/navigation; Our Impact hero and intro; the three Service/Leadership/Innovation pillar cards and text; “Visible action”, “Lasting relationships”, “Momentum that grows” cards and text; full quotation. User requests merge with Mission page content. | `/mission-impact.html`; old route redirects | Combined page and local 301 redirect implemented; active Azure routing remains unverified. |
| `mission.html` | Production-matched title/navigation; Mission & Vision hero; mission body; “Our mission” banner and exact body; Empathy first, Measured impact, Creative execution, Growing legacy cards; Vision for the future text; Purpose-led and People-centred cards; full quotation. User requests merge with Impact page content. | `/mission-impact.html`; old route redirects | Combined page and local 301 redirect implemented; active Azure routing remains unverified. |
| `how-we-serve.html` | Production-matched title/navigation; hero; Community Health Drives, Youth Skills & Tutoring, Community Support & Relief cards and text; Recent Projects with three images, alt strings, labels, and gallery links; Volunteer / Support link; service model heading/list/text; focus areas heading/list; Steady execution and Community feedback cards; quotation. | `/Our Services.html`, combined with Luma calendar | Existing content and calendar are in the new Projects page; local 301 redirect implemented. Active Azure routing and stable embedded rendering remain unverified. |
| New Luma calendar | User-supplied embed: `https://luma.com/embed/calendar/cal-coU7n9QimBhvcZ8/events`. This is not existing content. | `/Our Services.html` (linked as `/Our%20Services.html`) | Implemented with accessible title, responsive sizing, and direct-calendar fallback. Endpoint returned HTTP 200 directly; embedded rendering remains to be verified on staging. |
| `leaders.html` | Title/navigation; hero and the three intro cards; all thirteen leaders, photos, visible names, and role labels in existing order: Anju Gayathri—President; Pasindu Gimhan—Immediate Past President; Hiruni Fernando—1st Vice President; Santhula Wickramasinghe—2nd Vice President; Oshadee Thalagoda—Treasurer; Hasith Eranga—Assistant Treasurer; Sanduni Theekshana—Secretary; Hansika Nawanjalee—Assistant Secretary; Buddika Ashan—Director of PR & Marketing; Hansika Sewwandi—Editor; Sanuda De Silva—Project Development; Kasun Hasaranga—Director of Finance; Sandathara Janakantha—Membership Chairperson. | `/leaders.html` | Inventory mapped locally; names/roles/images are sensitive to official confirmation and must not be corrected or replaced without approval. |
| `gallery.html` | Title/navigation; hero and introduction; 21 image/caption pairs and order in the script; click-to-preview modal; close-control/backdrop behavior. Preserve original source image paths and exact captions. | `/gallery.html` | Inventory mapped locally; keyboard/focus behavior is an identified accessibility gap. |
| `contact.html` | Title/navigation; hero; production Contact & Visit details (`leoclubofcolombohost1969@gmail.com`, `+94 77 197 2325`, Colombo, Sri Lanka); Volunteer or Partner text; form heading; fields (required name/email, optional phone, required message); POST to `/api/contact`; button, Learn More URL, duplicate email, all supporting copy/cards/social links and request/status/reset/failure behavior. | `/contact.html` | Visible details, field, labels, and action now match inspected production markup. Backend implementation and actual delivery remain unverified; local `server.js` still exposes `/contact`. |
| Shared root shell/styles | Brand mark and its alt text; updated seven-route navigation labels/order/active-link styling; footer copyright/attribution; responsive behavior and present breakpoints; current font fallback, colors, and motion. | Shared shell/tokens after source approval | `dist/assets/heritage-theme.css` applies a parchment, gold, and blue editorial system with an asymmetric Home hero, large internal-page hero compositions, scroll reveals, an accessible expandable mobile menu, perspective details, updated `LEO CLUB OF COLOMBO (HOST)` branding, compact linked content footers, skip links, focus states, and reduced-motion styling. Only Home uses the bounded “Loading Leolism ...” intro; other pages open directly. Full-system regression and accessibility certification remain incomplete. |

### User-requested information architecture (implemented in the working tree)

- Combine all existing Impact and Mission blocks at `/mission-impact.html`; locally configured permanent redirects send `/impact.html` and `/mission.html` there.
- Add a navigation item labelled `Projects` with destination `/Our Services.html` (URL-encoded in links as `/Our%20Services.html`), containing the supplied Luma calendar and existing How We Serve content.
- Locally configured permanent redirect sends `/how-we-serve.html` to `/Our Services.html`.
- Test the case-sensitive, percent-encoded route behavior on the active host before deployment.

### Gallery image and caption mapping

All paths are relative to the repository root and remain unchanged in the proposed parity target.

| Source image | Existing caption |
|---|---|
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 09.41.022.jpeg` | Community moment |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 09.41.10.jpeg` | Service activity |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 09.41.11.jpeg` | Leadership gathering |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 09.41.14.jpeg` | Club event |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 09.41.19.jpeg` | Volunteer spirit |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 09.41.20.jpeg` | Campus connection |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 09.41.22.jpeg` | Impact in action |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 09.41.23.jpeg` | Team collaboration |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 09.41.25.jpeg` | Community outreach |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 12.51.28.jpeg` | Shared purpose |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 12.51.34.jpeg` | Leadership moment |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 12.51.51.jpeg` | Friendship and service |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 12.52.02.jpeg` | Future-ready energy |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 12.52.35.jpeg` | Community care |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 12.52.51.jpeg` | Meaningful moments |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 12.53.16.jpeg` | Together for good |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 12.53.17.jpeg` | Celebrating service |
| `dist/assets/images/Gallery/WhatsApp Image 2025-10-29 at 12.53.18.jpeg` | Legacy in motion |
| `dist/assets/images/Gallery/WhatsApp Image 2026-01-26 at 00.11.28.jpeg` | Memorable chapter |
| `dist/assets/images/Gallery/WhatsApp Image 2026-01-26 at 00.11.31.jpeg` | Growing impact |
| `dist/assets/images/Gallery/WhatsApp Image 2026-01-26 at 00.11.33.jpeg` | Community connection |

## Form/email operation map

| Source | Input or operation | Existing behavior that must remain | Destination parity test required |
|---|---|---|---|
| Production `contact.html` | `name` | Required text input; serialized with field name `name`. | Native and server validation, success/failure UX; backend payload contract confirmation. |
| Production `contact.html` | `email` | Required email input; serialized with field name `email`. | Email-format validation and backend handling confirmation. |
| Production `contact.html` | `phone` | Optional tel input with placeholder `Optional`; serialized with field name `phone`. | Preserve its name/optional status; confirm backend handling with API owner. |
| Production `contact.html` | `message` | Required textarea; serialized with field name `message`. | Validation and payload contract confirmation. |
| Production browser script | POST to `/api/contact` | URL-encoded body; “Sending message...” state; success message and reset; server error or generic network failure message; `aria-live="polite"` status node. | Preserve current production action and response contract; verify only with authorized staging/test backend. |
| Repository browser script | POST to `/contact` | URL-encoded body; client-side status/reset and error behavior. | Does not match production; do not swap production action to local path absent backend-owner approval. |
| `server.js` notification | Notification to `MAIL_TO` | Default recipient `info@leoHOST.org`; sender `MAIL_FROM` defaults to `DoNotReply@hostleos.org.lk`; subject `New website contact from ${name}`; reply-to submitted email/name. | Confirm deployed values via managed environment, verify actual recipient and reply-to without exposing secrets. |
| `server.js` confirmation | Auto-response to submitter | Subject `We received your message, ${name}`; existing body includes the submitted message and club signoff; reply-to `MAIL_TO`. | Verify receipt and headers at a controlled staging mailbox. |
| Azure Communication Services | Email transport | Existing code supports connection string or endpoint/access-key configuration and currently requires successful ACS sends. | Staging credentials/configuration, provider delivery result, notification and confirmation receipt, failure handling. |
| Azure Static Web Apps | Route deployment | Workflows show `api_location: ""`; local Node `/contact` mapping is not established. Production `GET /api/contact` returns 404; POST was not tested. | Active Azure resource unknown. Identify backend owner and use authorized staging. Do not infer delivery from a visual success state. |

No recipient, sender, subject, reply-to, consent, attachment, CC/BCC, or anti-spam behavior may be changed based on this matrix. Production recipient/sender/confirmation behavior is unknown; local ACS source does not prove the production email provider or routing.

## Alternate and archived content sets

| Source | Inventory | Required disposition before migration |
|---|---|---|
| `dist/index.html` | Separate home/about/upcoming-project/team/blog/contact/Trustpilot-style sections; its own Home/About/Upcoming Project/Team/Blog/Contact navigation; a different contact email (`info@leoiit.org`); a different board roster; visible project/team/gallery copy; three unresolved image references. Production `GET /dist/index.html` returns this page. | Confirm whether it remains a public archive, should redirect, or has another approved disposition. Do not merge its copy or delete it without approval. |
| `index.html.hero-backup` | Earlier single-page home, About Us, Upcoming Project/“FEED WITH LOVE”, eight-person Board of Directors, Blog & News, Photo Gallery, Get in Touch, reviews, and Photo Memories sections. Includes names and content not present on the root pages. | Confirm whether it is an archival reference or a content source of record. Keep unchanged until answered. |
| Unreferenced media | Two Gallery files outside the root gallery manifest, two additional leader-image variants, and other logo/legacy images in the asset folders. | Obtain approved inventory and intended use; do not silently discard, correct filenames, or substitute assets. |

## Routes, links, labels, and metadata

| Source surface | Existing inventory | Destination treatment |
|---|---|---|
| Root navigation | Home, Who We Are, Our Impact, Mission, How We Serve, Our Leaders, Gallery, Get Connected; eight `.html` routes. | Preserve existing routes; requested changes are recorded in “User-requested information architecture.” |
| Home calls to action | “Join Us / Contact” → `contact.html`; “Explore Our Story” → `about.html`. | Preserve exact label and target. |
| Home quick links | Who We Are, Our Impact, Mission, Get Connected, each with existing descriptive text. | Preserve card count, label, copy, and destination. |
| Service projects | Three project cards/link targets to `gallery.html`; Volunteer / Support to `contact.html`. | Preserve each existing image, alt string, label, and target. |
| Contact social links | Facebook, TikTok, Instagram, LinkedIn, WhatsApp with the full destinations recorded in `current-site-audit.md`. | Keep each destination and target-window/security attributes unless approved. |
| Page metadata | Root page titles are route-specific; charset and viewport are present. No description/canonical/OG metadata, sitemap, robots policy, or structured data was found. | Preserve titles and establish SEO baseline from production before additions or metadata changes. |
| Fallback and error behavior | `staticwebapp.config.json` and `server.js` both fall back to `index.html` for navigation/missing files. Production `GET /robots.txt` and `/sitemap.xml` return home-page HTML with HTTP 200; `GET /api/contact` returns 404. | Add crawler resources/API handling only with deployment approval; do not infer POST behavior from GET. |

## Proposed addition, kept separate from parity

The user supplied the Luma calendar embed for `https://luma.com/embed/calendar/cal-coU7n9QimBhvcZ8/events` and requested that it be added to the new Projects destination at `/Our Services.html` (linked as `/Our%20Services.html`). The iframe and a direct-calendar fallback link are implemented as **new additions**, not existing source content, and do not replace an existing section. The endpoint returned HTTP 200 directly; stable embedded rendering and external loading/privacy behavior still need checking before release.

## Completion states

- **Mapped locally:** source structure or behavior is identified in checked-in files.
- **Unverified against production:** requires access to live-only settings, backend behavior, provider configuration, or delivery evidence.
- **Blocked:** a user decision/access is required before selecting a destination or changing behavior.
- **Not approved:** do not treat this inventory as approval to change existing content, contact/email behavior, or infrastructure. The user-requested page/redirect changes above are approved for the next implementation phase, subject to preserving existing routes.

No source content has been edited as part of this audit. The two SRS files supplied by the user remain unchanged.
