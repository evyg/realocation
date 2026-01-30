'use client';

import { useState, useEffect, useRef } from 'react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface MapboxFeature {
  id: string;
  place_name: string;
  text: string;
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = 'Search for a city...',
  required = false,
  className = '',
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (query: string) => {
    console.log('[LocationAutocomplete] searchLocations called:', { query, hasToken: !!MAPBOX_TOKEN });
    
    if (!query || query.length < 2) {
      console.log('[LocationAutocomplete] Query too short, clearing suggestions');
      setSuggestions([]);
      return;
    }
    
    if (!MAPBOX_TOKEN) {
      console.error('[LocationAutocomplete] MAPBOX_TOKEN is missing!');
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Build URL manually to avoid encoding commas in types parameter
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&types=place,locality,region&limit=5&language=en`;
      console.log('[LocationAutocomplete] Fetching:', url.substring(0, 100) + '...');
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[LocationAutocomplete] API error:', response.status, errorText);
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('[LocationAutocomplete] API response:', data.features?.length, 'results');
      setSuggestions(data.features || []);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('[LocationAutocomplete] Search error:', error);
      console.error('[LocationAutocomplete] Error details:', {
        name: error instanceof Error ? error.name : 'unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('[LocationAutocomplete] Input changed:', newValue);
    setInputValue(newValue);
    
    // Clear the actual value when user starts typing (forces re-selection)
    if (value && newValue !== value) {
      onChange('');
    }

    // Debounce search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      console.log('[LocationAutocomplete] Debounce fired, searching:', newValue);
      searchLocations(newValue);
    }, 300);
  };

  const handleSelect = (feature: MapboxFeature) => {
    // Format as "City, Country" or "City, State, Country" for US
    const placeName = formatPlaceName(feature);
    setInputValue(placeName);
    onChange(placeName);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const formatPlaceName = (feature: MapboxFeature): string => {
    const city = feature.text;
    const context = feature.context || [];
    
    // Find country
    const country = context.find(c => c.id.startsWith('country'));
    // Find region/state
    const region = context.find(c => c.id.startsWith('region'));
    
    if (country) {
      // For US, include state
      if (country.short_code === 'us' && region) {
        return `${city}, ${region.text}, USA`;
      }
      return `${city}, ${country.text}`;
    }
    
    return feature.place_name;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const isValid = value && value === inputValue;

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className={`${className} ${isValid ? 'pr-10' : ''}`}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-zinc-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
        {isValid && !isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((feature, index) => (
            <li
              key={feature.id}
              onClick={() => handleSelect(feature)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                index === selectedIndex ? 'bg-teal-50' : 'hover:bg-zinc-50'
              }`}
            >
              <span className="text-zinc-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 truncate">{feature.text}</p>
                <p className="text-xs text-zinc-500 truncate">{feature.place_name}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && inputValue.length >= 2 && suggestions.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg p-4 text-center text-sm text-zinc-500">
          No cities found
        </div>
      )}
    </div>
  );
}
