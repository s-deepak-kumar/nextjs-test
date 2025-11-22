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
    // ... existing code ...
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

    return NextResponse.json({
      // ... existing code ...
    });
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