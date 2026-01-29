import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2563eb',
          backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            backgroundColor: 'white',
            borderRadius: 24,
            marginBottom: 40,
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          Where would your money
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            color: '#93c5fd',
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          go further?
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#bfdbfe',
            textAlign: 'center',
          }}
        >
          Compare take-home pay across 50+ US cities
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            fontSize: 24,
            color: 'white',
            opacity: 0.8,
          }}
        >
          realocation.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
