import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  // Read the favicon file
  const faviconPath = join(process.cwd(), 'favicon.jpg')
  
  try {
    const faviconBuffer = readFileSync(faviconPath)
    const faviconBase64 = faviconBuffer.toString('base64')
    
    return new ImageResponse(
      (
        // ImageResponse JSX element
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
          }}
        >
          <img
            src={`data:image/jpeg;base64,${faviconBase64}`}
            alt="Arcfunmi Favicon"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
            }}
          />
        </div>
      ),
      // ImageResponse options
      {
        // For convenience, we can re-use the exported icons size metadata
        // config to also set the ImageResponse's width and height.
        ...size,
      }
    )
  } catch {
    // Fallback to text-based icon if favicon file is not found
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 16,
            background: '#000000',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFB000',
            fontWeight: 'bold',
            borderRadius: '6px',
          }}
        >
          AF
        </div>
      ),
      {
        ...size,
      }
    )
  }
} 