# Juan's El Caporal — Website Restoration & Restaurant Management Plan

Updated: October 2026

## Project goals
Restore the original colorful, mobile-friendly Juan's El Caporal restaurant website and optionally extend it into a secure restaurant management and online ordering platform.

## Repositories
- Working restoration: `QuiteAstorm/Food` (main).
- Original/reference: `QuiteAstorm/Juans-El-Caporal` (do not overwrite).
- The owner of the GitHub account is developing primarily from a phone.

## Frontend requirements
- Preserve the recognizable colorful design and carousel where useful.
- Responsive navigation on phones.
- Selecting a food category shows only that category's food pictures.
- Tapping a picture shows that item's name, description and price (not the whole menu below the carousel).
- Back from an item returns to its category, not the main menu.
- Restore missing/broken pictures and original categories; do not invent descriptions or prices.
- Current work in Food includes a React starter, MenuGallery component, eight connected categories, 57 extracted carousel entries, and a GitHub Pages deployment workflow.
- Build completed successfully in a previous GitHub Actions run, but Pages setup caused deployment failure; publication must be verified separately.

## Future architecture (proposed, not implemented)
- React frontend.
- Node.js + Express backend.
- MongoDB Atlas database (developer has prior MongoDB experience).
- Optional Stripe integration if the restaurant owner authorizes online payments.
- GitHub Pages may host the static frontend; backend and database need separate hosting.
- Design and validate data models before enabling production operations.

## Private owner dashboard
- Secure authentication, roles and permissions for owner and employees.
- Owner can manage food categories, menu items, photos, descriptions, prices, availability.
- Owner can toggle online ordering ON/OFF.
- Owner can manage pickup availability, hours, incoming orders and statuses.
- View customer records and order histories with appropriate privacy controls.
- Sales reports and popular-item reporting.
- No customer or payment data should be publicly accessible.

## Optional customer ordering
- Customers browse menu, customize items, add to cart and place pickup orders if ordering is enabled.
- Order confirmation, history, status and optional payments.
- Restaurant owner decides whether ordering is activated.
- Online ordering OFF still permits menu browsing.

## Inventory management — BOTH modes required
1. Automatic: deduct ingredients when an order reaches a defined confirmed state, using recipe quantities per dish.
2. Manual: authorized owner/staff can adjust stock for receiving deliveries, counts, waste, spoilage and corrections.
3. Low-stock thresholds, reorder alerts, suppliers and purchase orders.
4. Food cost tracking and inventory adjustment history (who, when, reason, before/after).
5. Avoid duplicate deductions from retried order submissions; define clear cancellation/refund/restock rules.
6. Owner may toggle automatic inventory deductions ON/OFF independently of online ordering.
7. Support manual/in-person sales; potential POS integration later.
8. Owner can mark out-of-stock menu items unavailable; automated effects should be configurable.

## Implementation sequence
1. Confirm GitHub Pages deployment and fix any issues.
2. Restore/test remaining original menu categories and image links.
3. Complete frontend interactions and mobile polish.
4. Create private dashboard UI and access control.
5. Build backend, MongoDB schemas and secured APIs.
6. Implement manual inventory and audit log; then recipe-based automatic deductions.
7. Add optional customer ordering and payments after owner approval.
8. Test security, backups, operations, and production deployment.

## Open decisions
- Restaurant owner approval for ordering and payment options.
- Accurate recipes, ingredient units, supplier information, inventory opening balances.
- Missing photos, descriptions and prices.
- Order fulfillment rules, cancellation behavior, POS integration and hosting budget.

This file is a planning record, not a claim that future backend features are already built.

## Deployment troubleshooting
- A prior rerun produced two artifacts with the same `github-pages` name in one workflow run, causing `actions/deploy-pages` to fail. A fresh push creates a new workflow run; avoid rerunning only the deploy job on the affected run.


## Long-term product vision: reusable restaurant website platform
The Juan's El Caporal restoration should become the first example of a reusable, configurable restaurant website platform for many cuisines and restaurant types (Mexican, Italian, Chinese, barbecue, seafood, etc.).

### Owner-customizable branding and content
- Choose from colorful themed designs, including cuisine-inspired themes, or customize colors, backgrounds, typography and layouts.
- Upload the restaurant's own logo, food photos and other branding.
- Configure restaurant name, contact details, business hours and dine-in/takeout information.
- Add, edit, reorder and hide menu categories and dishes, with photos, descriptions, prices and availability.
- Make most website changes through a private dashboard rather than code edits.

### Shared optional business features
- Owner-controlled online ordering toggle.
- Secure owner/staff dashboard, customer/order management and reporting.
- Manual and recipe-based automatic inventory management, with independent settings.
- Optional payment processing and future POS integrations.

### Product architecture considerations
- Separate shared template/components and configuration from each restaurant's private data.
- Plan for multiple restaurants (multi-tenant isolation) if this becomes a hosted product.
- Ensure secure per-restaurant authentication, data isolation, authorization and backups.
- Offer a way to deploy or host each restaurant's website with its own branding and domain.
- Keep the Juan's El Caporal original design and source intact as the flagship example.
- Consider naming and packaging the reusable platform after the Juan's frontend is stable.

**Status:** This is an agreed future product direction, not yet implemented. Prioritize finishing and testing Juan's El Caporal before generalizing it.


## Session handoff — October 20, 2026 (end of evening)
**Current status:** Juan's El Caporal is published at https://quiteastorm.github.io/Food/ . The user likes the restored colorful homepage and the small original food photos beside the eight category buttons.

### Completed tonight
- Recreated colorful original landing-page styling, logo, background, contact/hours section, and category grid.
- Added representative original food photos to each category button. User confirmed visually that they look beautiful.
- Enhanced MenuGallery: selecting a dish opens its detail and Back returns to that category; category-local search; missing-image fallback; colorful mobile-responsive tiles.
- Recorded long-term vision for a reusable restaurant website platform customizable for Mexican, Italian, Chinese, and other restaurants.

### Last code change / verify first tomorrow
- Commit `b8efa45a6edbfa10d4bbb5edce86080e089f1c1b` updated `src/App.css` to keep the word **Appetizers** together on one line on narrow phone screens, with adjusted thumbnail and text sizing.
- **Deployment and visual outcome of this last fix have NOT yet been verified.** Check the latest GitHub Actions run, then ask user whether the S still wraps on their phone. Avoid assuming the issue is resolved.
- Site: https://quiteastorm.github.io/Food/
- Actions: https://github.com/QuiteAstorm/Food/actions

### Next practical steps
1. Verify the latest deployment and the Appetizers label on the user's phone; if necessary, fix grid sizing rather than only text wrapping.
2. Test category > photo > detail > back-to-same-category navigation and category search.
3. Check broken/missing food images; recover accurate descriptions and prices from the original restaurant materials, without guessing.
4. Polish remaining menu pages and accessibility.
5. Begin secure owner dashboard and backend/database work in stages, only after frontend is stable. Owner wants MongoDB, optional ordering, both automatic and manual inventory, and owner-controlled settings.
6. Eventually extract reusable themes/configuration into a multi-restaurant template; preserve the original restaurant repo.

### User preference
Strong preference for bright colors, rich imagery, decorative design, and mobile-friendly presentation. User works primarily on an Android phone. Keep instructions simple and do the GitHub changes directly where possible.

**Do not claim future dashboard, database, or ordering features are implemented.**


## Session handoff — October 21, 2026
- User confirmed the **Appetizers** word-wrap problem is fixed, and food images and tap-to-detail interactions look good. Preserve this visual design and navigation.
- The menu editor preview is reachable from a button **below the category grid on the homepage**, or via https://quiteastorm.github.io/Food/?editor=preview . The editor is explicitly **not private** and **does not publish** changes to the live menu.
- Editor supports browser-local autosaved drafts, JSON download/import, and clear drafts. User requested owner ability to add new dishes within existing categories **and create new categories** (e.g. Mixed Drinks). Implemented both in `src/components/MenuEditor.js`, with mobile styling in `src/components/MenuEditor.css`. Latest related commit: `6f9967ceef8dc16b37fbe9d0b6f74ce3c833459b`. **Verify GitHub Pages deployment and test this functionality on a phone before claiming it is live.**
- The user is interested in food and baking, including handmade pasta, bread, strudel, and cream puffs with pastry cream and chocolate. This informs their vision for customizable restaurant and bakery sites, but do not bring up personal details unnecessarily.
- Next development priorities: verify category/item creation and JSON backup/import, correct any bugs, then design secure authentication and permanent database-backed CRUD/publishing. Do not claim private access, backend, MongoDB, or ordering are working.
- User is taking a break and asked for a reliable stopping point. Be warm and patient when they return; do not imply any background work is happening.
