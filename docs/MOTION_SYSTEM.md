# Synova Infotech — Enterprise Motion System

## Philosophy
Motion is not decoration; it is communication. Every animation must serve a purpose:
1. Establish visual hierarchy.
2. Guide the user's eye between states.
3. Convey the brand's identity of precision, performance, and engineering excellence.

## 1. Core Principles
- **No Bouncy Easing**: We never use bouncy physics. All easing is smooth, deliberate, and high-tension.
- **Micro-Interactions**: Hover states scale up elements by exactly `1.02` to give a feeling of magnetic snap. Opacity fades over `250ms`.
- **Staggered Reveal**: Large data visualizations or node meshes fade in sequentially with a 50ms stagger to illustrate system complexity booting up.
- **Hardware Acceleration**: We only animate `transform` and `opacity`. Never `width`, `height`, or `top`/`left`.

## 2. Easing Curves
- **Standard (Hover)**: `cubic-bezier(0.4, 0, 0.2, 1)` — Fast out, slow in.
- **Enterprise Emphasized (Page Load)**: `cubic-bezier(0.25, 1, 0.5, 1)` — Long tail deceleration for premium feel.
- **Snappy (Data updates)**: `cubic-bezier(0, 0, 0.2, 1)`

## 3. Motion Patterns
### 3.1 The "System Boot" (Page Load)
Elements fade in from `opacity: 0` and `translateY: 20px` over `800ms`. Text elements stagger by `100ms`.
### 3.2 The "Magnetic Panel" (Hover)
Glassmorphism cards smoothly increase backdrop blur and border opacity, and elevate slightly on hover.
### 3.3 The "Data Stream" (Continuous)
Subtle SVG lines animate their `stroke-dashoffset` infinitely over a very long duration (e.g., `20s`) to imply constant background processing.
