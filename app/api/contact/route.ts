import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { captureError, initOutageX } from '../../lib/outagex-sdk';

// Initialize SDK for server-side (API routes)
if (typeof window === 'undefined') {
  initOutageX({
    projectId: '17bc94c5-7e27-46d6-a8ce-6e21c227287d',
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
    enabled: true,
  });
}

const MAX_DEPTH = 5;
let currentDepth = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields only — no special character checks
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create data directory if needed
    const dataDir = path.join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // File path
    const filePath = path.join(dataDir, 'contacts.json');
    let contacts = [];

    // Natural errors will happen here if invalid chars break JSON
    if (existsSync(filePath)) {
      const fileContent = await readFile(filePath, 'utf-8');
      contacts = JSON.parse(fileContent); // <-- natural error point
    }

    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    contacts.push(newContact);

    // Natural error possible here if invalid encoding breaks writing
    await writeFile(filePath, JSON.stringify(contacts, null, 2), 'utf-8');

    return NextResponse.json(
      { message: 'Contact saved successfully', contact: newContact },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving contact:', error);

    // Ensure error is an Error instance
    const errorToReport = error instanceof Error 
      ? error 
      : new Error(String(error));

    try {
      await captureErrorWithDepthLimit(errorToReport, {
        source: 'app/api/contact/route.ts',
        component: 'ContactAPI',
        severity: 'error',
        action: 'form_submission',
      });
      console.log('✅ Error captured by Outagex SDK');
    } catch (captureErr) {
      console.error('Failed to capture error with Outagex SDK:', captureErr);
    }

    return NextResponse.json(
      { error: 'Failed to save contact' },
      { status: 500 }
    );
  }
}

async function captureErrorWithDepthLimit(error: Error, options: any) {
  if (currentDepth >= MAX_DEPTH) {
    console.error('Error capturing exceeded maximum depth');
    return;
  }
  currentDepth++;
  try {
    await captureError(error, options);
  } finally {
    currentDepth--;
  }
}