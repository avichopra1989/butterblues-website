# ButterBlues — website

A single-page static site for **butterblues.com**. No build step, no dependencies,
no framework. Open `index.html` in a browser and it works.

```
index.html                 the whole page
404.html                   friendly not-found page
CNAME                      tells GitHub Pages your domain is butterblues.com
.nojekyll                  stops GitHub from re-processing the files
robots.txt / sitemap.xml   for search engines
assets/css/styles.css      all styling
assets/js/main.js          nav, scroll reveals, form handling
assets/img/                logo mark + favicons
```

---

## 1. Put it on GitHub

1. Create a **public** repository. Name it anything — `butterblues-site` is fine.
2. Upload every file and folder in this directory, keeping the structure exactly as it is.
   The quickest way: on the repo page choose **Add file → Upload files**, drag the
   whole contents in, then **Commit changes**.
3. Go to **Settings → Pages**.
4. Under *Build and deployment*, set **Source** to `Deploy from a branch`,
   **Branch** to `main` and folder to `/ (root)`. Save.
5. Wait two or three minutes. Your site appears at `https://<your-username>.github.io/<repo>/`.

> `.nojekyll` and `CNAME` are already included, so there's nothing to add here.
> On Windows and macOS, files starting with a dot are hidden — make sure
> `.nojekyll` actually got uploaded (you'll see it in the repo file list).

## 2. Point butterblues.com at it (GoDaddy)

In GoDaddy: **My Products → your domain → DNS → Manage DNS**.

Delete any existing `A` records for `@` and any `CNAME` for `www` that GoDaddy
added by default (usually a parked-page record), then add these:

| Type  | Name | Value                      | TTL      |
|-------|------|----------------------------|----------|
| A     | @    | `185.199.108.153`          | 1 hour   |
| A     | @    | `185.199.109.153`          | 1 hour   |
| A     | @    | `185.199.110.153`          | 1 hour   |
| A     | @    | `185.199.111.153`          | 1 hour   |
| CNAME | www  | `<your-username>.github.io` | 1 hour  |

All four `A` records are needed — they're GitHub's four Pages servers.
Replace `<your-username>` with your actual GitHub username, and keep the trailing
`.github.io` (no repo name, no `https://`).

Then back in **GitHub → Settings → Pages**:

1. Under *Custom domain*, enter `butterblues.com` and save.
   GitHub will check the DNS — this can take anywhere from ten minutes to a few hours.
2. Once the check passes, tick **Enforce HTTPS**. GitHub issues the SSL certificate
   for free. If the tickbox is greyed out, the certificate isn't ready yet; come
   back in an hour.

Both `butterblues.com` and `www.butterblues.com` will work, and GitHub redirects
one to the other automatically.

If something looks wrong, GitHub's own guide is the best reference:
<https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site>

---

## 3. Swapping the drawings for real photos

Every product currently shows a gold line drawing. Each one lives in a
`.tile-shot` box. To use a photo instead, replace the `<svg>` line with an `<img>`:

```html
<!-- before -->
<div class="tile-shot"><svg aria-hidden="true"><use href="#ico-cookie"></use></svg></div>

<!-- after -->
<div class="tile-shot">
  <img src="assets/img/chocolate-chip.jpg" alt="Chocolate chip cookies cooling on a rack">
</div>
```

Keep the `.tile-shot` wrapper — it handles the cropping, so photos of slightly
different sizes still line up. A few notes:

- **Shape:** roughly 4:3 landscape. Anything around 1200 × 900 px is plenty.
- **Weight:** save as JPEG at about 80% quality and keep each file under 300 KB,
  or the page gets slow on phone data. Free tools: [Squoosh](https://squoosh.app).
- **`alt` text:** describe what's in the photo. It's what people using screen
  readers hear, and Google reads it too.
- The **About** section already uses a real photo (`assets/img/photos/sisters.jpg`,
  4:5 portrait). Swap that file, or edit the `<img src="...">` in the `about-art`
  block in `index.html`, to update it.

You can mix and match: photos for the bakes you've shot, drawings for the rest.

---

## 4. Making the form send by itself

Right now the enquiry form opens the visitor's own email app or WhatsApp with
everything filled in. That works with zero setup and nothing is stored anywhere —
but the visitor has to press send in their own app.

To have submissions land straight in your inbox, use a free form service.
[Formspree](https://formspree.io) is the simplest: sign up, create a form, and it
gives you an endpoint URL. Then in `index.html`, change:

```html
<form id="enquiry" novalidate>
```

to:

```html
<form id="enquiry" action="https://formspree.io/f/YOUR-FORM-ID" method="POST">
```

and in `assets/js/main.js`, delete the whole `form.addEventListener("submit", ...)`
block so the browser submits the form normally. The WhatsApp button keeps working
either way. Formspree's free tier covers 50 submissions a month.

---

## 5. Things to change before you go live

These are placeholders — search for them in the files and replace:

| What | Where | Currently |
|------|-------|-----------|
| Instagram handle | `index.html` (3 places) | `instagram.com/butterblues` |
| FSSAI registration number | `index.html`, footer | `00000000000000` |
| Your city / delivery area | `index.html`, footer + contact section | not stated |
| Reply hours | contact section | 9am–8pm |
| Menu items, lead times, minimums | menu + hampers sections | written as a starting point |
| Prices | not on the page by design | shared on enquiry |

Phone number and email are already set to `+91-8077002435` and
`contact@butterblues.com`. If either changes, update them in `index.html` **and**
at the top of `assets/js/main.js`, where `WHATSAPP` and `EMAIL` are defined.

## 6. Google Analytics

The site is wired up to GA4 (measurement ID `G-ZB57MJQET0`, in the `<head>` of
`index.html`). Besides the automatic pageview tracking, a few custom events
fire so you can see what people actually do on the site, not just that they
visited:

| Event | Fires when | Useful parameters |
|---|---|---|
| `contact_click` | Someone taps WhatsApp, Call, Email, or Instagram anywhere on the page | `method` (whatsapp / phone / email / instagram), `link_location` (hero / contact_section / floating / footer) |
| `generate_lead` | The enquiry form is submitted (either button) | `method` (email / whatsapp), `occasion` |
| `cta_click` | "See the hampers" or "Request a quote" is clicked | `label` |

In GA4, these show up under **Reports → Engagement → Events** within a few
hours (Realtime → Events shows them immediately). If you ever want to see
which contact method people prefer, or which occasion enquiries come in
for most, this is where to look — no extra setup needed.

To point the site at a different GA property later, replace both instances
of `G-ZB57MJQET0` in `index.html` with the new measurement ID.

## 7. Getting a contact@butterblues.com inbox

Buying the domain doesn't give you email. GoDaddy will sell you a mailbox, or you
can use Zoho Mail's free plan for a custom domain, or Google Workspace if you want
Gmail. Whichever you pick, you'll add a few `MX` records in the same GoDaddy DNS
screen — the provider gives you the exact values. This doesn't affect the website;
`A` records serve the site, `MX` records carry the mail.

---

## Notes on the design

- **Palette:** `#3d4f9c` cobalt, `#eacd97` wheat, `#ffffff` white, with a deeper
  `#131a3f` for footers and a cool `#f1f3fa` porcelain instead of the usual cream —
  it keeps the whole page in the blue family the logo set up.
- **Type:** Fraunces for headings (a warm, slightly irregular serif) and Jost for
  everything else — its wide geometric capitals echo the `BLUES` in the logo.
- **Drawings, not stock photos:** the gold line art is the one distinctive move.
  Most bakery sites are wall-to-wall warm photography; a blue page with gold
  drawings looks like nobody else, and it means the site launches complete instead
  of waiting on a photoshoot.
