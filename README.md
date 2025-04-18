# Jafan - Licznik Fanów Sii

Aplikacja webowa do zliczania fanów Sii, zbudowana przy użyciu Next.js i Supabase.

## Funkcje

- Interaktywny przycisk z logo Sii
- Globalny licznik kliknięć
- Animacje i efekty wizualne
- Zabezpieczenia API (rate limiting)
- Responsywny design

## Technologie

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Supabase](https://supabase.com/) - Backend i baza danych
- [Vercel](https://vercel.com/) - Hosting

## Konfiguracja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/twoja-nazwa/jafan.git
cd jafan
```

2. Zainstaluj zależności:
```bash
npm install
# lub
yarn install
```

3. Skopiuj plik `.env.example` do `.env.local` i uzupełnij zmienne środowiskowe:
```bash
NEXT_PUBLIC_SUPABASE_URL=twoj_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_klucz
```

4. Uruchom serwer deweloperski:
```bash
npm run dev
# lub
yarn dev
```

5. Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## Struktura projektu

```
jafan/
├── app/                # Główny kod aplikacji
│   ├── api/           # Endpointy API
│   ├── page.js        # Strona główna
│   └── globals.css    # Globalne style
├── utils/             # Konfiguracja Supabase
├── public/            # Statyczne assety
└── middleware.js      # Middleware (rate limiting)
```

## Zabezpieczenia

- Rate limiting: 5 żądań na minutę na użytkownika
- Weryfikacja referer
- Bezpieczne przechowywanie danych w Supabase

## Licencja

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
