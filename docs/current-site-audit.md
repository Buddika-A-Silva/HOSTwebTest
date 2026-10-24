# Current-Site Audit

**Audit date:** 24 October 2026

**Scope:** Repository, local-file, and public production-page inspection. The live site was inspected at https://hostleos.org.lk/ on 24 October 2026. Production form submission/email receipt was not tested because backend access is unavailable.

## Executive summary

The repository contains two materially different website versions:

1. Eight linked multipage pages at the repository root.
2. A separate earlier single-page website at `dist/index.html`, plus `index.html.hero-backup`.

Both Azure Static Web Apps workflows deploy from the repository root, and the static-site configuration explicitly serves `dist/*`. The pages therefore cannot be treated as build-only artifacts without accounting for `/dist/index.html`, which is publicly accessible. The user confirmed the production website is authoritative for current content.

The public production contact page differed from the repository at the time of the audit: it publishes different email/phone details, includes an optional phone field, and posts to `/api/contact`. The working-tree markup now matches those visible details and the form contract. A Node server implementing `/contact` and Azure Communication Services email is present, but both checked-in workflows specify an empty `api_location`. The live email backend and delivery behavior remain unverified.

The supplied Luma embed is new functionality, not existing site content. It has since been added to the user-approved Projects page alongside the existing How We Serve content; see the implementation checkpoint below for validation limits.

## Inspection boundary and evidence

Inspected:

- Root pages: `index.html`, `about.html`, `impact.html`, `mission.html`, `how-we-serve.html`, `leaders.html`, `gallery.html`, and `contact.html`.
- Alternate page: `dist/index.html`.
- Historical file: `index.html.hero-backup` (not linked by the root navigation).
- Shared styles and scripts under `dist/assets/`.
- `server.js`, `staticwebapp.config.json`, `package.json`, and both `.github/workflows/azure-static-web-apps-*.yml` files.
- Local links and image references, public page content, and page layout at 320, 375, 768, and 1440 CSS-pixel viewports in local and production browsers.

Not available or not tested:

- Production analytics, redirect configuration, deployment logs, provider-side email setup/delivery records, and full DNS/SSL audit.
- Azure resource configuration and deployment logs; runtime environment variables; provider-side email setup and delivery records.
- A staging environment and permission for an end-to-end email test; the user confirmed no access to the mail backend.
- Approved content inventory, official brand-asset register, and current supported-browser/device matrix.
- Automated accessibility, performance, security, and cross-browser test results. The repository has no test runner scripts; the root `test` file contains only `test`.

The SRS files supplied in the repository were read as project inputs and left unchanged. Public root-page content was compared with the corresponding repository pages. The live contact form was inspected but not submitted.

## Production comparison

The production site at `https://hostleos.org.lk/` is the user-confirmed content source of truth. The public home page and inspected `about.html`, `impact.html`, `mission.html`, `how-we-serve.html`, `leaders.html`, and `gallery.html` matched the visible content in the local root pages. The contact page has critical live differences:

| Production evidence | Local repository comparison | Status |
|---|---|---|
| Published email is `leoclubofcolombohost1969@gmail.com` in both contact locations. | Local page instead uses `info@leoHOST.org`. | Preserve production email. |
| Published phone/WhatsApp is `+94 77 197 2325`. | Local page instead uses `+94 71 000 0000`. | Preserve production phone. |
| Form has required `name`, required `email`, optional `phone` (`type="tel"`, placeholder `Optional`), and required `message`. | Local form omits `phone`. | Preserve the live optional field and its `phone` name. |
| Form method is POST and action is `/api/contact`. | Local page and `server.js` use `/contact`. | Backend contract mismatch; do not switch the production action based on local code. |
| `GET /api/contact` returns 404. | The endpoint may be POST-specific. | No POST attempt; no conclusion about delivery. |
| `GET /robots.txt` and `GET /sitemap.xml` return HTTP 200 with `Content-Type: text/html`; the returned content is the home page. | No valid robots or sitemap files are in the repository. | SEO endpoint/fallback issue verified. |
| `GET /dist/index.html` returns the older one-page website. | `dist/index.html` is present and differs from current root pages. | Legacy URL is publicly exposed; retain or retire only with approval. |

The user confirmed no access to the mail backend. The checked-in Azure Communication Services code is not proof that it is the current production provider or that the live `/api/contact` route sends mail.

## Page and route inventory

| Source | Current local route | Inventory |
|---|---|---|
| `index.html` | `/` and `/index.html` | Root navigation, brand mark and “Since 1969”; home hero text; three legacy/service pills; two calls to action; one image; four quick-link cards; copyright/attribution. |
| `about.html` | `/about.html` | About hero; two history/identity paragraphs; “Why our story stands apart” and three bullets; badge image; three identity/value cards. |
| `impact.html` | `/impact.html` | Impact hero and introductory paragraph; three pillar cards (Service, Leadership, Innovation); three supporting cards; quotation. |
| `mission.html` | `/mission.html` | Mission hero and body; mission banner; four value cards; future vision; two supporting cards; quotation. |
| `how-we-serve.html` | `/how-we-serve.html` | Programs hero; three program cards (Health, Education, Welfare); Recent Projects with three image/label links; volunteer/support link; service model and three bullets; focus areas and three bullets; two cards; quotation. |
| `leaders.html` | `/leaders.html` | Leadership hero; three introductory cards; thirteen people with names, images, and titles (listed in the parity matrix). |
| `gallery.html` | `/gallery.html` | Gallery hero and introduction; JavaScript creates 21 image/caption cards; click opens a modal and clicking the close control or backdrop closes it. Two additional files in the Gallery folder are not in the rendered manifest. |
| `contact.html` | `/contact.html` | Contact hero; published production email, phone/WhatsApp and location; volunteer/partner copy; four-field quick-message form (including optional phone); Learn More link; second email and supporting copy/cards; five social links. Includes client submission/status script. |
| `dist/index.html` | `/dist/index.html` (deployment exposure needs confirmation) | Earlier one-page site with different navigation, copy, people, sections, Trustpilot-like static content, carousel controls, decorative canvas/floating-image scripts, and at least three missing image references. |
| `index.html.hero-backup` | Not linked; exact serving behavior unverified | Historical single-page snapshot with distinct text, leadership names, photo gallery, contact, blog, reviews, and photo memories. Preserve as an input until its archival/public status is decided. |

The eight root pages each have a page-specific title, one `h1`, and a common eight-link navigation. Root pages use relative `.html` URLs; no root-page link or referenced root-page image was found missing by local file inspection. This does not establish that external links or production routes work.

### Root navigation and external links

Shared navigation labels and destinations:

`Home` → `index.html`; `Who We Are` → `about.html`; `Our Impact` → `impact.html`; `Mission` → `mission.html`; `How We Serve` → `how-we-serve.html`; `Our Leaders` → `leaders.html`; `Gallery` → `gallery.html`; `Get Connected` → `contact.html`.

External links in the root pages:

- Email: `mailto:info@leoHOST.org` (appears twice on the contact page).
- Facebook: `https://www.facebook.com/share/17tmrWZD2H/`
- TikTok: `https://vm.tiktok.com/ZS9Jc2S7o2oud-fDPKy/`
- Instagram: `https://www.instagram.com/leoclubcolombo?igsh=MXI3dTIyZnBxbGkwdg==`
- LinkedIn: `https://www.linkedin.com/company/leo-club-of-colombo-host/`
- WhatsApp channel: `https://whatsapp.com/channel/0029VaezfAGC6ZviU54YqX23`

The `dist` page and historical backup contain additional destinations and content that are not summarized as root-page parity. They require production/source-of-truth confirmation before they can be excluded or merged.

## Media and files

There are 70 files under `dist/assets`, including 53 files under `dist/assets/images`. This inventory is exhaustive by folder and preserves original filenames:

- `dist/assets/logo.png`, `dist/assets/1logo.png`
- `dist/assets/images/`: `Past-president.png`, `R.png`, `R1.png`, `R12.png`, `Upcoming-Project.jpeg`
- `dist/assets/images/Gallery/`:
  - `WhatsApp Image 202455-10-29 at 12.53.18.jpeg`
  - `WhatsApp Image 2025-10-29 at 09.41.022.jpeg`
  - `WhatsApp Image 2025-10-29 at 09.41.10.jpeg`
  - `WhatsApp Image 2025-10-29 at 09.41.11.jpeg`
  - `WhatsApp Image 2025-10-29 at 09.41.14.jpeg`
  - `WhatsApp Image 2025-10-29 at 09.41.19.jpeg`
  - `WhatsApp Image 2025-10-29 at 09.41.20.jpeg`
  - `WhatsApp Image 2025-10-29 at 09.41.22.jpeg`
  - `WhatsApp Image 2025-10-29 at 09.41.23.jpeg`
  - `WhatsApp Image 2025-10-29 at 09.41.25.jpeg`
  - `WhatsApp Image 2025-10-29 at 12.51.28.jpeg`
  - `WhatsApp Image 2025-10-29 at 12.51.34.jpeg`
  - `WhatsApp Image 2025-10-29 at 12.51.51.jpeg`
  - `WhatsApp Image 2025-10-29 at 12.52.02.jpeg`
  - `WhatsApp Image 2025-10-29 at 12.52.35.jpeg`
  - `WhatsApp Image 2025-10-29 at 12.52.51.jpeg`
  - `WhatsApp Image 2025-10-29 at 12.53.16.jpeg`
  - `WhatsApp Image 2025-10-29 at 12.53.17.jpeg`
  - `WhatsApp Image 2025-10-29 at 12.53.18.jpeg`
  - `WhatsApp Image 20258-10-29 at 09.41.10.jpeg`
  - `WhatsApp Image 2026-01-26 at 00.11.28.jpeg`
  - `WhatsApp Image 2026-01-26 at 00.11.31.jpeg`
  - `WhatsApp Image 2026-01-26 at 00.11.33.jpeg`
- `dist/assets/images/leaders/`:
  - `2Director of PR & Marketing - Buddika Ashan.png`
  - `2nd Vice President - Santhula wickramasinghe.jpeg`
  - `Assisatant secretary - Hansika Nawanjalee.jpeg`
  - `Club Assistant Treasure - Hasith Eranga.jpg`
  - `Club Director of Finance- KASUN HASARANGA.jpeg`
  - `Club Immediate Past President - Pasindu Gimhan.jpg`
  - `club president - anju gayathri.jpeg`
  - `Club Vise President - Hiru Fernando.jpg`
  - `Director of PR & Marketing - Buddika Ashan.jpeg`
  - `Director of PR & Marketing - Buddika Ashan1.png`
  - `Director of Project management - Sanuda De Silva.jpeg`
  - `Editor - Hansika Sewwandi.jpg`
  - `Membership Chairperson - Sandathara Janakantha.jpg`
  - `Secretary - Sanduni theekshana.png`
  - `Treasure - Oshadee Thalagoda.jpeg`
- `dist/assets/images/projects/`: `WhatsApp Image 2026-06-30 at 19.49.52 (1).jpeg`, `WhatsApp Image 2026-06-30 at 19.49.53 (1).jpeg`, `WhatsApp Image 2026-06-30 at 19.49.54 (1).jpeg`
- `dist/assets/images/logo/`: `facebook.jpg`, `instergram.png`, `legacy.png`, `legacy1.png`, `linkedIn.png`, `tiktok.png`, `whatsapp.jpg`
- `dist/assets/floating/`: `WhatsApp Image 2026-01-26 at 00.11.29.jpeg`, `WhatsApp Image 2026-02-12 at 02.57.19.jpeg`, `WhatsApp Image 2026-02-12 at 02.59.42.jpeg`, `WhatsApp Image 2026-02-12 at 02.59.46.jpeg`
- Styles/scripts/data: `divi.css`, `floating.css`, `floating.js`, `floating.json`, `hero-effect.css`, `hero-effect.js`, `multipage.css`, `site-bg-inject.js`, `site-enhancements.css`, `site-enhancements.js`.
- `dist/assets/README_president_image.md`

Other tracked support inputs include `tools/crop_president.py`, `compare_images.ps1`, a checked-in ACS package archive, and `temp_acspkg/`. Their retention and purpose need to be confirmed; no files were removed.

Three references in `dist/index.html` do not resolve in the local asset tree: `assets/placeholder-about.jpg`, `assets/placeholder-projects.jpg`, and `assets/images/president.jpg`. The first two are hidden in markup; the board image is visible. Root-gallery markup also has an initially empty modal-image `src`; it is populated only after a card is clicked.

Image captions/alt strings, names, roles, labels, and asset paths are source content. They are not approved for correction or replacement by this audit.

## Form and email behavior: production and source baselines

| Item | Observed in repository |
|---|---|
| Production form | `contact.html`, `method="post"`, `action="/api/contact"`; URL-encoded client request. |
| Production fields | `name` text, `email` email, optional `phone` tel with placeholder `Optional`, and `message` textarea. `name`, `email`, and `message` use native `required`. |
| Repository form | `id="contact-form"`, `method="post"`, `action="/contact"`; it contains `name`, `email`, and `message`, but no `phone`. All three use native `required`. |
| Other form markup | Neither inspected form contains explicit `maxlength`, consent checkbox, hidden routing field, attachment field, or anti-spam control. |
| Client states | Script writes “Sending message...”; success writes “Message sent successfully. Thank you!” and resets the form; server/client failure writes an error message. A polite live region is present. Browser-native required/email checks are in effect. |
| Local server route | `server.js` handles `POST /contact`; trims the three values and rejects missing values with HTTP 400. This differs from the production action. |
| Email service | Azure Communication Email SDK. It accepts `AZURE_COMMUNICATION_CONNECTION_STRING`, or endpoint plus access key. Endpoint/key alias environment variable names are also supported. |
| Notification | Sender defaults to `DoNotReply@hostleos.org.lk`; recipient defaults to `info@leoHOST.org` (overridable by `MAIL_FROM` / `MAIL_TO`). Subject is `New website contact from ${name}`. Reply-to is the submitted email/name. |
| Confirmation | A second message is sent to the submitter. Subject is `We received your message, ${name}`; reply-to is the configured recipient. |
| CC/BCC and attachments | None are configured in the inspected server payload. |
| Failure behavior | Server returns a generic failure plus a `detail` field; client displays the returned `error` when available. The two messages are sent sequentially; real delivery/receipt is not verified. |

At the time of the audit, the local markup’s visible labels were not associated with controls via matching `for`/`id`. The contact page now includes associated label/control IDs, but the production `/api/contact` implementation and behavior remain unknown. Server-side length/type/format validation and request-size limits are not evident in the local server. User-submitted values are interpolated into local HTML email bodies without output encoding. These are audit findings, not authorization to change workflow or content.

Because the Azure workflows have `api_location: ""`, repository evidence does not show how the Node handler is deployed or mapped to either `/contact` or production `/api/contact`. The workflows also target two separately named Static Web Apps and use different `output_location` values (`"/"` and `""`). The active deployment is unknown. No real email was sent during this audit.

## Accessibility, responsive behavior, metadata, and quality findings

### Responsive checks

Observed at 320, 375, 768, and 1440 CSS-pixel viewport settings in local and production browsers:

- Production and local `about.html` overflow horizontally at 320; measured document width is 416 CSS pixels. Local testing also found overflow at 375.
- Production and local `mission.html` overflow at 1440; measured document width is 1529 CSS pixels.
- Production `contact.html` has no measured horizontal overflow at 320, 375, 768, or 1440.
- Other sampled root pages did not report overflow at the tested widths. This is a targeted measurement, not a cross-browser/mobile-device certification.
- Production and local `/dist/index.html` overflow at 320; measured document width is 825 CSS pixels.
- The legacy route also reports three broken image references described above.

### Accessibility and motion

- Positive baseline: semantic `main`, `nav`, headings, text alternatives on most images, native links/buttons, native required fields, and a polite contact status region.
- At audit time, root navigation did not mark the current page with `aria-current`, and there were no skip links. The working tree now labels navigation, marks the current page, and adds skip links/main targets on the root pages.
- Contact labels lacked programmatic control association at audit time; matching IDs/labels have since been added. The error flow does not identify/associate field-level errors.
- Gallery modal/close controls are generic `div` elements without dialog semantics, keyboard close handling, or focus management. The backdrop also closes the modal.
- A gallery card is rendered as an anchor with `href="#"` and click behavior; card controls and modal need keyboard and focus-state verification.
- The legacy page auto-advances a carousel every four seconds and runs a continuous canvas animation plus image crossfades. No `prefers-reduced-motion` handling was found in inspected styles/scripts; the carousel pauses only on pointer hover.
- No automated WCAG 2.2 AA evaluation has been run.

### SEO and performance

- Root pages have individual `<title>` values and viewport/charset metadata. No descriptions, canonical URLs, social metadata, or structured data were found in the inspected root pages/configuration. Production `/robots.txt` and `/sitemap.xml` both respond with `200 text/html` containing the homepage rather than valid crawler files.
- No image/font/network performance budget or measurement is present. Fonts use system fallbacks; no local font files or external font service were found in the asset inventory.
- `staticwebapp.config.json` rewrites navigation fallbacks to `index.html`; `server.js` also serves `index.html` for missing files. Production 404 and URL behavior need validation before preserving/improving redirects.

## Deployment, source-control, and operational risks

1. **Multiple snapshots:** root, `dist`, and backup contain different routes, text, assets, contacts, and leaders; production confirms `dist/index.html` remains publicly exposed.
2. **Contact contract mismatch:** production posts to `/api/contact` and includes an optional phone field; local source uses `/contact` and has no phone field. Backend owner and routing are unknown.
3. **Two deployment targets:** two GitHub workflow files target different Static Web Apps and output directory settings.
4. **Legacy content/resources:** `dist/index.html` is publicly served and contains distinct content and missing image references.
5. **False-success/404 risk:** static fallback behavior may make unknown paths render the home page rather than a genuine 404; confirm at the active host.
6. **No test/acceptance automation:** package scripts contain no build, test, lint, or accessibility commands; a root file named `test` is not a test suite.
7. **Uncommitted project inputs:** the supplied `SRS.pdf` and `.docx` are currently untracked. They were not altered. New audit documents are the only files added for this audit.
8. **SEO route fallback:** production robots/sitemap requests return HTML home content instead of valid crawler files.

## Decisions and remaining gates

The user approved:

- Combine all existing Impact and Mission content on `/mission-impact.html`.
- Add a navigation tab labelled `Projects` and place the Luma calendar plus all existing How We Serve content on the user-selected route `/Our Services.html` (URL-encoded as `/Our%20Services.html` in links).
- Permanently redirect `/how-we-serve.html` to `/Our Services.html`.
- Permanently redirect both `/impact.html` and `/mission.html` to `/mission-impact.html`.

Validate case sensitivity and percent-encoded path handling on the active host before deployment. The active Azure deployment is unknown. The user has no access to the mail backend, so production email delivery cannot yet be verified; identify a backend owner and safe staging test process before claiming launch readiness. Approved brand assets remain to be confirmed.

## Implementation checkpoint (24 October 2026)

The following approved changes are present in the working tree:

- The shared root-page theme was refined toward gold and parchment with restrained charcoal contrast, warm metallic gradients, lighter glass surfaces, and an editorial layout with fewer boxed content cards. The mobile navigation is a compact header with an accessible expandable two-column menu; current route, Escape, outside click, and reduced-motion behavior were checked. The archived `/dist/index.html` remains an older public site and was not visually restyled; its displayed club name was updated to the approved wording.
- The shared theme uses parchment/ivory surfaces with blue gradients, warm gold accents, dark-ink editorial typography, and a restrained serif/sans-serif pairing. The Home page uses an asymmetric image-led hero; internal pages use large editorial headings and abstract, restrained geometric accents. Sections and leader cards reveal progressively when scrolled into view; reduced-motion preferences bypass the Home intro and decorative motion. The shared brand label is `LEO CLUB OF COLOMBO (HOST)`. Only Home uses the bounded “Loading Leolism ...” intro; other pages open directly. Leader cards have distinct name and role treatments and long-title wrapping. The Arctic Technologies attribution is a compact linked footer at the bottom of each shared-theme HTML page. These visual changes are not evidence of WCAG 2.2 AA conformance.

- `mission-impact.html` combines the existing Mission and Impact sections. Navigation and home-page quick links point to it; Azure and local-server configurations redirect `/mission.html` and `/impact.html` with HTTP 301 behavior.
- `Our Services.html` is the Projects destination. It retains the existing How We Serve page content and includes the user-supplied Luma calendar iframe, with a direct-calendar fallback link. Navigation points to `/Our%20Services.html`; both routing configurations redirect `/how-we-serve.html`.
- `contact.html` now displays the live published email and phone, includes the live optional `phone` field, and posts to `/api/contact`. Labels have associated controls. This is a markup parity change only: no POST or actual email delivery was tested, and the active backend, recipient routing, and production response semantics remain unverified. The local `server.js` still implements `/contact`, so local form submission is not proven to match production.
- Shared page navigation now has a label and identifies the current page; root pages have skip links and main-content targets. Existing focus-visible and reduced-motion styles remain in place.
- The local Node server returned HTTP 200 for the new pages and HTTP 301 with expected destinations for the legacy routes; query preservation was also checked. Azure path matching and redirects have not been exercised in the active production deployment.
- After applying the new theme, layout was checked at 320, 375, 768, and 1440 CSS-pixel widths on Home, About, Mission & Impact, Projects, Leaders, Gallery, and Contact. The document width did not exceed the viewport in those checks. This is not full cross-browser or WCAG certification.
- The Luma embed endpoint returned HTTP 200 in a direct request, but the integrated local browser did not render the iframe and logged an aborted request. The direct-calendar fallback is present; stable embed rendering needs a staging/production browser check.

This checkpoint does not complete the redesign or certify launch readiness. Production email delivery, Azure routing, the public legacy `/dist/index.html` disposition, cross-browser/accessibility/performance/security checks, staging approval, rollback, and deployment/handover remain open.
