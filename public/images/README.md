# Adding Your Profile Photo

## Quick Steps:

1. **Add your photo** to this folder:
   - Path: `/public/images/profile.jpg`
   - Recommended size: 500x500 pixels or larger (square)
   - Format: JPG, PNG, or WebP

2. **Update the code** in `src/app/page.tsx`:
   - Find line ~54 where it says "Uncomment this..."
   - Remove the comment wrapper
   - The Image component is already set up!

## Current Status:
- ✅ Folder created: `/public/images/`
- ✅ Photo placeholder added (emoji icon)
- ✅ Styled with gradient border and glow effect
- ⏳ Waiting for your actual photo

## To Add Your Photo:

### Option 1: Copy your photo here
```bash
cp /path/to/your/photo.jpg /home/imran/Desktop/Portfolio/public/images/profile.jpg
```

### Option 2: Download from web
```bash
cd /home/imran/Desktop/Portfolio/public/images/
# Then download or paste your image as profile.jpg
```

### Then uncomment in page.tsx (around line 69-77):
```tsx
<Image 
  src="/images/profile.jpg" 
  alt="Md Imran" 
  fill
  className="object-cover"
  priority
/>
```

## Design Features:
- 🌟 Animated gradient glow
- 💫 Pulsing effect on background
- 🎨 Cyan/Blue/Purple color scheme
- 📱 Responsive sizing (32-48 units)
- ✨ Hover effects for interactivity

Once you add your photo, it will automatically be optimized by Next.js Image component!
