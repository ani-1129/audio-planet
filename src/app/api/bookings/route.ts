import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inventory } from '@/data/inventory';
import { BookingItem } from '@prisma/client';

// Force dynamic rendering — prevents Next.js from caching this route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const newStart = new Date(data.startDate);
    const newEnd = new Date(data.endDate);
    
    // items: [{ id, name, quantity, price }]
    const items: Array<{ id: string; name: string; quantity: number; price: number }> = data.items || [];
    
    // Backward compatibility for single-item format
    if (items.length === 0 && data.itemName) {
      items.push({ id: '', name: data.itemName, quantity: data.quantity || 1, price: data.total || 0 });
    }
    
    // 1. AVAILABILITY CHECK via DB
    // Query active bookings that overlap with requested dates
    const overlappingBookings = await db.booking.findMany({
      where: {
        status: { not: 'CANCELLED' },
        eventStartDate: { lt: newEnd },
        eventEndDate: { gt: newStart }
      },
      include: {
        items: true
      }
    });

    for (const item of items) {
      // Find equipment ID (or create if not present)
      let dbEquipment = await db.equipment.findFirst({
        where: { name: item.name }
      });

      if (!dbEquipment) {
        const invItem = inventory.find(i => i.name === item.name);
        let category: 'AUDIO' | 'LIGHTING' | 'TRUSSING' | 'PACKAGE' = 'PACKAGE';
        if (invItem) {
          if (invItem.category === 'audio') category = 'AUDIO';
          else if (invItem.category === 'lighting') category = 'LIGHTING';
          else if (invItem.category === 'trussing') category = 'TRUSSING';
        }

        dbEquipment = await db.equipment.create({
          data: {
            name: item.name,
            category,
            dailyRate: item.price || 0,
            totalQty: 10,
            isAvailable: true
          }
        });
      }

      // Check sum of quantities booked during the overlapping interval
      let totalBookedQty = 0;
      for (const ob of overlappingBookings) {
        const matchingItem = ob.items.find((obItem: BookingItem) => obItem.equipmentId === dbEquipment!.id);
        if (matchingItem) {
          totalBookedQty += matchingItem.quantity;
        }
      }

      // If requested quantity + already booked quantity exceeds total stock
      if (totalBookedQty + item.quantity > dbEquipment.totalQty) {
        console.log(`\n\n========================================`);
        console.log(`❌ BOOKING REJECTED (CONFLICT)`);
        console.log(`Item: ${item.name}`);
        console.log(`Sending WhatsApp to: ${data.phone}`);
        console.log(`Sending Email to: ${data.email}`);
        console.log(`Message: Hi ${data.fullName}, unfortunately the ${item.name} is fully booked/unavailable for your selected dates.`);
        console.log(`========================================\n\n`);
        
        return NextResponse.json({ 
          success: false, 
          error: `Sorry, "${item.name}" is not fully available during those dates. Only ${dbEquipment.totalQty - totalBookedQty} left in stock.` 
        });
      }
    }

    // 2. CREATE BOOKING & ITEMS IN DB TRANSACTION
    const serviceTier: 'DELIVERY_ONLY' | 'DELIVERY_SETUP' | 'FULL_SERVICE' = 
      data.serviceCost === 2000 ? 'DELIVERY_ONLY' : data.serviceCost === 5000 ? 'DELIVERY_SETUP' : 'FULL_SERVICE';

    const result = await db.$transaction(async (tx) => {
      const dbBooking = await tx.booking.create({
        data: {
          customerName: data.fullName,
          customerEmail: data.email,
          customerPhone: data.phone,
          eventStartDate: newStart,
          eventEndDate: newEnd,
          eventLocation: data.location || '',
          serviceLevel: serviceTier,
          totalAmount: data.total || 0,
          status: 'PENDING',
          notes: data.notes || ''
        }
      });

      for (const item of items) {
        let dbEquipment = await tx.equipment.findFirst({
          where: { name: item.name }
        });

        // Safe fallback (created in transaction if missing)
        if (!dbEquipment) {
          const invItem = inventory.find(i => i.name === item.name);
          let category: 'AUDIO' | 'LIGHTING' | 'TRUSSING' | 'PACKAGE' = 'PACKAGE';
          if (invItem) {
            if (invItem.category === 'audio') category = 'AUDIO';
            else if (invItem.category === 'lighting') category = 'LIGHTING';
            else if (invItem.category === 'trussing') category = 'TRUSSING';
          }
          dbEquipment = await tx.equipment.create({
            data: {
              name: item.name,
              category,
              dailyRate: item.price || 0,
              totalQty: 10,
              isAvailable: true
            }
          });
        }

        await tx.bookingItem.create({
          data: {
            bookingId: dbBooking.id,
            equipmentId: dbEquipment.id,
            quantity: item.quantity,
            priceAtBook: item.price
          }
        });
      }

      return dbBooking;
    });

    // 3. SIMULATE SUCCESS MESSAGES
    const itemSummary = items.map(i => `${i.name} (x${i.quantity})`).join(', ');
    console.log(`\n\n========================================`);
    console.log(`✅ BOOKING CONFIRMED — ${result.id}`);
    console.log(`Items: ${itemSummary}`);
    console.log(`Sending WhatsApp to: ${data.phone}`);
    console.log(`Sending Email to: ${data.email}`);
    console.log(`========================================\n\n`);
    
    return NextResponse.json({ success: true, bookingId: result.id });
  } catch (error) {
    console.error('Failed to create booking in database:', error);
    return NextResponse.json({ success: false, error: 'Failed to process booking. Server error: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
