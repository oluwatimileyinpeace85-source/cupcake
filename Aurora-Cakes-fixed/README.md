# Aurora Cakes v1

Frontend e-commerce prototype built from the uploaded CUPCAKE project.

## Included
- Combined login/sign-up authentication page
- Protected main website
- Home, Menu, Trending, Favorites, Cart, Checkout, Receipt, Account, About, Contact
- Product search/category filters
- Favorite products
- Cart quantities and totals
- Pickup / someone else pickup / delivery
- Location-based demo delivery pricing
- Transfer and card UI selection
- Order receipt + WhatsApp handoff
- LocalStorage persistence for demo users, favorites, cart and orders

## Before real launch
1. Replace the demo WhatsApp number in `js/app.js`.
2. Replace demo bank details in `checkout.html`.
3. Connect a real backend/database.
4. Connect Paystack/Flutterwave for real card payments. Never collect/store real card details in frontend localStorage.
5. Add an admin dashboard to verify transfers and change order status.
