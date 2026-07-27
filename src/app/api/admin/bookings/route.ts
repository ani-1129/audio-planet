import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering — prevents Next.js from caching this route
export const dynamic = 'force-dynamic';

function parseCSV(csvText: string) {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',');
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // skip empty lines
    
    // Basic regex to handle commas inside quotes
    const row = lines[i].match(/(\".*?\"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    
    // Clean up quotes
    const cleanedRow = row.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = cleanedRow[index] || '';
    });
    results.push(obj);
  }
  
  return results;
}

export async function GET(request: Request) {
  try {
    const csvFilePath = path.join(process.cwd(), 'bookings_database.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      return NextResponse.json({ success: true, data: [] });
    }
    
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const parsedData = parseCSV(csvData);
    
    // Sort by most recent first
    parsedData.reverse();
    
    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Failed to read CSV:', error);
    return NextResponse.json({ success: false, error: 'Failed to read bookings' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { bookingId, timestamp, password } = await request.json();
    
    // Different password for cancellation
    const CANCELLATION_PASSWORD = "canceladmin";

    if (password !== CANCELLATION_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Invalid cancellation password' }, { status: 401 });
    }

    const csvFilePath = path.join(process.cwd(), 'bookings_database.csv');
    if (!fs.existsSync(csvFilePath)) {
      return NextResponse.json({ success: false, error: 'Database not found' }, { status: 404 });
    }

    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvData.trim().split('\n');
    if (lines.length === 0) {
      return NextResponse.json({ success: false, error: 'Empty database' });
    }

    const headers = lines[0];
    const remainingLines = [];
    let cancelledCount = 0;

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const row = lines[i].match(/(\".*?\"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const cleanedRow = row.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
      
      const rowTimestamp = cleanedRow[0] || '';
      const rowBookingId = cleanedRow[1] || '';

      // If the row has a bookingId, match by bookingId, else fallback to matching by exact timestamp
      const isMatch = bookingId && rowBookingId 
        ? rowBookingId === bookingId 
        : rowTimestamp === timestamp;

      if (isMatch) {
         cancelledCount++;
      } else {
         remainingLines.push(lines[i]);
      }
    }

    if (cancelledCount > 0) {
       fs.writeFileSync(csvFilePath, [headers, ...remainingLines].join('\n') + '\n', 'utf8');
    }

    return NextResponse.json({ success: true, message: `Cancelled ${cancelledCount} items in booking` });
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    return NextResponse.json({ success: false, error: 'Failed to cancel booking' }, { status: 500 });
  }
}
