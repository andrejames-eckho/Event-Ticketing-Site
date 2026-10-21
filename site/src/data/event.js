// All event content for the design build. Field names follow docs/11-content-model.md so this maps 1:1 to Sanity.
// Status of every value:
//   CONFIRMED-PH  owner gave a working placeholder (2026-10-21): name, dates, venue
//   PLACEHOLDER   waiting on client (docs/07 Q1–Q10). Client writes all copy (Q5) and supplies brand assets (Q4).
//   PENDING-TM    waiting on Ticketmelon (docs/07 T1–T9)

// ── Ticketmelon ────────────────────────────────────────────────────────────────
// status: 'pending' = no event/IDs yet, checkout shows a preview dialog instead of redirecting.
//         'test'    = pointed at Eckho's own test event (site/README.md), real redirect.
//         'live'    = client's production event.
// mode:   'fast_checkout' = Mode A (on-site Bag), 'deep_link' = Mode B (fallback, one button per tier).
export const ticketmelon = {
  status: import.meta.env.PUBLIC_TM_STATUS || (import.meta.env.PUBLIC_TM_EVENT_URL ? 'test' : 'pending'),
  eventUrl: import.meta.env.PUBLIC_TM_EVENT_URL || 'https://www.ticketmelon.com/REPLACE_ORGANIZER/REPLACE_EVENT', // PENDING-TM Q2
  mode: import.meta.env.PUBLIC_TM_MODE || 'fast_checkout', // PENDING-TM T3
  availabilityFeed: false, // PENDING-TM T9: live `remain` per ticket type. Until then status is manual (CMS).
  paymentMethods: ['Visa / Mastercard', 'GCash', 'Maya', 'GrabPay', 'ShopeePay'], // PENDING-TM confirm for client's account
};

// ── Event + edition ────────────────────────────────────────────────────────────
export const event = {
  name: 'Chrome: Dinagyang', // CONFIRMED-PH
  brand: 'Chrome', // CONFIRMED-PH (client)
  title: 'Dinagyang', // CONFIRMED-PH
  slug: 'dinagyang',
  tagline: 'One stage. Two nights. Iloilo turned to chrome.', // PLACEHOLDER copy (Q5)
};

export const edition = {
  title: 'Chrome: Dinagyang 2027',
  year: 2027,
  // Drives hero copy, CTA labels, ticket cards and sticky bar (docs/08 §6).
  // announce | presale | onsale | final | soldout | past
  saleState: 'onsale',
  startDate: '2027-01-23T15:00:00+08:00', // CONFIRMED-PH 23–24 Jan (owner, 2026-10-21); gates time PLACEHOLDER
  endDate: '2027-01-24T23:59:00+08:00',
  dateLabel: '23–24 Jan 2027',
  dateLong: 'Sat 23 – Sun 24 January 2027',
  days: [
    { key: 'sat', label: 'Saturday', short: 'Sat 23 Jan', gates: '3:00 PM' }, // gates PLACEHOLDER
    { key: 'sun', label: 'Sunday', short: 'Sun 24 Jan', gates: '3:00 PM' },
  ],
  venue: {
    name: 'ICON', // CONFIRMED-PH
    city: 'Iloilo City', // assumed from Dinagyang; confirm Q1
    address: '[Venue street address], Iloilo City', // PLACEHOLDER Q1
    capacity: '[Capacity]', // PLACEHOLDER Q1
  },
  phaseNote: 'Phase 1 on sale', // PLACEHOLDER Q3
  phaseEnds: '[Phase 1 end date]', // PLACEHOLDER Q3
  feeDisclosure: 'Prices in PHP, VAT inclusive. Ticketmelon service and payment fees are shown at checkout.', // Q8
  ageLimit: '18+', // PLACEHOLDER
};

// CTA + status copy per sale state (docs/08 §6). PLACEHOLDER copy (Q5).
export const saleStates = {
  announce: { label: 'Announced', cta: 'Get notified', ctaHref: '#waitlist', status: 'Tickets on sale soon', sticky: 'Get notified' },
  presale: { label: 'Presale', cta: 'Unlock presale', ctaHref: '/tickets', status: 'Presale live · code required', sticky: 'Presale live' },
  onsale: { label: 'On sale', cta: 'Get tickets', ctaHref: '/tickets', status: `${edition.phaseNote} · ends ${edition.phaseEnds}`, sticky: 'Get tickets' },
  final: { label: 'Final release', cta: 'Last chance', ctaHref: '/tickets', status: 'Final release · few left', sticky: 'Last tickets' },
  soldout: { label: 'Sold out', cta: 'Join waitlist', ctaHref: '#waitlist', status: 'Sold out · join the waitlist for returns', sticky: 'Join waitlist' },
  past: { label: 'Past', cta: 'Watch recap', ctaHref: '#recap', status: 'Thank you, Iloilo. See you next year.', sticky: 'Notify me for 2028' },
};

// ── Tickets ───────────────────────────────────────────────────────────────────
// PLACEHOLDER tiers + prices (Q3). ticketTypeId is the 32-char hex id from the Ticketmelon organizer
// dashboard (PENDING-TM T3). Override at run time: PUBLIC_TM_TICKET_IDS="weekend=<id>,vip=<id>,...".
const idOverrides = Object.fromEntries(
  (import.meta.env.PUBLIC_TM_TICKET_IDS || '')
    .split(',')
    .filter(Boolean)
    .map((pair) => pair.split('=').map((s) => s.trim())),
);

export const ticketGroups = [
  { key: 'weekend', label: '2-Day' },
  { key: 'day', label: 'Day passes' },
  { key: 'group', label: 'Barkada' },
  { key: 'addon', label: 'Add-ons' },
];

export const tiers = [
  {
    key: 'weekend',
    group: 'weekend',
    name: '2-Day GA',
    phase: 'Phase 1',
    pricePhp: 3200,
    includes: ['Saturday + Sunday entry', 'Full lineup, both nights', 'Free re-entry each day'],
    status: 'on_sale',
    highlight: true,
    maxQty: 6,
    ladder: [
      { label: 'Early Bird', pricePhp: 2500, state: 'done' },
      { label: 'Phase 1', pricePhp: 3200, state: 'current' },
      { label: 'Phase 2', pricePhp: 3800, state: 'next' },
      { label: 'At the gate', pricePhp: 4500, state: 'next' },
    ],
  },
  {
    key: 'vip',
    group: 'weekend',
    name: '2-Day VIP',
    phase: 'Phase 1',
    pricePhp: 6500,
    includes: ['Everything in GA', 'Raised VIP deck facing the stage', 'Express entry lane', 'Private bars + toilets'],
    status: 'low_stock',
    maxQty: 4,
    ladder: [
      { label: 'Early Bird', pricePhp: 5500, state: 'done' },
      { label: 'Phase 1', pricePhp: 6500, state: 'current' },
      { label: 'Phase 2', pricePhp: 7500, state: 'next' },
    ],
  },
  {
    key: 'sat',
    group: 'day',
    name: 'Saturday Pass',
    phase: 'Day pass',
    pricePhp: 1900,
    includes: ['Saturday 23 Jan entry', 'Full Saturday lineup'],
    status: 'coming_soon',
    releaseNote: 'Day passes drop [date]',
    maxQty: 6,
  },
  {
    key: 'sun',
    group: 'day',
    name: 'Sunday Pass',
    phase: 'Day pass',
    pricePhp: 1900,
    includes: ['Sunday 24 Jan entry', 'Full Sunday lineup'],
    status: 'coming_soon',
    releaseNote: 'Day passes drop [date]',
    maxQty: 6,
  },
  {
    key: 'barkada',
    group: 'group',
    name: 'Barkada 4-Pack',
    phase: 'Phase 1',
    pricePhp: 11200,
    includes: ['4 × 2-Day GA', 'Save ₱1,600 vs single', 'One QR per person'],
    status: 'sold_out',
    maxQty: 2,
  },
  {
    key: 'shuttle',
    group: 'addon',
    name: 'Airport Shuttle',
    phase: 'Add-on',
    pricePhp: 600,
    includes: ['Round trip, Iloilo Airport ↔ venue', 'Both days'],
    status: 'on_sale',
    maxQty: 6,
  },
].map((tier) => ({ ...tier, ticketTypeId: idOverrides[tier.key] || `REPLACE_${tier.key.toUpperCase()}` }));

export const fromPrice = Math.min(...tiers.filter((t) => t.group !== 'addon').map((t) => t.pricePhp));

// ── Lineup ────────────────────────────────────────────────────────────────────
// PLACEHOLDER lineup (Q1). Names are deliberately fake and labelled; lengths vary to stress-test the type.
// One stage, one running order per night: no clashes, every set is a main-stage set.
export const stage = { name: 'Main Stage' }; // PLACEHOLDER stage name (Q1)

const bio =
  'Artist bio goes here. Two or three lines about the act, their sound and why this set matters. Supplied by the client or the artist’s team.';

export const artists = [
  // Saturday running order
  { name: 'Support Seven', billing: 'support', day: 'sat', start: '15:30', end: '16:30', origin: 'PH' },
  { name: 'Ten', billing: 'support', day: 'sat', start: '16:30', end: '17:30', origin: 'PH' },
  { name: 'Fourteen', billing: 'support', day: 'sat', start: '17:30', end: '18:45', origin: 'PH' },
  { name: 'Five', billing: 'sub', day: 'sat', start: '18:45', end: '20:00', origin: 'PH' },
  { name: 'Sub Act Three', billing: 'sub', day: 'sat', start: '20:00', end: '21:15', origin: 'PH' },
  { name: 'Headliner One', billing: 'headliner', day: 'sat', start: '21:30', end: '23:00', origin: 'PH' },
  { name: 'Eight b2b Nine', billing: 'support', day: 'sat', start: '23:00', end: '00:30', origin: 'PH', closing: true },
  // Sunday running order
  { name: 'Eleven', billing: 'support', day: 'sun', start: '15:30', end: '16:30', origin: 'PH' },
  { name: 'DJ Thirteen', billing: 'support', day: 'sun', start: '16:30', end: '17:30', origin: 'PH' },
  { name: 'Fifteen Live', billing: 'support', day: 'sun', start: '17:30', end: '18:45', origin: 'PH' },
  { name: 'Sixth Sound System', billing: 'sub', day: 'sun', start: '18:45', end: '20:00', origin: 'PH' },
  { name: 'Fourth Collective', billing: 'sub', day: 'sun', start: '20:00', end: '21:15', origin: 'INT' },
  { name: 'The Second Headliner', billing: 'headliner', day: 'sun', start: '21:30', end: '23:00', origin: 'INT' },
  { name: 'Twelve', billing: 'support', day: 'sun', start: '23:00', end: '00:30', origin: 'INT', closing: true },
].map((a) => ({
  ...a,
  slug: a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  genre: 'Genre / style',
  bio,
}));

export const scheduleReleased = true; // false shows the "set times drop soon" state (docs/08)

// ── Experience, venue, travel ──────────────────────────────────────────────────
export const experiences = [
  // PLACEHOLDER copy + photos (Q4, Q5)
  { title: 'The Stage', text: 'One stage, full production. Every act plays the big room, so you never have to choose. Short line about the build.', photo: 'Wide shot of the stage, chrome set pieces, lasers over the crowd' },
  { title: 'Night Market', text: 'Ilonggo food stalls and late-night bites. Short line about vendors.', photo: 'Food stall close-up, steam, warm light' },
  { title: 'Art + Craft', text: 'Local makers, installations and live art. Short line about artists.', photo: 'Metal installation lit at dusk' },
  { title: 'Cool-down Garden', text: 'Seats, shade, water and phone charging away from the speakers. Short line about the space.', photo: 'Lounge area with soft lighting, people resting' },
];

export const stats = [
  // PLACEHOLDER (past edition data, Q1)
  { value: '[XX,000]', label: 'fans last edition' },
  { value: '[XX]', label: 'artists' },
  { value: '2', label: 'days' },
  { value: '1', label: 'stage, no clashes' },
];

export const travel = [
  // PLACEHOLDER copy (Q5). Times are rough; client to confirm.
  { mode: 'By air', text: 'Fly into Iloilo International Airport. About [XX] min to the venue by car or shuttle.' },
  { mode: 'By sea', text: 'Fast craft from Bacolod to Iloilo, then [X] min by taxi or ride-hail.' },
  { mode: 'In the city', text: 'Jeepney, taxi and ride-hail all go to [venue]. Drop-off point at [gate].' },
  { mode: 'Parking', text: 'Limited parking at [location]. Book ahead or take the shuttle.' },
];

export const stays = [
  // PLACEHOLDER (accommodation partners, Q1)
  { name: 'Hotel partner one', note: '[X] min walk · partner rate with code' },
  { name: 'Hotel partner two', note: '[X] min drive · shuttle stop' },
  { name: 'Hostel / budget option', note: '[X] min drive' },
];

export const rules = {
  // PLACEHOLDER (client policy)
  allowed: ['Valid government ID', 'Clear bag up to [size]', 'Empty refillable bottle', 'Phone + power bank', 'Sunscreen (non-aerosol)'],
  notAllowed: ['Outside food and drinks', 'Professional cameras', 'Umbrellas', 'Laser pens', 'Illegal substances'],
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
// PLACEHOLDER copy (Q5): structure and categories are final, wording is not.
export const faqCategories = [
  { key: 'tickets', label: 'Tickets' },
  { key: 'entry', label: 'Entry' },
  { key: 'venue', label: 'Venue' },
  { key: 'refunds', label: 'Refunds' },
  { key: 'access', label: 'Accessibility' },
];

export const faqs = [
  { cat: 'tickets', top: true, q: 'Where do I buy official tickets?', a: 'Only on this site. Pick your passes here and pay on Ticketmelon, our official ticketing partner. Tickets from anywhere else may be fake.' },
  { cat: 'tickets', top: true, q: 'How do I pay?', a: 'Card, GCash, Maya, GrabPay or ShopeePay at Ticketmelon checkout. Service and payment fees are shown before you pay.' },
  { cat: 'tickets', q: 'Can I buy for my barkada?', a: 'Yes. Up to [X] tickets per order, or grab a Barkada 4-Pack when available. Each person gets their own QR.' },
  { cat: 'tickets', q: 'Where is my ticket after I pay?', a: 'Ticketmelon emails your e-ticket and it shows in your Ticketmelon account and app.' },
  { cat: 'entry', top: true, q: 'What is the age limit?', a: '[18+]. Bring a valid government ID. No ID, no entry.' },
  { cat: 'entry', top: true, q: 'What time do gates open?', a: 'Gates open at [3:00 PM] both days. Last entry [time].' },
  { cat: 'entry', q: 'Is there re-entry?', a: '[Yes, until X PM] with your wristband and QR.' },
  { cat: 'venue', top: true, q: 'What can I bring?', a: 'See the full list on the Info page. Short version: ID, clear bag, empty bottle, phone. No outside food or drinks.' },
  { cat: 'venue', q: 'Is there food and water inside?', a: 'Yes. Night Market food stalls and free water refill stations.' },
  { cat: 'refunds', top: true, q: 'Can I get a refund?', a: 'Tickets are [non-refundable] except if the event is cancelled. Refunds go through Ticketmelon.' },
  { cat: 'refunds', q: 'Can I transfer my ticket?', a: '[Name changes are possible up to X days before] via your Ticketmelon account.' },
  { cat: 'access', q: 'Is the venue wheelchair accessible?', a: '[Accessible entrance, viewing platform and toilets]. Email [contact] to arrange a companion ticket.' },
];

// ── Partners, socials, legal ──────────────────────────────────────────────────
export const partners = [
  // PLACEHOLDER (Q1)
  { name: 'Presenting partner', tier: 'presenting' },
  { name: 'Partner', tier: 'major' },
  { name: 'Partner', tier: 'major' },
  { name: 'Partner', tier: 'major' },
  { name: 'Partner', tier: 'supporting' },
  { name: 'Partner', tier: 'supporting' },
  { name: 'Partner', tier: 'supporting' },
  { name: 'Partner', tier: 'supporting' },
];

export const socials = [
  // PLACEHOLDER handles (Q1)
  { name: 'Instagram', href: '#' },
  { name: 'TikTok', href: '#' },
  { name: 'Facebook', href: '#' },
  { name: 'Spotify', href: '#' },
];

export const legalPages = [
  { slug: 'terms', title: 'Terms of entry' },
  { slug: 'privacy', title: 'Privacy notice' },
  { slug: 'refunds', title: 'Refund policy' },
  { slug: 'code-of-conduct', title: 'Code of conduct' },
];

export const nav = [
  { href: '/lineup', label: 'Lineup' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/info', label: 'Info' },
  { href: '/faq', label: 'FAQ' },
];
