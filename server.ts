
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nova-ticket-secret-key-2026';

// Mock Database for Events and Prices (Single Source of Truth)
const DEFAULT_ZONES = { 'VVIP (Row A-B)': 15000, 'VIP (Row C-E)': 9500, 'Gold (Row F-G)': 6500, 'Silver (Row H-J)': 4500, 'Bronze (Row K-M)': 2500 };

const EVENT_DATA: Record<string, { 
  id: string, 
  title: string, 
  basePrice: number, 
  openingTime: number,
  zones: Record<string, number>
}> = {
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

// Persistent store for bookings (Server-side)
const USER_BOOKINGS: Record<string, any[]> = {}; // email -> Booking[]
const ALL_SOLD_SEATS: Record<string, string[]> = {}; // roomId -> seatId[]

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // --- Booking Persistence ---
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

    // Track global sold seats for real-time sync across all users
    const roomId = `${booking.event.id}-${booking.roundId}`;
    if (!ALL_SOLD_SEATS[roomId]) {
      ALL_SOLD_SEATS[roomId] = [];
    }
    // Add unique seats to the global sold list
    const newSeats = booking.seats.filter((s: string) => !ALL_SOLD_SEATS[roomId].includes(s));
    ALL_SOLD_SEATS[roomId].push(...newSeats);

    // Broadcast the new sold seats to everyone in the seating room
    io.to(roomId).emit('seats-sold', newSeats);

    res.json({ success: true });
  });

  // --- Secure Price Validation ---
  app.post('/api/checkout/validate', (req, res) => {
    const { eventId, seats } = req.body;
    const event = EVENT_DATA[eventId];

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Calculate total based on server-side prices (Single Source of Truth)
    let total = 0;
    const validatedSeats = seats.map((seatId: string) => {
      const row = seatId.charAt(0);
      // Determine zone from row (matching SeatingPlan.tsx logic but on server)
      let zonePrice = event.basePrice;
      if (['A', 'B'].includes(row)) zonePrice = event.zones['VVIP (Row A-B)'];
      else if (['C', 'D', 'E'].includes(row)) zonePrice = event.zones['VIP (Row C-E)'];
      else if (['F', 'G'].includes(row)) zonePrice = event.zones['Gold (Row F-G)'];
      else if (['H', 'I', 'J'].includes(row)) zonePrice = event.zones['Silver (Row H-J)'];
      else if (['K', 'L', 'M'].includes(row)) zonePrice = event.zones['Bronze (Row K-M)'];
      
      total += zonePrice;
      return { id: seatId, price: zonePrice };
    });

    const fee = 200;
    const finalTotal = total + fee;

    // Create a signed token to prevent tampering in the next step
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

  // In-memory store for locked seats
  const lockedSeats: Record<string, Record<string, { userId: string, timestamp: number }>> = {};

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle delayed notification trigger
    socket.on('trigger-notification', ({ eventId, eventTitle }: { eventId: string, eventTitle: string }) => {
      console.log(`Notification scheduled for ${eventTitle} (${eventId}) in 10s`);
      
      setTimeout(() => {
        socket.emit('notification', {
          id: `triggered-${eventId}-${Date.now()}`,
          type: 'SALE_OPEN',
          title: 'Reminder!',
          message: `Your requested reminder for ${eventTitle} is here!`,
          eventId: eventId,
          timestamp: Date.now()
        });
      }, 10000);
    });

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      // Sync initial locks
      if (lockedSeats[roomId]) {
        socket.emit('initial-locks', lockedSeats[roomId]);
      }
      // Sync initial sold seats from ALL users
      if (ALL_SOLD_SEATS[roomId]) {
        socket.emit('initial-sold-seats', ALL_SOLD_SEATS[roomId]);
      }
    });

    socket.on('lock-seat', ({ roomId, seatId, userId }: { roomId: string, seatId: string, userId: string }) => {
      if (!lockedSeats[roomId]) lockedSeats[roomId] = {};
      if (lockedSeats[roomId][seatId] && lockedSeats[roomId][seatId].userId !== userId) {
        socket.emit('lock-failed', { seatId, message: 'Seat already locked' });
        return;
      }
      lockedSeats[roomId][seatId] = { userId, timestamp: Date.now() };
      io.to(roomId).emit('seat-locked', { seatId, userId });
    });

    socket.on('unlock-seat', ({ roomId, seatId, userId }: { roomId: string, seatId: string, userId: string }) => {
      if (lockedSeats[roomId]?.[seatId]?.userId === userId) {
        delete lockedSeats[roomId][seatId];
        io.to(roomId).emit('seat-unlocked', { seatId });
      }
    });

    socket.on('disconnecting', () => {
      for (const roomId of socket.rooms) {
        if (lockedSeats[roomId]) {
          for (const seatId in lockedSeats[roomId]) {
            if (lockedSeats[roomId][seatId].userId === socket.id) {
              delete lockedSeats[roomId][seatId];
              io.to(roomId).emit('seat-unlocked', { seatId });
            }
          }
        }
      }
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
