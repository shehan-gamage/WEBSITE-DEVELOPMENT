# Durable enquiry capture (`ENQUIRY_WEBHOOK_URL`)

When SMTP can't take a contact/subscribe enquiry — unconfigured, or a send throws —
the server POSTs the enquiry as JSON to `ENQUIRY_WEBHOOK_URL` so the lead isn't lost.
It's a **fallback**: when SMTP is healthy (the normal case in production) the webhook
is never called. If the env var is unset the feature is a no-op and behaviour is
unchanged. Implementation: `captureEnquiry()` in [`../server.js`](../server.js).

Payload (`POST`, `content-type: application/json`):

```json
{ "kind": "contact", "receivedAt": "2026-07-02T08:12:24.576Z",
  "name": "...", "email": "...", "phone": "...", "company": "...",
  "service": "...", "subject": "...", "message": "..." }
```

Subscribe sends `{ "kind": "subscribe", "receivedAt": "...", "email": "..." }`.
The request is bounded by a 5s timeout; the URL and its response are never logged.

Point `ENQUIRY_WEBHOOK_URL` at anything that accepts a POST — a Google Sheet (via
Apps Script, below), a Slack/Discord incoming webhook, or a Zapier/Make catch hook.
The guide below uses a Google Sheet. ~10 minutes.

## 1. Create the Sheet

1. New Google Sheet (e.g. "SRP Website Enquiries").
2. Leave it empty — the script writes the header row on first append.

## 2. Add the Apps Script

1. In the Sheet: **Extensions → Apps Script**.
2. Delete the stub, paste this, and set `SECRET` to a long random string of your own
   (treat it like a password):

```javascript
// Shared secret — must match the ?token= in ENQUIRY_WEBHOOK_URL. Change this.
const SECRET = 'CHANGE_ME_to_a_long_random_string';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);                 // serialize concurrent appends
  try {
    // Reject anything without the correct token (the /exec URL is public).
    if (SECRET && (!e || !e.parameter || e.parameter.token !== SECRET)) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const d = JSON.parse((e.postData && e.postData.contents) || '{}');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Enquiries') || ss.insertSheet('Enquiries');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received','Type','Name','Email','Phone','Company','Service','Subject','Message']);
    }
    sheet.appendRow([
      d.receivedAt || new Date().toISOString(),
      d.kind || '',
      d.name || '', d.email || '', d.phone || '',
      d.company || '', d.service || '', d.subject || '', d.message || '',
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. **Save**.

## 3. Deploy as a Web App

1. **Deploy → New deployment** → gear icon → **Web app**.
2. **Execute as:** Me. **Who has access:** **Anyone** (required — Vercel calls it
   unauthenticated; the `token` is your guard).
3. **Deploy** → authorize when prompted (your own account/sheet).
4. Copy the **Web app URL** — it ends in `/exec`.

## 4. Test the sink directly (before wiring Vercel)

```bash
curl -s -X POST "PASTE_EXEC_URL?token=YOUR_SECRET" \
  -H 'content-type: application/json' \
  -d '{"kind":"contact","receivedAt":"2026-07-02T00:00:00Z","name":"Test Lead","email":"t@example.com","phone":"+9477","message":"testing the sink"}'
```

Expect `{"ok":true}` and a new row in the Sheet. A wrong/missing `token` →
`{"ok":false,"error":"unauthorized"}` and **no** row.

## 5. Point the site at it

In Vercel → project → **Settings → Environment Variables**:

- **Name:** `ENQUIRY_WEBHOOK_URL`
- **Value:** `PASTE_EXEC_URL?token=YOUR_SECRET` (the `/exec` URL **with** `?token=` appended)
- **Environment:** Production (add Preview too if you want)
- Save, then **redeploy** — env changes only apply to a new deployment.

Done. The fallback is live.

## Behaviour

- **Normal:** SMTP sends the email; the webhook is not called.
- **SMTP down / send fails:** the enquiry is POSTed to the Sheet, the visitor still
  sees success, and the app logs `captured via fallback webhook. tag=…` (no PII).
- **Sheet also unreachable:** falls back to the PII-free `tag=` log line — nothing
  crashes, the visitor still gets success.

## Notes & caveats

- **The `token` is the only guard.** The `/exec` URL is public; the token keeps
  randoms from spamming the Sheet. Rotate by changing `SECRET` in the script **and**
  the `?token=` in Vercel.
- **Verifying in prod is indirect** — SMTP is healthy in production, so the fallback
  won't fire on its own. Step 4's curl proves the sink; the app-side wiring is covered
  by `test/durable-capture.test.js`. Don't break SMTP just to test it.
- **Editing the script later:** **Deploy → Manage deployments → edit → New version**,
  or the `/exec` URL keeps serving the old code.
- **PII to the webhook is intended delivery** to a team-controlled endpoint (same as
  email) — not a logging leak. The log scrub (no PII in `console`) is preserved.

See also: `ENQUIRY_WEBHOOK_URL` and `LOG_SALT` in [`../.env.example`](../.env.example).
