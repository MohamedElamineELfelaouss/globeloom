import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdvancedInfiniteMenu from '../components/InfiniteMenu/AdvancedInfiniteMenu'
import { countries } from '../services/countryDataServiceNew'
import imageCacheService from '../services/imageCacheService'

const CountriesExplorerPage = () => {
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState([])
  
  useEffect(() => {
    const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;    const fetchWithCache = async (country) => {
      const cacheKey = `unsplash_${country.code || country.name}_${country.iconicQuery ? 'iconic' : 'basic'}`;
      
      // Check cache first
      const cachedResponse = imageCacheService.getCachedApiResponse(cacheKey);
      if (cachedResponse) {
        return {
          id: country.id,
          name: country.name,
          title: country.name,
          description: country.description,
          image: cachedResponse.imageUrl || country.image,
          link: `/explore?country=${encodeURIComponent(country.name)}`,
          country
        };
      }      // If not cached, fetch from API
      const query = encodeURIComponent(country.iconicQuery || country.capital || country.name);
      try {
        console.log(`🌐 Fetching fresh data from Unsplash for: ${country.name} (${country.iconicQuery || country.capital})`);
        const res = await fetch(
          `https://api.unsplash.com/photos/random?query=${query}&count=1`,
          { 
            headers: { Authorization: `Client-ID ${key}` },
            timeout: 8000 // 8 second timeout
          }
        );

        if (!res.ok) {
          throw new Error(`Unsplash API ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const photo = data[0] || {};
        const imageUrl = photo.urls?.regular || country.image;

        // Cache the successful response
        imageCacheService.setCachedApiResponse(cacheKey, {
          imageUrl,
          photoId: photo.id,
          photographer: photo.user?.name
        });

        return {
          id: country.id,
          name: country.name,
          title: country.name,
          description: country.description,
          image: imageUrl,
          link: `/explore?country=${encodeURIComponent(country.name)}`,
          country
        };
      } catch (error) {
        console.warn(`⚠️ Failed to fetch from Unsplash for ${country.name}:`, error.message);
        
        // Return fallback with country's default image
        return {
          id: country.id,
          name: country.name,
          title: country.name,
          description: country.description,
          image: country.image || 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600',
          link: `/explore?country=${encodeURIComponent(country.name)}`,
          country
        };
      }
    };

    const loadCountriesData = async () => {
      console.log('🚀 Loading countries data with caching...');
      
      try {
        // Process countries in batches to avoid overwhelming the API
        const batchSize = 5;
        const results = [];
        
        for (let i = 0; i < countries.length; i += batchSize) {
          const batch = countries.slice(i, i + batchSize);
          const batchPromises = batch.map(fetchWithCache);
          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);
          
          // Small delay between batches to respect rate limits
          if (i + batchSize < countries.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        console.log('✅ Successfully loaded all countries data');
        setMenuItems(results);
        
        // Log cache statistics
        const stats = await imageCacheService.getCacheStats();
        console.log(`📊 Cache Stats - API: ${stats.apiCacheSize}, Images: ${stats.imageCacheSize}/${stats.maxCacheSize}`);
        
      } catch (error) {
        console.error('❌ Error loading countries data:', error);
        
        // Fallback to basic country data
        const fallbackItems = countries.map(country => ({
          id: country.id,
          name: country.name,
          title: country.name,
          description: country.description,
          image: country.image,
          link: `/explore?country=${encodeURIComponent(country.name)}`,
          country
        }));
        
        setMenuItems(fallbackItems);
      }
    };

    loadCountriesData();
  }, [])

  const handleCountrySelect = item => navigate(item.link)

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
      <div className="h-screen w-full">
        <AdvancedInfiniteMenu 
          items={menuItems} 
          onItemSelect={handleCountrySelect}
        />
      </div>
    </div>
  )
}

export default CountriesExplorerPage
