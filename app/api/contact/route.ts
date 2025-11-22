import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Read existing data or create new array
    const filePath = path.join(dataDir, 'contacts.json');
    let contacts = [];
    
    if (existsSync(filePath)) {
      const fileContent = await readFile(filePath, 'utf-8');
      contacts = JSON.parse(fileContent);
    }

    // Add new contact
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    contacts.push(newContact);

    // Write to file
    await writeFile(filePath, JSON.stringify(contacts, null, 2), 'utf-8');

    return NextResponse.json(
      { message: 'Contact saved successfully', contact: newContact },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json(
      { error: 'Failed to save contact' },
      { status: 500 }
    );
  }
}

