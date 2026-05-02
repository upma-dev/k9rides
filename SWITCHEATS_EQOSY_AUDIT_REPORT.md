# Switcheats -> Eqosy Rebrand Audit Report

Generated: 2026-04-30

## Scope
- Deep scan for `Switcheats`/`SwitchEats` traces in text and image references.
- No code changes applied in this phase.

## Summary
- Total matched occurrences: 119
- Total impacted files: 68
- Brand-named image files found: 4

## High-Priority Findings (Direct User-Facing Brand Leakage)
- HTML/app title still shows `SwitchEats`.
- Multiple UI pages still render `SwitchEats` in headings, policy pages, auth pages, and support labels.
- Static logo assets are named `switcheats-logo*` and imported in many places.
- External fallback images point to `Switcheats-Brand-Image.png`.

## Backend/Operational Brand Coupling
- Default admin email uses `@switcheats.com`.
- Legacy domain logic references `foods.switcheats.com` and `api.foods.switcheats.com`.
- Cloud/media upload folders are hardcoded under `switcheats/...`.
- Local storage keys include `switcheats_*` names.

## Image/Asset Branding Findings
- Strongly likely embedded old brand text in logo image files (requires asset replacement, not just code rename).
- Files:
  - C:\Users\hp\Desktop\eqosy\Frontend\public\switcheats-logo.jpeg
  - C:\Users\hp\Desktop\eqosy\Frontend\public\switcheats-logo.png
  - C:\Users\hp\Desktop\eqosy\Frontend\src\modules\Food\assets\switcheats-logo copy.png
  - C:\Users\hp\Desktop\eqosy\Frontend\src\modules\Food\assets\switcheats-logo.png

## Full Impacted File List
- Backend\create_admin.cjs
- Backend\package.json
- Backend\package-lock.json
- Backend\src\core\otp\otp.service.js
- Backend\src\modules\food\admin\controllers\admin.controller.js
- Backend\src\modules\food\admin\controllers\businessSettings.controller.js
- Backend\src\modules\food\admin\models\businessSettings.model.js
- Backend\src\modules\food\admin\models\pageContent.model.js
- Backend\src\modules\food\admin\services\admin.service.js
- Backend\src\modules\food\admin\services\foodApproval.service.js
- Backend\src\modules\food\admin\services\pageContent.service.js
- Backend\src\modules\food\orders\services\order.service.js
- Backend\src\utils\email.js
- Frontend\index.html
- Frontend\package.json
- Frontend\package-lock.json
- Frontend\src\config\constants.js
- Frontend\src\modules\auth\pages\Login.jsx
- Frontend\src\modules\DeliveryV2\components\modals\PickupActionModal.jsx
- Frontend\src\modules\DeliveryV2\pages\DeliveryHomeV2.jsx
- Frontend\src\modules\DeliveryV2\pages\help\ViewSupportTicketV2.jsx
- Frontend\src\modules\Food\components\admin\AdminNavbar.jsx
- Frontend\src\modules\Food\components\admin\AdminSidebar.jsx
- Frontend\src\modules\Food\components\admin\orders\useOrdersManagement.js
- Frontend\src\modules\Food\components\user\DesktopNavbar.jsx
- Frontend\src\modules\Food\components\user\Footer.jsx
- Frontend\src\modules\Food\components\user\PageNavbar.jsx
- Frontend\src\modules\Food\hooks\useCompanyName.js
- Frontend\src\modules\Food\hooks\useRestaurantNotifications.js
- Frontend\src\modules\Food\pages\admin\addons\AddonsList.jsx
- Frontend\src\modules\Food\pages\admin\auth\AdminForgotPassword.jsx
- Frontend\src\modules\Food\pages\admin\auth\AdminLogin.jsx
- Frontend\src\modules\Food\pages\admin\auth\AdminSignup.jsx
- Frontend\src\modules\Food\pages\admin\categories\Category.jsx
- Frontend\src\modules\Food\pages\admin\restaurant\AddRestaurant.jsx
- Frontend\src\modules\Food\pages\admin\restaurant\RestaurantsList.jsx
- Frontend\src\modules\Food\pages\admin\settings\AboutUs.jsx
- Frontend\src\modules\Food\pages\admin\system\DiningManagement.jsx
- Frontend\src\modules\Food\pages\Home.jsx
- Frontend\src\modules\Food\pages\restaurant\auth\SignupEmail.jsx
- Frontend\src\modules\Food\pages\restaurant\auth\Welcome.jsx
- Frontend\src\modules\Food\pages\restaurant\HubFinance.jsx
- Frontend\src\modules\Food\pages\restaurant\HubMenu.jsx
- Frontend\src\modules\Food\pages\restaurant\Inventory.jsx
- Frontend\src\modules\Food\pages\restaurant\ItemDetailsPage.jsx
- Frontend\src\modules\Food\pages\restaurant\OutletTimings.jsx
- Frontend\src\modules\Food\pages\user\auth\OTP.jsx
- Frontend\src\modules\Food\pages\user\auth\SignIn.jsx
- Frontend\src\modules\Food\pages\user\cart\AddressSelectorPage.jsx
- Frontend\src\modules\Food\pages\user\cart\Cart.jsx
- Frontend\src\modules\Food\pages\user\DiningRestaurants.jsx
- Frontend\src\modules\Food\pages\user\help\Help.jsx
- Frontend\src\modules\Food\pages\user\help\OrderHelp.jsx
- Frontend\src\modules\Food\pages\user\Home.jsx
- Frontend\src\modules\Food\pages\user\orders\Orders.jsx
- Frontend\src\modules\Food\pages\user\profile\About.jsx
- Frontend\src\modules\Food\pages\user\profile\Cancellation.jsx
- Frontend\src\modules\Food\pages\user\profile\EditProfile.jsx
- Frontend\src\modules\Food\pages\user\profile\Privacy.jsx
- Frontend\src\modules\Food\pages\user\profile\Refund.jsx
- Frontend\src\modules\Food\pages\user\profile\Shipping.jsx
- Frontend\src\modules\Food\pages\user\profile\Terms.jsx
- Frontend\src\modules\Food\pages\user\restaurants\trim_data.cjs
- Frontend\src\modules\Food\pages\user\restaurants\trim_data.js
- Frontend\src\modules\Food\utils\businessSettings.js
- Frontend\src\modules\Food\utils\razorpay.js
- Frontend\src\modules\Food\utils\restaurantStorage.js
- README.md

## Replacement Plan (for next phase)
- 1) Replace all hardcoded display strings (`SwitchEats` -> `Eqosy`) with context-aware variants (`Eqosy Food`, `Eqosy Fleet` where needed).
- 2) Replace logo/image assets and update all imports/URL fallbacks.
- 3) Rename technical keys only where safe: storage keys, upload folders, package names, defaults.
- 4) Update support/admin emails and domain references to Eqosy domains.
- 5) Validate no regressions in payments, notifications, and onboarding flows after rename.

## Notes
- This scan is text and filename based. It cannot OCR every image pixel for hidden text.
- For pixel-level verification, manual visual QA of key UI screens is recommended in the next phase.
