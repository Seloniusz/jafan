'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [clicks, setClicks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  // Pobierz początkową liczbę kliknięć
  useEffect(() => {
    const fetchClicks = async () => {
      try {
        const response = await fetch('/api/clicks');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch clicks');
        }

        setClicks(data.clicks);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClicks();
  }, []);

  const handleClick = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      setRateLimitInfo(null);

      const response = await fetch('/api/clicks', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit error
          setRateLimitInfo({
            message: 'Zbyt wiele kliknięć! Spróbuj ponownie za',
            resetIn: data.resetIn
          });
          throw new Error('Rate limit exceeded');
        }
        throw new Error(data.error || 'Failed to update clicks');
      }

      setClicks(data.clicks);
      setHasClicked(true);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-[6rem] font-light tracking-wide
                      bg-gradient-to-r from-white via-white/90 to-white/70
                      bg-clip-text text-transparent
                      drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
          Jesteś fanem?
        </h1>
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-44 h-44">
            <button 
              onClick={handleClick}
              disabled={isUpdating || !!rateLimitInfo}
              className="absolute inset-0
                         transition-all duration-300 ease-in-out
                         hover:scale-105 disabled:hover:scale-100
                         focus:outline-none
                         disabled:opacity-75 disabled:cursor-not-allowed"
              aria-label="Logo Sii"
            >
              {/* Jasnoniebieski kształt (tło) */}
              <div className="absolute top-0 left-0 w-full h-full bg-[#8BB8E8] rounded-full transform translate-x-5" />
              
              {/* Średni niebieski (środkowa warstwa) */}
              <div className="absolute top-0 left-0 w-full h-full bg-[#3C8BD9] rounded-full transform translate-x-2.5" />
              
              {/* Ciemnoniebieski (przód) */}
              <div className="absolute top-0 left-0 w-full h-full bg-[#0046AA] rounded-full" />

              {/* Tekst Sii */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-roboto text-6xl font-bold tracking-tight text-[#F5F5F5] 
                               transform -translate-x-1.5 -rotate-12">
                  S<span className="tracking-tighter">ii</span>
                </span>
              </div>

              {/* Animacja ładowania */}
              {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>

          {/* Status i licznik */}
          <div className="h-16 flex flex-col items-center justify-center">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                <p className="text-white/50">Ładowanie...</p>
              </div>
            ) : error ? (
              <p className="text-red-400 animate-fade-in text-center">{error}</p>
            ) : rateLimitInfo ? (
              <p className="text-yellow-400 animate-fade-in text-center">
                {rateLimitInfo.message} {Math.ceil(rateLimitInfo.resetIn)}s
              </p>
            ) : hasClicked && (
              <p className="text-2xl text-white/75 tracking-wide animate-fade-in">
                mamy już {clicks} {clicks === 1 ? 'fana' : 'fanów'}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 