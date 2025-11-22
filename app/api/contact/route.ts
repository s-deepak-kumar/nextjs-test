import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { captureError } from '../../lib/outagex-sdk';

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

    if (error instanceof Error) {
      await captureError(error, {
        source: 'app/api/contact/route.ts',
        component: 'ContactAPI',
        severity: 'error',
        action: 'form_submission',
      });
    }

    return NextResponse.json(
      { error: 'Failed to save contact' },
      { status: 500 }
    );
  }
}
