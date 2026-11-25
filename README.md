# Byte Analytics

Company website for Byte Analytics, an AI consultancy founded in 2019. The page brings together the services, in-house platform, delivery process, Cortex components, engagement packages, and consultation form from the earlier Byte Analytics site.

## Stack

- Frontend: TypeScript, React, Chakra UI, Vite, Vitest
- Backend: Node.js, NestJS, TypeScript, Jest
- The consultation form sends each enquiry by email to nagendragampala03@gmail.com.

## Run on Windows

From this folder, in PowerShell:

```powershell
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

The site runs at port 5173. The enquiry API runs at port 3000. `npm run dev` starts both.

## Environment

Copy `.env.example` if you want to change ports:

- `PORT` — API port, default `3000`
- `FRONTEND_ORIGIN` — allowed browser origin, default `http://localhost:5173`
- `INQUIRY_TO` — inbox that receives the form, default `nagendragampala03@gmail.com`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — mailbox used to send the email

Copy `.env.example` to `.env`. For Gmail, turn on 2-Step Verification, create an app password, and put that value in `SMTP_PASS`. Restart `npm run dev` after saving `.env`. The form cannot send until `SMTP_PASS` is set.

- `VITE_SITE_URL` — the public address of the live site, for example `https://www.example.com` (no trailing slash). Set it for the **frontend** build. It adds canonical links and `sitemap.xml`, and `robots.txt` then points to it. Without it the build still works but skips those.

The contact form has two spam defences: a hidden field that only bots fill in, and a limit of 5 enquiries per hour per visitor. The limit is counted in memory, so on serverless hosting each running copy of the API keeps its own count.

On the live site (Vercel), add the same `SMTP_*` and `INQUIRY_TO` values as environment variables on the backend service, then redeploy. `GET /api/health` returns `{"status":"ok"}` when the API is reachable.

## Editing site content

All page text and company facts live in `frontend/src/content.ts`:

- `contact` — email, phone, offices, LinkedIn and the 30-minute booking link. Empty values are hidden.
- `testimonial.name` — leave empty unless the client has given written permission to be named.
- `about.team` — founders' names, roles, background and photos (put photos in `frontend/public/team/`).
- `packages[].price` — for example `From £X / month`. When empty, the site shows "Fixed-price proposal on request".
- `caseStudies` and `stats` — client results. Keep only figures you can back up, describe only what was actually done, and publish a case study only if the client contract allows it (even anonymised).
- `accelerators.show` — set to `false` to hide the AI Accelerators section and its menu link until those products exist.
- `privacy` — the text of the privacy notice at `/privacy`. Have it reviewed by whoever handles legal matters, and add a retention period and a named grievance contact if required.

The build also writes `/privacy`, a `404.html` error page, `robots.txt` and (when `VITE_SITE_URL` is set) `sitemap.xml`.

The build also writes a plain-HTML copy of this content into `index.html` so search engines can read it.

## Tests

```powershell
npm test
```
