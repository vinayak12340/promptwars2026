# Janadesh UI/UX Overhaul

## Goal Description
The objective is to completely revamp the visual design of the Janadesh platform to match a modern, futuristic 3D aesthetic. We are moving away from basic dark mode to an "Apple-level premium" experience. This includes deep navy/black backgrounds, animated neon/cyan/purple gradients, soft glassmorphism panels with 3D-like hover effects, and a floating AI chat window that remains persistently open. 

## User Review Required
Please review the generated mockup image (`janadesh_premium_mockup.png` available in the UI) to see the aesthetic target. 

## Open Questions
- The user requested "isometric 3D illustrations". Since we cannot import external 3D models easily via basic HTML/CSS without WebGL libraries (like Three.js), I plan to use CSS transformations (`transform: rotateX(...) rotateY(...)`) and layered elements to fake an isometric 3D look for the timeline and cards. Is this acceptable, or would you like me to try generating 2D images of 3D objects to use as assets?

## Proposed Changes

### [MODIFY] `style.css`
- **Global Theme**: Change the background to a deep navy (`#050814`) with animated gradient orbs (blobs) using CSS `radial-gradient` and `@keyframes`.
- **Glassmorphism Base**: Update `.glass-panel` to use stronger backdrop blurs (`blur(20px)`), whiter semi-transparent borders (`rgba(255,255,255,0.15)`), and layered box-shadows to simulate depth.
- **Typography & Colors**: Switch primary accent gradients to Electric Blue (`#00E5FF`) to Violet (`#7B2CBF`). Ensure high contrast white text.
- **Hero Section**: Update styling to support the new bold headline "Understand Elections. Vote with Confidence." Add parallax styling.
- **3D Interactive Elements**: 
  - Add `.card-3d` classes with `transform-style: preserve-3d` and `perspective` to create lifting, glowing hover animations on feature cards and journey nodes.
  - Implement soft neumorphic inner shadows for pressed states.
- **Persistent AI Chat**: Remove the "hidden" class toggle for the chat window by default, and position it gracefully on the right side of the screen so it is always visible and doesn't overlap core content.

### [MODIFY] `index.html`
- **Hero Content Update**: Change the hero title and subtitle to match the prompt.
- **Background Blobs**: Add structural `div` elements for the animated background gradient blobs (`.blob-1`, `.blob-2`).
- **Layout Adjustments**: Wrap the main content and AI chat in a layout that ensures the AI chat does not obscure the main dashboard when open.
- **Navigation Logo**: Ensure the `public/logo.png` is prominent and styled with a slight glow.

### [MODIFY] `script.js`
- **AI Chat Logic**: Remove the code that hides the chat by default. Ensure the chat cannot be fully closed, only minimized.
- **3D Mouse Tracking (Optional polish)**: Add a small script to track mouse movement over feature cards to tilt them slightly, enhancing the 3D Apple-like premium feel.

## Verification Plan
1. Open `index.html` in the browser.
2. Verify the deep navy background with glowing animated blobs.
3. Hover over journey milestones and feature cards to test the 3D lift/glow effects.
4. Verify the AI chat is permanently visible and functional on the side of the screen.
5. Verify the logo is visible and the layout remains clean and uncluttered.
