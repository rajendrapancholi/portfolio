import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Param parsing
        const title = searchParams.get('title') || 'Computer Science Insights';
        const category = searchParams.get('category') || 'ARTICLE';
        const tagsParam = searchParams.get('tags');
        const tags = tagsParam ? tagsParam.split(',').slice(0, 3) : ['Tech'];

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#020617',
                        padding: '60px 80px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* 1. BACKGROUND IMAGE */}
                    <img
                        src="https://rajendrapancholi.vercel.app/bg1d.jpg"
                        width="1200"
                        height="630"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            objectFit: 'cover',
                            opacity: 0.3, // Slightly darker for better text contrast
                        }}
                    />

                    {/* 2. GRID OVERLAY */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                        opacity: 0.1,
                    }} />

                    {/* 3. CONTENT */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, zIndex: 10 }}>
                        <span style={{ color: '#38bdf8', fontSize: 24, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 10 }}>
                            {category.toUpperCase()}
                        </span>

                        <h1 style={{
                            fontSize: title.length > 50 ? 60 : 80, // Dynamic font size based on title length
                            color: '#ffffff',
                            margin: '10px 0 30px 0',
                            fontWeight: 900,
                            lineHeight: 1.1,
                            display: 'flex'
                        }}>
                            {title}
                        </h1>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            {tags.map((tag) => (
                                <div key={tag} style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '8px 22px', borderRadius: '50px', display: 'flex' }}>
                                    <span style={{ color: '#bae6fd', fontSize: 20, fontWeight: 600 }}>#{tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. FOOTER */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingTop: '40px',
                        zIndex: 10
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <img
                                src="https://rajendrapancholi.vercel.app/raje-avatar.jpeg"
                                width="80"
                                height="80"
                                style={{
                                    borderRadius: '100px', // Circular avatar
                                    border: '3px solid #38bdf8',
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 'bold' }}>Rajendra Pancholi</span>
                                <span style={{ color: '#94a3b8', fontSize: 20 }}>rajendrapancholi.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        return new Response(`Failed to generate image`, { status: 500 });
    }
}
