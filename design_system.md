# Janadesh – The People’s Mandate
**World-Class UI/UX Design System & Brand Identity**

## 1. Brand Identity & Logo
**Slogan:** "Janadesh — Empowering Every Vote"

### Logo Construction
- **Emblem:** A semi-minimalistic integration of the Ashoka Chakra (24 spokes), subtly morphed with a stylized checkmark (✓) representing voting, housed within an abstract, flowing outline of India.
- **Vibe:** Modern, democratic, transparent, and technologically advanced.
- **Variants:**
  - **Primary (Icon + Text):** The emblem paired with sharp typography.
  - **Icon-Only:** For app icons and favicons.
  - **Monochrome:** For watermarks and subtle backgrounds.

![Janadesh Brand Board](/C:/Users/Vinay/.gemini/antigravity/brain/cfce9d2e-642e-4eee-b831-11647ef483df/janadesh_brand_board_1777309904486.png)

## 2. Color Palette
A cohesive, culturally respectful, and futuristic palette.

| Role | Color Name | Hex Code | Description |
| :--- | :--- | :--- | :--- |
| **Background** | Dark Void | `#02040A` | Deep, premium dark mode background. |
| **Surface** | Glass Panel | `#0D111C` | For frosted glass cards (`rgba(13, 17, 28, 0.55)`). |
| **Primary/Accent** | Tech Saffron | `#FF6B35` | Vibrant saffron for primary CTAs and dynamic streaks. |
| **Secondary/Accent** | Cyber Green | `#00E676` | Success states, correct quiz answers, and highlights. |
| **Highlight** | Chakra Blue | `#00E5FF` | Royal/Cyan blue for the AI Bot and active states. |
| **Text Main** | Pure White | `#FFFFFF` | High-contrast readable text. |
| **Text Muted** | Slate Gray | `#94A3B8` | For secondary text and descriptions. |

## 3. Typography
- **Heading Font:** `Outfit` - Geometric, modern, and friendly. Excellent for numbers (stats) and titles.
- **Body Font:** `Inter` - Highly readable, neutral, and clean for paragraphs and UI elements.

## 4. UI Design System Elements

### Glassmorphism Surfaces
All cards, modals, and the sidebar use a blurred frosted glass effect:
```css
.glass-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
}
```

### Micro-Interactions & Hover States
- **Buttons:** Subtle 3D lift (`transform: translateY(-3px)`) with an outer glow of the respective accent color.
- **Light Streaks:** Dynamic animated backgrounds using mesh gradients reflecting the Indian tri-color.

### Iconography Set (Lucide React)
- **Dashboard:** `Grid`
- **Map/Stats:** `Map`
- **Timeline/Process:** `Clock`
- **Learning/Video:** `PlayCircle`
- **Quiz:** `BookOpen`
- **AI Assistant:** `Bot`, `Sparkles`
- **Languages:** `Globe`

## 5. AI + ML Features Design

### AI Election Assistant Bot
- **UI Element:** Persistent floating glass orb (`Chakra Blue` glow) that expands into a glassmorphic chat interface.
- **Chat Bubbles:** User messages in deep blue/grey; AI responses in softly glowing gradient bubbles with the `Sparkles` icon.
- **Voice Support:** Microphone icon (`Mic`) with pulsing animation when listening for speech-to-text input.

### AI State Insights & Prediction
- **Trend Cards:** Sparkline charts and progress bars showing demographic shifts.
- **UI Feedback:** Predictive numbers use soft pulsing animations to indicate "live" processing.

### Smart Search
- **Input:** Glassmorphic unified search bar with `Search` icon.
- **Dropdown:** Auto-suggests localized FAQs, candidate names, and election phases as the user types.

## 6. Page Layout Mockup Specifications

### Home Page
- **Hero:** Large dynamic typography (`Outfit`) reading "Empowering Every Vote", with the brand logo centered.
- **CTA:** Two glowing buttons: "Explore Map" and "Ask AI".

### State Statistics Page
- **Layout:** Two-column grid. Left: Interactive SVG grid of 29 states. Right: Deep-dive stats (Male/Female/New Voters) appearing via Framer Motion slide-in animations.

### Learning & Quiz
- **Video Zone:** Masonry layout of premium video thumbnails with a centered `PlayCircle`.
- **Quiz Board:** Single card layout, animating between questions. Uses `Cyber Green` and `Red` borders for immediate correct/incorrect feedback.
