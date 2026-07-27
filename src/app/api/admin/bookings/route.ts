import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Force dynamic rendering — prevents Next.js from caching this route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const bookings = await db.booking.findMany({
      include: {
        items: {
          include: {
            equipment: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Flatten bookings to match original CSV structure: one row per item
    const flattened = [];
    for (const b of bookings) {
      let serviceTier = 'Delivery Only';
      if (b.serviceLevel === 'DELIVERY_SETUP') serviceTier = 'Delivery + Setup';
      else if (b.serviceLevel === 'FULL_SERVICE') serviceTier = 'Full Service';

      for (const item of b.items) {
        flattened.push({
          Timestamp: b.createdAt.toISOString(),
          BookingId: b.id,
          Item: item.equipment.name,
          Quantity: String(item.quantity),
          StartDate: b.eventStartDate.toISOString(),
          EndDate: b.eventEndDate.toISOString(),
          Location: b.eventLocation,
          ServiceTier: serviceTier,
          FullName: b.customerName,
          Email: b.customerEmail,
          Phone: b.customerPhone,
          TotalAmount: String(b.totalAmount)
        });
      }
    }

    return NextResponse.json({ success: true, data: flattened });
  } catch (error) {
    console.error('Failed to query bookings:', error);
    return NextResponse.json({ success: false, error: 'Failed to read bookings' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { bookingId, timestamp, password } = await request.json();
    const CANCELLATION_PASSWORD = "canceladmin";

    if (password !== CANCELLATION_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Invalid cancellation password' }, { status: 401 });
    }

    let booking = null;
    if (bookingId) {
      booking = await db.booking.findUnique({
        where: { id: bookingId }
      });
    } else if (timestamp) {
      // Fallback matching by timestamp (e.g. for legacy bookings)
      const parsedDate = new Date(timestamp);
      booking = await db.booking.findFirst({
        where: {
          createdAt: {
            gte: new Date(parsedDate.getTime() - 2000),
            lte: new Date(parsedDate.getTime() + 2000)
          }
        }
      });
    }

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    // Delete booking items first, then the booking
    await db.$transaction([
      db.bookingItem.deleteMany({
        where: { bookingId: booking.id }
      }),
      db.booking.delete({
        where: { id: booking.id }
      })
    ]);

    return NextResponse.json({ success: true, message: 'Cancelled booking successfully' });
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    return NextResponse.json({ success: false, error: 'Failed to cancel booking' }, { status: 500 });
  }
}
