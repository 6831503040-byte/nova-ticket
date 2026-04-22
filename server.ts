
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nova-ticket-secret-key-2026';

// Mock Database
const DEFAULT_ZONES = { 'VVIP (Row A-B)': 15000, 'VIP (Row C-E)': 9500, 'Gold (Row F-G)': 6500, 'Silver (Row H-J)': 4500, 'Bronze (Row K-M)': 2500 };

const EVENT_DATA: Record<string, any> = {
  '1': { id: '1', title: 'Taylor Swift', basePrice: 2500, openingTime: 0, zones: DEFAULT_ZONES },
  '2': { id: '2', title: 'Bruno Mars', basePrice: 1500, openingTime: 0, zones: DEFAULT_ZONES },
  '3': { id: '3', title: 'The Weeknd', basePrice: 3000, openingTime: 0, zones: DEFAULT_ZONES },
  '4': { id: '4', title: 'Coldplay', basePrice: 2000, openingTime: 0, zones: DEFAULT_ZONES },
  '5': { id: '5', title: 'Wonderfruit', basePrice: 5000, openingTime: 0, zones: DEFAULT_ZONES },
  '6': { id: '6', title: 'Lee Youngji', basePrice: 2500, openingTime: 0, zones: DEFAULT_ZONES },
  '7': { id: '7', title: 'Cha Eun-Woo', basePrice: 2500, openingTime: 0, zones: DEFAULT_ZONES },
  'cs1': { id: 'cs1', title: 'Dua Lipa', basePrice: 2500, openingTime: 0, zones: DEFAULT_ZONES },
  'cs2': { id: 'cs2', title: 'Ultra Bangkok', basePrice: 3500, openingTime: 0, zones: DEFAULT_ZONES }
};

const USER_BOOKINGS: Record<string, any[]> = {}; 

const app = express();
app.use(express.json());
app.use(cors());

// --- API Endpoints ---

app.get('/api/bookings/:email', (req, res) => {
  const { email } = req.params;
  res.json(USER_BOOKINGS[email] || []);
});

app.post('/api/bookings', (req, res) => {
  const { email, booking } = req.body;
  if (!USER_BOOKINGS[email]) {
    USER_BOOKINGS[email] = [];
  }
  USER_BOOKINGS[email].unshift(booking);
  res.json({ success: true });
});

app.post('/api/checkout/validate', (req, res) => {
  const { eventId, seats } = req.body;
  const event = EVENT_DATA[eventId];

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  let total = 0;
  seats.forEach((seatId: string) => {
    const row = seatId.charAt(0);
    let zonePrice = event.basePrice;
    if (['A', 'B'].includes(row)) zonePrice = event.zones['VVIP (Row A-B)'];
    else if (['C', 'D', 'E'].includes(row)) zonePrice = event.zones['VIP (Row C-E)'];
    else if (['F', 'G'].includes(row)) zonePrice = event.zones['Gold (Row F-G)'];
    else if (['H', 'I', 'J'].includes(row)) zonePrice = event.zones['Silver (Row H-J)'];
    else if (['K', 'L', 'M'].includes(row)) zonePrice = event.zones['Bronze (Row K-M)'];
    total += zonePrice;
  });

  const finalTotal = total + 200; // + service fee

  const validationToken = jwt.sign({
    eventId,
    seats,
    total: finalTotal,
    timestamp: Date.now()
  }, JWT_SECRET, { expiresIn: '15m' });

  res.json({
    success: true,
    total: finalTotal,
    token: validationToken
  });
});

// For local development with AI Studio (Express)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

export default app;
