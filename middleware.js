import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Prosta implementacja rate limitingu w pamięci
const rateLimit = {
  windowMs: 60 * 1000, // 1 minuta
  maxRequests: 999, // maksymalna liczba żądań na minutę
  clients: new Map()
};

// Funkcja czyszcząca stare wpisy
const cleanup = () => {
  const now = Date.now();
  for (const [key, data] of rateLimit.clients.entries()) {
    if (now - data.timestamp > rateLimit.windowMs) {
      rateLimit.clients.delete(key);
    }
  }
};

// Uruchom czyszczenie co minutę
setInterval(cleanup, 60 * 1000);

export async function middleware(request) {
  // Sprawdź czy to żądanie do API clicks
  if (request.nextUrl.pathname === '/api/clicks') {
    // Pobierz IP użytkownika
    const ip = request.ip || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const clientId = `${ip}-${userAgent}`;

    // Sprawdź referer
    const referer = request.headers.get('referer');
    if (!referer || !referer.includes(request.headers.get('host'))) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    const now = Date.now();
    const clientData = rateLimit.clients.get(clientId) || { count: 0, timestamp: now };

    // Resetuj licznik jeśli minęło okno czasowe
    if (now - clientData.timestamp > rateLimit.windowMs) {
      clientData.count = 0;
      clientData.timestamp = now;
    }

    // Sprawdź limit żądań
    if (clientData.count >= rateLimit.maxRequests) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests',
          resetIn: Math.ceil((clientData.timestamp + rateLimit.windowMs - now) / 1000)
        }),
        { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((clientData.timestamp + rateLimit.windowMs - now) / 1000)
          }
        }
      );
    }

    // Aktualizuj licznik dla klienta
    clientData.count++;
    rateLimit.clients.set(clientId, clientData);
  }

  return NextResponse.next();
} 