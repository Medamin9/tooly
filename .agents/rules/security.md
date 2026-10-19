---
trigger: always_on
description: Requires secure auth, authorization, input validation, file upload safety, and safe payment handling.
---
# Security rules
- Treat every request as untrusted. Validate DTOs and query parameters on the API.
- Enforce authentication and role-based authorization server-side for every admin endpoint and protected customer resource.
- Do not rely on hidden frontend routes or client role flags for access control.
- Use secure session/cookie practices appropriate to the chosen auth implementation; protect state-changing requests against CSRF where applicable.
- Hash passwords with a modern password hashing algorithm through a vetted library. Never store plaintext passwords.
- Rate-limit authentication, checkout, upload, and abuse-prone endpoints.
- Never log passwords, access tokens, session cookies, secrets, or sensitive payment data.
- Multer uploads must have size limits, allowlists, generated filenames, content inspection where possible, and safe storage outside executable/public paths unless intentionally public.
- Payment completion must be confirmed server-to-server (webhook signature verification or provider API verification), never from a client redirect alone.
- Never store raw card data. Keep secrets in environment variables/secret manager.
- Use least privilege, safe error messages, dependency auditing, and security tests.
- Do not seed production with default admin credentials. Create the first admin through a documented secure bootstrap process.
