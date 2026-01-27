import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Computer Science Insights';
    const category = searchParams.get('category') || '';
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam ? tagsParam.split(',').slice(0, 3) : [''];

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#020617', // Fallback color
                    padding: '60px 80px',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* 1. THE BACKGROUND IMAGE (Placed first to be at the bottom) */}
                <img
                    src="https://rajendrapancholi.vercel.app/bg1d.jpg" // Example BG
                    width="1200"
                    height="630"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        objectFit: 'cover',
                        opacity: 0.4, // Dim the image to make text pop
                    }}
                />

                {/* 2. THE GRID OVERLAY (Stays on top of the image) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.2,
                }} />

                {/* CONTENT AREA */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                    <span style={{ color: '#38bdf8', fontSize: 22, fontWeight: 'bold', letterSpacing: '0.3em' }}>
                        {category.toUpperCase()}
                    </span>

                    <h1 style={{ fontSize: 82, color: '#ffffff', margin: '20px 0', fontWeight: '900', lineHeight: 1.1 }}>
                        {title}
                    </h1>

                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {tags.map((tag) => (
                            <div key={tag} style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '8px 20px', borderRadius: '12px', display: 'flex' }}>
                                <span style={{ color: '#f8fafc', fontSize: 22 }}>#{tag}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER AREA */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(51, 65, 85, 0.8)',
                    paddingTop: '40px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img
                            src="https://rajendrapancholi.vercel.app/raje-avatar.jpeg"
                            width="72"
                            height="72"
                            style={{
                                borderRadius: '20px',
                                border: '2px solid #38bdf8',
                            }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#ffffff', fontSize: 26, fontWeight: 'bold' }}>Rajendra Pancholi</span>
                            <span style={{ color: '#94a3b8', fontSize: 18 }}>Full-Stack Architect</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        { width: 1200, height: 630 }

    );
}
