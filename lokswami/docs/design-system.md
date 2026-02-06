# Lokswami Design System

## Brand Identity

### Logo Analysis
- **Script**: Devanagari (Hindi) calligraphic style
- **Style**: Traditional, authoritative, trustworthy
- **Font**: Custom calligraphic Hindi typeface

### Color Palette

```css
/* Primary Colors */
--color-primary: #8B0000;        /* Deep Maroon - Authority, Trust */
--color-primary-dark: #5C0000;   /* Darker Maroon - Hover states */
--color-primary-light: #B33A3A;  /* Lighter Maroon - Accents */

/* Secondary Colors */
--color-secondary: #FF9933;      /* Saffron - Indian heritage */
--color-secondary-dark: #E67E00; /* Dark Saffron */
--color-secondary-light: #FFB366;/* Light Saffron */

/* Accent Colors */
--color-accent: #FFD700;         /* Gold - Premium feel */
--color-accent-dark: #CC9900;    /* Dark Gold */

/* Semantic Colors */
--color-breaking: #DC2626;       /* Breaking News Red */
--color-success: #16A34A;        /* Success Green */
--color-warning: #F59E0B;        /* Warning Yellow */
--color-info: #2563EB;           /* Info Blue */

/* Neutral Colors */
--color-background: #FFFFFF;     /* White background */
--color-background-alt: #FFF8F0; /* Cream alternate */
--color-surface: #F5F5F5;        /* Light gray surface */
--color-border: #E5E5E5;         /* Border gray */
--color-text: #1A1A1A;           /* Primary text */
--color-text-secondary: #666666; /* Secondary text */
--color-text-muted: #999999;     /* Muted text */

/* Dark Mode */
--color-dark-bg: #0F0F0F;        /* Dark background */
--color-dark-surface: #1A1A1A;   /* Dark surface */
--color-dark-text: #F5F5F5;      /* Dark mode text */
```

### Typography

```css
/* Hindi Font Stack */
--font-hindi: 'Noto Sans Devanagari', 'Noto Sans', 'Mangal', 'Kokila', sans-serif;

/* English Font Stack */
--font-english: 'Inter', 'Roboto', 'Segoe UI', sans-serif;

/* Heading Sizes (Hindi optimized) */
--text-hero: 2.5rem;      /* 40px - Hero headlines */
--text-h1: 2rem;          /* 32px - Page titles */
--text-h2: 1.75rem;       /* 28px - Section headers */
--text-h3: 1.5rem;        /* 24px - Card titles */
--text-h4: 1.25rem;       /* 20px - Sub-headings */
--text-body: 1.125rem;    /* 18px - Article body */
--text-small: 0.875rem;   /* 14px - Meta, captions */

/* Line Heights (Hindi needs more space) */
--leading-hindi: 1.8;     /* Hindi text line height */
--leading-english: 1.6;   /* English text line height */
--leading-tight: 1.4;     /* Headings */

/* Letter Spacing */
--tracking-hindi: 0.02em; /* Slight spacing for Hindi */
```

### Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.12);
```

### Animation

```css
/* Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

/* Easing */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

### Component Styles

#### News Card
- Background: white
- Border radius: 12px
- Shadow: shadow-card
- Hover: scale(1.02), shadow-card-hover
- Image aspect ratio: 16:9
- Title: 2-line clamp, font-semibold

#### Breaking News Ticker
- Background: #DC2626
- Text: white
- Height: 40px
- Animation: marquee 30s linear infinite

#### Category Badge
- Padding: 4px 12px
- Border radius: full
- Font size: small
- Font weight: medium

#### Button Variants
- Primary: Deep Maroon background, white text
- Secondary: Saffron background, dark text
- Ghost: Transparent with hover background
- Danger: Red background for destructive actions
