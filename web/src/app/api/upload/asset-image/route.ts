import { put } from '@vercel/blob';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const contentType = request.headers.get('content-type');

    if (!contentType || !allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFilename = `assets/${timestamp}-${filename}`;

    const body = await request.arrayBuffer();

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, body, {
      access: 'public',
      contentType,
    });

    return NextResponse.json({
      url: blob.url,
      filename: uniqueFilename,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}