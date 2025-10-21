# QuickSite Frontend

Responsive, accessible, modular frontend skeleton for QuickSite. Built with semantic HTML, mobile-first CSS, and vanilla JavaScript.

## Run locally

- Option A (Node): `npx serve frontend` or `npx http-server frontend`
- Option B (Python):
  - Python 3: `cd frontend && python3 -m http.server 8080`
  - Then open `http://localhost:8080/`

No build step required.

## Configure API endpoints

Edit `assets/js/auth.js`:
- Set `BASE_API_URL` to your backend URL (e.g., `http://localhost:4000`).
- All requests use `apiFetch()` and automatically include the JWT in the `Authorization: Bearer <token>` header when present.

Endpoints used (placeholders):
- `POST /api/auth/signup-student`
- `POST /api/auth/signup-owner`
- `POST /api/auth/login`
- Future: `POST /api/auth/verify-otp` after signup

## Map keys

Edit `assets/js/map.js` and follow the comments:
- Option A: Google Maps JS API — set `GOOGLE_MAPS_API_KEY` and load script.
- Option B: Leaflet — load CSS/JS from CDN in `signup-owner.html` or let `map.js` attempt a dynamic load.
- Without keys, a basic clickable placeholder lets owners set approximate coordinates.

## Integration checklist

- [ ] Update `BASE_API_URL` in `auth.js`.
- [ ] Wire OTP flow after signup: show OTP UI and call `/api/auth/verify-otp`.
- [ ] Replace placeholder map with Google Maps or Leaflet (set API key).
- [ ] Configure CORS on the backend to allow the frontend origin.
- [ ] Replace static reviews with data from backend when available.
- [ ] Add protected route checks in dashboards using JWT and role.
- [ ] (Optional) Switch to secure, HTTP-only cookies for JWT in production.
- [ ] (Future) Add Socket.io client and authenticate with JWT for chat.

## Files overview

- `index.html` — Homepage with hero, tabs (How it Works), benefits, FAQs (accordion), reviews (carousel), CTAs.
- `signup-student.html` — Student signup form with skills tagging UI and client-side validation.
- `signup-owner.html` — Owner signup form with category and map location picker.
- `login.html` — Login page; on success, redirects based on user role.
- `dashboard-placeholder/student.html` and `dashboard-placeholder/owner.html` — simple placeholder pages.
- `assets/css/styles.css` — Mobile-first, responsive styles with utility classes, focus-visible, and animations.
- `assets/js/main.js` — Tabs, accordion, carousel, nav interactions.
- `assets/js/auth.js` — Fetch wrapper, JWT storage, form handlers, validation, password toggles, skills tagging.
- `assets/js/map.js` — Map initializer and placeholder picker; hooks for Google/Leaflet.

## Security note

For demonstration, JWT is stored in `localStorage` and added to requests. In production, prefer secure, HTTP-only cookies with CSRF protections. Documented in `auth.js` for future integration.
