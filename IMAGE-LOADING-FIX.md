# Image Loading Fix for Supabase Storage

## Problem
The error occurs because Next.js Image component requires external domains to be explicitly configured in `next.config.js` for security reasons. Supabase storage URLs like `https://tfotyqorvucyexjqfkjv.supabase.co/storage/v1/object/public/article-images/...` are not allowed by default.

## Solutions Applied

### 1. Updated Next.js Configuration (`next.config.ts`)

Added Supabase storage domains to the allowed image patterns:

```typescript
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'tfotyqorvucyexjqfkjv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
```

### 2. Created Reusable SupabaseImage Component (`components/ui/supabase-image.tsx`)

A robust Image component that handles:
- Loading states with skeleton animation
- Error handling with fallback images
- Proper error boundaries for Supabase URLs
- Smooth transitions

### 3. Updated My Articles Page (`app/my-articles/page.tsx`)

Replaced the Next.js Image component with the new SupabaseImage component for better error handling.

## Alternative Solutions

### Option A: Use Regular `<img>` Tags (Recommended for External URLs)

For external URLs like Supabase storage, regular `<img>` tags work better:

```tsx
{article.image_url && (
  <div className="relative h-48 overflow-hidden">
    <img 
      src={article.image_url} 
      alt={article.title}
      className="w-full h-full object-cover"
    />
  </div>
)}
```

### Option B: Use Next.js Image with Proper Configuration

If you want to keep using Next.js Image component, ensure the domain is configured in `next.config.ts`.

### Option C: Self-host Images

Download and host images locally in the `/public` directory.

## Testing the Fix

1. **Restart the development server**:
   ```bash
   npm run dev
   ```

2. **Test image loading** by:
   - Creating an article with an image
   - Viewing the article in the articles list
   - Checking the my-articles page

3. **Check browser console** for any remaining image errors

## Files Modified

- `next.config.ts` - Added Supabase storage domains
- `components/ui/supabase-image.tsx` - Created reusable image component
- `app/my-articles/page.tsx` - Updated to use SupabaseImage component

## Best Practices

### For External URLs (Supabase Storage)
Use regular `<img>` tags:
```tsx
<img 
  src={article.image_url} 
  alt={article.title}
  className="w-full h-full object-cover"
  onError={(e) => {
    e.currentTarget.src = '/assets/images/fallback.jpg';
  }}
/>
```

### For Local Images
Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src="/assets/images/local-image.jpg"
  alt="Local image"
  width={400}
  height={200}
  className="w-full h-full object-cover"
/>
```

### For Mixed Sources
Use the SupabaseImage component:
```tsx
import SupabaseImage from '@/components/ui/supabase-image';

<SupabaseImage
  src={article.image_url}
  alt={article.title}
  width={400}
  height={200}
  className="w-full h-full"
  fallbackSrc="/assets/images/article-1.jpg"
/>
```

## Troubleshooting

### If images still don't load:

1. **Check the URL format** - Ensure Supabase URLs are correct
2. **Verify domain configuration** - Check `next.config.ts` has the right domains
3. **Clear browser cache** - Hard refresh the page
4. **Check network tab** - Look for failed image requests
5. **Use fallback images** - Implement error handling

### Common Error Messages:

- `Invalid src prop on next/image, hostname is not configured`
  - **Solution**: Add domain to `next.config.ts` (already done)

- `Failed to load image`
  - **Solution**: Check if the Supabase URL is accessible

- `Image optimization failed`
  - **Solution**: Use regular `<img>` tags for external URLs

## Performance Considerations

### Next.js Image Component
- ✅ Automatic optimization
- ✅ Lazy loading
- ✅ Responsive images
- ❌ Requires domain configuration
- ❌ Limited to configured domains

### Regular `<img>` Tags
- ✅ Works with any URL
- ✅ No configuration needed
- ✅ Better for external sources
- ❌ No automatic optimization
- ❌ No lazy loading by default

### SupabaseImage Component
- ✅ Error handling
- ✅ Loading states
- ✅ Fallback images
- ✅ Works with any URL
- ❌ Slightly more complex

## Next Steps

1. Test the current fix by restarting the development server
2. Update other pages that use article images if needed
3. Consider using regular `<img>` tags for all external URLs
4. Implement proper error handling for all image components

## Files to Update (if needed)

Other pages that might need similar updates:
- `app/articles/page.tsx` (already uses `<img>` tags - good!)
- `app/article/[id]/page.tsx`
- `app/profile/page.tsx`
- `app/user/[id]/page.tsx` 