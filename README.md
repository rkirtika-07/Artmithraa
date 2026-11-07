# ARTMITHRA — Online Art Gallery

A React + Vite college demonstration project with Admin and User modules. Data is stored in the browser's LocalStorage.

## Run locally
1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Open Terminal in this folder.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the local URL printed by Vite.

## Demo admin account
- Email: `admin@artmithra.demo`
- Password: `Admin@123`

Use Signup to create a normal user account.

## Included features
- User signup, login, logout and role-based navigation
- Gallery search and category filtering
- Artwork details, cart and demo checkout
- Auction listings and demo bidding
- User reviews
- Admin dashboard to add, edit and delete artwork and view users/orders
- LocalStorage persistence

## GitHub Pages deployment
1. Create a GitHub repository named `ARTMITHRA` (or update `base` in `vite.config.js` to match your repository name).
2. Push the project source to the `main` branch.
3. Run `npm install` and `npm run deploy`.
4. In GitHub: Settings → Pages → Deploy from a branch → `gh-pages` → `/(root)` → Save.
5. Your URL will be `https://YOUR-USERNAME.github.io/ARTMITHRA/`.

If your repository name is different, set Vite's `base` to `'/YOUR-REPOSITORY-NAME/'` before building and deploying.

## Important limitation
This is a frontend academic demo. LocalStorage authentication and the demo admin account are not secure for a real public service. Do not use real passwords, payment details or personal information. Real deployment requires a backend, database, secure authentication and payment provider.
