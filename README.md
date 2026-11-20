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

On the live site (Vercel), add the same `SMTP_*` and `INQUIRY_TO` values as environment variables on the backend service, then redeploy. `GET /api/health` returns `{"status":"ok"}` when the API is reachable.

## Editing site content

All page text and company facts live in `frontend/src/content.ts`:

- `contact` — email, phone, offices, LinkedIn and the 30-minute booking link. Empty values are hidden.
- `testimonial.name` — leave empty unless the client has given written permission to be named.
- `about.team` — founders' names, roles, background and photos (put photos in `frontend/public/team/`).
- `packages[].price` — for example `From £X / month`. When empty, the site shows "Fixed-price proposal on request".
- `caseStudies` and `stats` — client results. Keep only figures you can back up.

The build also writes a plain-HTML copy of this content into `index.html` so search engines can read it.

## Tests

```powershell
npm test
```
