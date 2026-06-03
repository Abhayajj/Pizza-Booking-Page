# 🍕 Gupta's Pizzeria - Premium Pizza Ordering & Tracker Portal

Welcome to **Gupta's Pizzeria**! A highly interactive, responsive, and visually stunning web application for browsing, customizing, and ordering premium woodfired artisanal pizzas. Crafted with a modern glassmorphic aesthetic, fluid micro-animations, and full cross-page state synchronization.

🚀 **Ready for GitHub Pages deployment out of the box!**

---

## ✨ Features

- 🎨 **Glassmorphic Theme Switcher**: Automatically loads in a cozy, warm dark-mode (coal and dark-velvet with glowing fiery orange accents) and supports a smooth transition to a crisp light theme. The preference is persisted across page reloads.
- 🍕 **Interactive Customizer Modal**: Customize any pizza in real-time. Choose sizes (Personal 9", Medium 12", Large 15"), select crust types (Classic Hand-Tossed, Thin & Crispy, Cheese Burst), and toggle extra toppings (Mushrooms, Olives, Jalapenos, Onions, Bell Peppers, Extra Cheese) with real-time price calculations.
- 🛒 **Persistent Shopping Cart**: A slide-out side drawer cart that syncs state seamlessly across all pages (`index.html`, menu subpages, and checkout) using `localStorage`. Supports quantity increments, removals, and instant total recalculations.
- 🏷️ **Coupon & Promo System**: Test coupon codes to unlock discounts:
  - `PIZZALOVER` - Save 15% on your entire order.
  - `GUPTA50` - Save 50% on your entire order.
  - `FREECOKE` - Flat $3.00 off discount (equivalent to a free soft drink).
- 🛵 **Live Order Tracker Stepper**: After filling out delivery details and placing an order, view a live step-by-step progress tracker:
  `Order Confirmed` ➔ `Preparing Dough` ➔ `Baking in Oven` ➔ `Out for Delivery` ➔ `Arrived & Delivered`
  Features an animated progress timeline and changing status icons.
- 📱 **Fully Responsive Layout**: Built with a mobile-first philosophy using CSS Grid and Flexbox, looking premium on mobile devices, tablets, and wide monitors.

---

## 🛠️ Technology Stack

- **Markup**: HTML5 (Semantic elements, SEO-optimized meta tags)
- **Styling**: Modern CSS3 (CSS Custom Properties, Backdrop filters, Custom transitions, Micro-animations)
- **Scripting**: Vanilla JavaScript (ES6+, DOM Manipulation, LocalStorage sync, Live timers)
- **Icons**: [Lucide Icons](https://lucide.dev/) (CDN version for lightweight loading)
- **Fonts**: [Google Fonts](https://fonts.google.com/) (Outfit for headers, Inter for readable body text)
- **Images**: High-quality royalty-free assets from [Unsplash](https://unsplash.com/)

---

## 📂 Project Structure

```text
Pizza-Booking-Page/
├── index.html          # Main landing portal & category showcase
├── checkout.html       # Cart breakdown, shipping form, & live tracker
├── css/
│   └── style.css       # Core CSS variables, layout, modals, drawer, animations
├── js/
│   ├── cart.js         # Cart actions, customizer logic, promos, localStorage sync
│   └── theme.js        # Light/Dark mode state & navbar scroll trigger
├── menus/
│   ├── veg.html        # Vegetarian pizzas with customizable options
│   ├── nonveg.html      # Non-vegetarian pizzas with meat toppings
│   └── combo.html       # Signature value combos
└── README.md           # Professional project documentation
```

---

## 🚀 Getting Started

### 1. Local Run
Since the application is built using standard static scripts (avoiding complex JavaScript modules that trigger CORS browser blocks on local execution), you can run this project locally without any server dependencies:
- Clone the repository:
  ```bash
  git clone https://github.com/Abhayajj/Pizza-Booking-Page.git
  ```
- Navigate to the folder and open `index.html` directly in any web browser by double-clicking it, or run it through a local server extension (e.g., Live Server in VS Code).

### 2. Host on GitHub Pages
This project is static and perfect for free hosting on GitHub Pages:
1. Push this codebase to your main GitHub repository branch.
2. In your GitHub repository settings, navigate to **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch** and set the source branch to `main` (or your default branch) and directory to `/ (root)`.
4. Click **Save**. Your website will be live at `https://<your-username>.github.io/Pizza-Booking-Page/` in seconds!

---

## 📸 Design Preview
- **Warm Dark Mode**: Glassmorphic panels, glowing buttons, and crisp orange accents.
- **Card Hover Effects**: Hovering over a pizza card triggers a subtle scale-up and rotates the pizza image 15 degrees.
- **Modal Customizer**: Slide-in modal overlay with visual topping cards.
- **Checkout Timeline**: Interactive step circles glowing active as the order updates from the kitchen.

---

## 🍕 Enjoy Your Slices!
Feel free to fork this project, customize the styling tokens inside `css/style.css`, or add new pizza menus! Made with ❤️ by Abhay Gupta.
