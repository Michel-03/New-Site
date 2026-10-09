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

## Tests

```powershell
npm test
```
