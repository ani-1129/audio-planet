import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering — prevents Next.js from caching this route
export const dynamic = 'force-dynamic';

// Helper to check if two date ranges overlap
function doDatesOverlap(start1: Date, end1: Date, start2: Date, end2: Date) {
  return start1 < end2 && start2 < end1;
}

// Generate a short booking ID
function generateBookingId() {
  return 'BK-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Define CSV file path at the root of the project
    const csvFilePath = path.join(process.cwd(), 'bookings_database.csv');
    const fileExists = fs.existsSync(csvFilePath);
    
    const newStart = new Date(data.startDate);
    const newEnd = new Date(data.endDate);
    
    // items is now an array: [{ id, name, quantity, price }]
    const items: Array<{ id: string; name: string; quantity: number; price: number }> = data.items || [];
    
    // Backward compat: if old single-item format is used
    if (items.length === 0 && data.itemName) {
      items.push({ id: '', name: data.itemName, quantity: data.quantity || 1, price: data.total || 0 });
    }
    
    // 1. AVAILABILITY CHECK
    if (fileExists) {
      const csvData = fs.readFileSync(csvFilePath, 'utf8');
      const lines = csvData.trim().split('\n').slice(1).filter(line => line.trim()); // skip headers, skip empty
      
      for (const item of items) {
        for (const line of lines) {
          const columns = line.match(/(\".*?\"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
          if (columns.length >= 5) {
            const bookedItem = columns[1].replace(/"/g, '');
            const bookedStartStr = columns[3].replace(/"/g, '');
            const bookedEndStr = columns[4].replace(/"/g, '');
            
            if (bookedItem === item.name) {
              const bookedStart = new Date(bookedStartStr);
              const bookedEnd = new Date(bookedEndStr);
              
              if (doDatesOverlap(newStart, newEnd, bookedStart, bookedEnd)) {
                console.log(`\n\n========================================`);
                console.log(`❌ BOOKING REJECTED (CONFLICT)`);
                console.log(`Item: ${item.name}`);
                console.log(`Sending WhatsApp to: ${data.phone}`);
                console.log(`Sending Email to: ${data.email}`);
                console.log(`Message: Hi ${data.fullName}, unfortunately the ${item.name} is already booked for your selected dates. Please try different dates or contact us for alternatives.`);
                console.log(`========================================\n\n`);
                
                return NextResponse.json({ 
                  success: false, 
                  error: `Sorry, "${item.name}" is already booked during those dates. Please select different dates or remove it from your selection.` 
                });
              }
            }
          }
        }
      }
    }
    
    // 2. SAVE BOOKING — one row per item, sharing a bookingId
    const headers = 'Timestamp,BookingId,Item,Quantity,StartDate,EndDate,Location,ServiceTier,FullName,Email,Phone,ItemPrice,TotalAmount\n';
    const timestamp = new Date().toISOString();
    const bookingId = generateBookingId();
    const serviceTier = data.serviceCost === 2000 ? 'Delivery Only' : data.serviceCost === 5000 ? 'Delivery + Setup' : 'Full Service';
    const escapeCsv = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
    
    let rows = '';
    for (const item of items) {
      const itemSubtotal = item.price * item.quantity;
      rows += `${escapeCsv(timestamp)},${escapeCsv(bookingId)},${escapeCsv(item.name)},${item.quantity},${escapeCsv(data.startDate)},${escapeCsv(data.endDate)},${escapeCsv(data.location)},${escapeCsv(serviceTier)},${escapeCsv(data.fullName)},${escapeCsv(data.email)},${escapeCsv(data.phone)},${itemSubtotal},${data.total}\n`;
    }
    
    if (!fileExists) {
      fs.writeFileSync(csvFilePath, headers + rows, 'utf8');
    } else {
      // Check if the existing file has the new header format (with BookingId)
      const existingContent = fs.readFileSync(csvFilePath, 'utf8');
      if (!existingContent.includes('BookingId')) {
        // Migrate: rewrite with new headers, keeping old data rows
        const oldLines = existingContent.trim().split('\n');
        const oldRows = oldLines.slice(1).filter(l => l.trim());
        // Map old rows: insert empty BookingId and ItemPrice columns
        const migratedRows = oldRows.map(row => {
          const cols = row.match(/(\".*?\"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
          // Old format: Timestamp,Item,Quantity,StartDate,EndDate,Location,ServiceTier,FullName,Email,Phone,TotalAmount
          // New format: Timestamp,BookingId,Item,Quantity,StartDate,EndDate,Location,ServiceTier,FullName,Email,Phone,ItemPrice,TotalAmount
          const totalAmount = cols[10] || '0';
          return `${cols[0] || '""'},"",${cols[1] || '""'},${cols[2] || '1'},${cols[3] || '""'},${cols[4] || '""'},${cols[5] || '""'},${cols[6] || '""'},${cols[7] || '""'},${cols[8] || '""'},${cols[9] || '""'},${totalAmount},${totalAmount}`;
        });
        fs.writeFileSync(csvFilePath, headers + migratedRows.join('\n') + '\n' + rows, 'utf8');
      } else {
        fs.appendFileSync(csvFilePath, rows, 'utf8');
      }
    }
    
    // 3. SIMULATE SUCCESS MESSAGES
    const itemSummary = items.map(i => `${i.name} (x${i.quantity})`).join(', ');
    console.log(`\n\n========================================`);
    console.log(`✅ BOOKING CONFIRMED — ${bookingId}`);
    console.log(`Items: ${itemSummary}`);
    console.log(`Sending WhatsApp to: ${data.phone}`);
    console.log(`Sending Email to: ${data.email}`);
    console.log(`Message: Hi ${data.fullName}, your booking (${bookingId}) for ${itemSummary} from ${data.startDate} to ${data.endDate} is confirmed! Estimated total: ₹${data.total?.toLocaleString()}. We will contact you soon.`);
    console.log(`========================================\n\n`);
    
    return NextResponse.json({ success: true, bookingId });
  } catch (error) {
    console.error('Failed to write to CSV:', error);
    return NextResponse.json({ success: false, error: 'Failed to process booking. Server error: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
