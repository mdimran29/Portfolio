# Modern Portfolio

A high-performance portfolio built with Next.js 14, TypeScript, Tailwind CSS, Three.js, and Framer Motion.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei
- **Animations**: Framer Motion
- **Font**: Space Grotesk

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles with Tailwind
├── components/             # Reusable components
│   ├── ui/                 # UI components
│   ├── sections/           # Page sections
│   └── 3d/                 # Three.js components
├── lib/                    # Utility functions
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript type definitions
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

### Build for Production

```bash
npm run build
npm start
```

## Features

- ✅ Next.js 14 App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS with custom configuration
- ✅ Dark mode support
- ✅ Smooth scrolling
- ✅ SEO-friendly metadata
- ✅ Mobile-first responsive design
- ✅ Performance optimized
- ✅ Custom scrollbar styling
- ✅ Glass morphism utilities
- ✅ Animation utilities
- ✅ Accessibility considerations

## Next Steps

1. Create reusable UI components in `src/components/ui/`
2. Build page sections in `src/components/sections/`
3. Add Three.js components in `src/components/3d/`
4. Implement custom hooks in `src/hooks/`
5. Add utility functions in `src/lib/`

## Performance Considerations

- Optimized font loading with `next/font`
- Image optimization with `next/image`
- Code splitting with dynamic imports
- Reduced motion support for accessibility
- Custom scrollbar for better UX

## License

MIT
