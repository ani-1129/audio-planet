export const companyInfo = {
  name: 'Audioplanet',
  tagline: 'Premium audio, lighting, and truss rental for live events.',
  contact: {
    phone: '+91 99999 99999',
    supportEmail: 'support@audioplanet.in',
    salesEmail: 'bookings@audioplanet.in',
    warehouseAddress: 'Plot 14, Sector 63, Noida, Uttar Pradesh, India',
  },
  socialMedia: {
    instagram: 'https://instagram.com/audioplanet',
    facebook: 'https://facebook.com/audioplanet',
    youtube: 'https://youtube.com/@audioplanet',
  },
  logistics: {
    serviceArea: 'Delhi NCR, including Delhi, Noida, Ghaziabad, Gurugram, and Faridabad.',
    deliveryFee: {
      within15km: 800,
      within30km: 1500,
      beyond: 'Custom quote',
    },
    setupFee: {
      smallEvents: 2000,
      mediumEvents: 5000,
      largeEvents: '10000+',
    },
    staffing: {
      basicEngineer: 3500, // per day
      seniorFOHEngineer: 6500, // per day
    }
  },
  bookingRules: {
    minLeadTime: '48 hours before delivery',
    sameDayBooking: 'Only if inventory and staff are available',
    inventoryPolicy: 'Auto-block unavailable items once a booking is confirmed',
    quoteRequests: 'Manual review before final approval for large or custom bookings',
  },
  cancellationPolicy: [
    { period: 'More than 7 days before event', refund: '90% refund' },
    { period: '3 to 7 days before event', refund: '50% refund' },
    { period: 'Less than 72 hours before event', refund: 'No refund on reserved inventory' },
    { period: 'If Audioplanet cancels due to logistics issues', refund: 'Full refund or reschedule option' },
  ],
  financials: {
    taxes: {
      gstApplied: true,
      demoGSTRate: 18,
      gstin: '07ABCDE1234F1Z5 (Demo)',
    },
    invoiceFormat: 'Base rent + delivery + setup + engineer fee + GST',
    paymentFlow: {
      bookingAdvance: '20% to confirm',
      remainingBalance: 'Due before dispatch or on delivery',
      highValueEvents: '100% upfront may be required',
      refunds: 'Processed back to original payment method after approval',
    }
  },
  legal: {
    termsOfService: [
      'All rentals are subject to availability and final confirmation.',
      'Equipment must be used only for intended event purposes.',
      'Customer is responsible for loss, theft, or damage during rental period.',
      'Late return charges apply per extra day.',
      'Delivery timings depend on traffic, venue access, and weather.'
    ],
    privacyPolicy: [
      'Customer data is collected for booking, invoicing, and support.',
      'Payment data is handled by the payment gateway and not stored directly.',
      'Contact details may be used for booking updates and service communication.',
      'Data is not sold to third parties.'
    ],
    rentalAgreement: [
      'Customer must verify equipment condition at delivery.',
      'Any damage beyond normal wear and tear is chargeable.',
      'No unauthorized technical modification is allowed.',
      'Venue access, power availability, and unloading assistance must be arranged by customer unless included in the order.',
      'A liability waiver checkbox must be accepted before checkout.'
    ]
  }
};
