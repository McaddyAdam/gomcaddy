# GoMcaddy Website Description
A polished food delivery and online ordering website for restaurant discovery, menu browsing, and repeat customer checkout.
Prepared from the current project implementation on April 8, 2026.

## Overview
GoMcaddy is a modern food delivery website that allows users to discover restaurants, browse menus, add items to a cart, create an account, and place orders through a clean, guided interface. The platform is designed to present restaurants professionally while keeping the ordering journey simple on both desktop and mobile.

## Customer Experience
- Home page with restaurant search, category shortcuts, featured restaurants, and live store counts.
- Menu browsing experience with restaurant switching, item photos, pricing, prep-time details, and featured dishes.
- Cart and checkout flow with quantity controls, delivery address capture, phone number entry, order notes, and pay-on-delivery support.
- Order history page where signed-in customers can review past orders, totals, delivery details, and status.

## Account and Data Features
- Login and signup flow with email validation, password checks, account creation, and sign-in redirects.
- JWT-based authentication so signed-in users can continue checkout and view their order history.
- MongoDB-backed data access for restaurants, categories, users, and orders through Next.js server routes.

## Technical Foundation
- Primary application built with Next.js, React, TypeScript, and Tailwind CSS.
- API endpoints and database access are handled inside the Next.js app for the current single-app flow.
- Repository also includes an optional Express backend folder for local and reference use, plus future extension.
- Responsive navigation, reusable UI components, and mobile drawer patterns support a consistent experience across screen sizes.

## Business Value
GoMcaddy gives a restaurant or multi-vendor food business a strong digital storefront with clear menu discovery, lower ordering friction, and repeat-user functionality. It also serves as a solid foundation for future enhancements such as online payments, promotions, delivery tracking, or admin dashboards.

## Brand Note
Designed and developed by Mcaddy Tech Solutions.
Website: www.mcaddytechsolutions.com
