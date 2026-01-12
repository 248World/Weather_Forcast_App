import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import SearchBar from './components/SearchBar';
import WeatherDetails from './components/WeatherDetails';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');
  const [location, setLocation] = useState('Rabat');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);
  const [language, setLanguage] = useState('en');
  const [currentVideo, setCurrentVideo] = useState('');
  const videoRef = useRef(null);

  // Weather video backgrounds based on conditions
  const weatherVideos = {
  sunny: '/videos/sunny.mp4',
  cloudy: '/videos/cloudy.mp4',
  rainy: '/videos/rainy.mp4',
  clear: '/videos/sunny.mp4',
  windy: '/videos/windy.mp4',
  snowy: '/videos/snowy.mp4',
  stormy: '/videos/rainy.mp4',
  foggy: '/videos/cloudy.mp4',
  default: '/videos/sunny.mp4'
}; 

  // Map weather descriptions to video types
  const getVideoForWeather = (description) => {
    const desc = description.toLowerCase();
    
    if (desc.includes('sun') || desc.includes('clear')) return 'sunny';
    if (desc.includes('cloud')) return 'cloudy';
    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) return 'rainy';
    if (desc.includes('wind')) return 'windy';
    if (desc.includes('snow') || desc.includes('flurry')) return 'snowy';
    if (desc.includes('storm') || desc.includes('thunder')) return 'stormy';
    if (desc.includes('fog') || desc.includes('mist')) return 'foggy';
    
    return 'default';
  };

  // Translations
  const translations = {
    en: {
      title: "Weather Forecast",
      subtitle: "Real-time weather forecasts worldwide",
      searchPlaceholder: "Search for any city worldwide...",
      searchTip: "Try cities like 'Monrovia', 'Ifrane', 'Tokyo', or 'New York'",
      quickCities: "Popular Cities",
      todayForecast: "Today's Forecast",
      weekForecast: "7-Day Forecast",
      detailedForecast: "Detailed Forecast",
      currentView: "Currently viewing",
      loading: "Loading weather data...",
      error: "Please enter a valid city name",
      retry: "Try Again",
      cities: ['Rabat', 'Paris', 'Tokyo', 'New York', 'London', 'Dubai', 'Sydney', 'Cairo'],
      searchCity: "Search City"
    },
    fr: {
      title: "Prévisions Météo",
      subtitle: "Prévisions météo en temps réel dans le monde entier",
      searchPlaceholder: "Recherchez une ville dans le monde...",
      searchTip: "Essayez des villes comme 'Monrovia', 'Ifrane', 'Paris' ou 'Tokyo'",
      quickCities: "Villes Populaires",
      todayForecast: "Prévisions d'Aujourd'hui",
      weekForecast: "Prévisions sur 7 Jours",
      detailedForecast: "Prévisions Détaillées",
      currentView: "Affichage actuel",
      loading: "Chargement des données météo...",
      error: "Veuillez entrer un nom de ville valide",
      retry: "Réessayer",
      cities: ['Rabat', 'Paris', 'Tokyo', 'New York', 'Londres', 'Dubaï', 'Sydney', 'Le Caire'],
      searchCity: "Rechercher Ville"
    }
  };

  const t = translations[language];

  // Climate zones by continent/country
  const climateZones = {
    // North Africa (Morocco, Algeria, Tunisia, etc.)
    northAfrica: {
      baseTemp: 24,
      tempRange: { min: 5, max: 45 },
      humidity: { min: 30, max: 70 },
      descriptions: ['Sunny', 'Clear', 'Partly Cloudy', 'Warm', 'Breezy'],
      icons: ['sun', 'sun', 'cloud-sun', 'temperature-high', 'wind']
    },
    // West Africa (Liberia, Ghana, Nigeria, etc.)
    westAfrica: {
      baseTemp: 28,
      tempRange: { min: 20, max: 38 },
      humidity: { min: 60, max: 90 },
      descriptions: ['Humid', 'Partly Cloudy', 'Showers', 'Warm', 'Muggy'],
      icons: ['cloud', 'cloud-sun', 'cloud-rain', 'temperature-high', 'cloud']
    },
    // East Africa (Kenya, Ethiopia, Tanzania, etc.)
    eastAfrica: {
      baseTemp: 25,
      tempRange: { min: 15, max: 35 },
      humidity: { min: 40, max: 80 },
      descriptions: ['Sunny', 'Clear', 'Mild', 'Pleasant', 'Light Breeze'],
      icons: ['sun', 'sun', 'cloud-sun', 'sun', 'wind']
    },
    // Southern Africa (South Africa, Zimbabwe, etc.)
    southernAfrica: {
      baseTemp: 22,
      tempRange: { min: 5, max: 35 },
      humidity: { min: 40, max: 75 },
      descriptions: ['Sunny', 'Clear', 'Partly Cloudy', 'Pleasant', 'Breezy'],
      icons: ['sun', 'sun', 'cloud-sun', 'sun', 'wind']
    },
    // North America (USA, Canada, Mexico)
    northAmerica: {
      baseTemp: 18,
      tempRange: { min: -20, max: 40 },
      humidity: { min: 30, max: 85 },
      descriptions: ['Variable Clouds', 'Clear', 'Partly Cloudy', 'Windy', 'Mild'],
      icons: ['cloud', 'sun', 'cloud-sun', 'wind', 'cloud-sun']
    },
    // South America (Brazil, Argentina, Chile, etc.)
    southAmerica: {
      baseTemp: 25,
      tempRange: { min: 10, max: 40 },
      humidity: { min: 50, max: 90 },
      descriptions: ['Warm', 'Humid', 'Partly Cloudy', 'Showers', 'Mild'],
      icons: ['temperature-high', 'cloud', 'cloud-sun', 'cloud-rain', 'cloud-sun']
    },
    // Western Europe (France, UK, Germany, etc.)
    westernEurope: {
      baseTemp: 14,
      tempRange: { min: -5, max: 30 },
      humidity: { min: 60, max: 90 },
      descriptions: ['Cloudy', 'Light Rain', 'Overcast', 'Drizzle', 'Foggy'],
      icons: ['cloud', 'cloud-rain', 'cloud', 'cloud-rain', 'smog']
    },
    // Eastern Europe (Russia, Poland, Ukraine, etc.)
    easternEurope: {
      baseTemp: 10,
      tempRange: { min: -30, max: 25 },
      humidity: { min: 50, max: 85 },
      descriptions: ['Cold', 'Cloudy', 'Snow Flurries', 'Overcast', 'Brisk'],
      icons: ['temperature-low', 'cloud', 'snowflake', 'cloud', 'wind']
    },
    // Middle East (Saudi Arabia, UAE, Iran, etc.)
    middleEast: {
      baseTemp: 30,
      tempRange: { min: 10, max: 50 },
      humidity: { min: 20, max: 60 },
      descriptions: ['Sunny', 'Hot', 'Clear', 'Dry', 'Breezy'],
      icons: ['sun', 'temperature-high', 'sun', 'sun', 'wind']
    },
    // South Asia (India, Pakistan, Bangladesh, etc.)
    southAsia: {
      baseTemp: 28,
      tempRange: { min: 15, max: 45 },
      humidity: { min: 50, max: 95 },
      descriptions: ['Humid', 'Partly Cloudy', 'Monsoon', 'Hot', 'Muggy'],
      icons: ['cloud', 'cloud-sun', 'cloud-rain', 'temperature-high', 'cloud']
    },
    // East Asia (China, Japan, Korea, etc.)
    eastAsia: {
      baseTemp: 18,
      tempRange: { min: -10, max: 35 },
      humidity: { min: 50, max: 85 },
      descriptions: ['Partly Cloudy', 'Clear', 'Light Rain', 'Mild', 'Humid'],
      icons: ['cloud-sun', 'sun', 'cloud-rain', 'cloud-sun', 'cloud']
    },
    // Southeast Asia (Thailand, Vietnam, Indonesia, etc.)
    southeastAsia: {
      baseTemp: 30,
      tempRange: { min: 25, max: 40 },
      humidity: { min: 70, max: 95 },
      descriptions: ['Hot', 'Humid', 'Thunderstorms', 'Tropical', 'Muggy'],
      icons: ['temperature-high', 'cloud', 'bolt', 'cloud', 'cloud']
    },
    // Australia & Oceania
    australia: {
      baseTemp: 24,
      tempRange: { min: 10, max: 45 },
      humidity: { min: 40, max: 75 },
      descriptions: ['Sunny', 'Clear', 'Warm', 'Pleasant', 'Breezy'],
      icons: ['sun', 'sun', 'temperature-high', 'sun', 'wind']
    }
  };

  // Detect continent/country based on city name or pattern
  const detectClimateZone = (city) => {
    const cityLower = city.toLowerCase();
    
    // North Africa
    if (cityLower.match(/(rabat|casablanca|marrakech|fes|tanger|meknes|oujda|agadir|algiers|tunis|cairo|alexandria|tripoli)/)) {
      return 'northAfrica';
    }
    
    // West Africa
    if (cityLower.match(/(monrovia|freetown|accra|lagos|abidjan|dakar|bamako|conakry|ouagadougou|niamey|lome|porto novo)/)) {
      return 'westAfrica';
    }
    
    // East Africa
    if (cityLower.match(/(nairobi|addis ababa|dar es salaam|kampala|kigali|bujumbura|mogadishu|djibouti|asmera|antananarivo)/)) {
      return 'eastAfrica';
    }
    
    // Southern Africa
    if (cityLower.match(/(johannesburg|cape town|pretoria|durban|harare|lusaka|maputo|windhoek|gaborone|maseru|mbabane)/)) {
      return 'southernAfrica';
    }
    
    // North America
    if (cityLower.match(/(new york|los angeles|chicago|toronto|mexico city|washington|boston|miami|houston|phoenix|philadelphia)/)) {
      return 'northAmerica';
    }
    
    // South America
    if (cityLower.match(/(sao paulo|rio de janeiro|buenos aires|lima|bogota|santiago|caracas|quito|la paz|montevideo|brasilia)/)) {
      return 'southAmerica';
    }
    
    // Western Europe
    if (cityLower.match(/(paris|london|berlin|madrid|rome|amsterdam|brussels|vienna|zurich|dublin|stockholm|oslo|copenhagen)/)) {
      return 'westernEurope';
    }
    
    // Eastern Europe
    if (cityLower.match(/(moscow|warsaw|kiev|bucharest|budapest|prague|sofia|belgrade|minsk|riga|vilnius|tallinn)/)) {
      return 'easternEurope';
    }
    
    // Middle East
    if (cityLower.match(/(dubai|riyadh|tehran|baghdad|doha|abu dhabi|muscat|kuwait|amman|beirut|damascus|sanaa)/)) {
      return 'middleEast';
    }
    
    // South Asia
    if (cityLower.match(/(delhi|mumbai|bangalore|karachi|lahore|dhaka|colombo|kathmandu|thimphu|male|islamabad)/)) {
      return 'southAsia';
    }
    
    // East Asia
    if (cityLower.match(/(tokyo|beijing|shanghai|seoul|taipei|hong kong|macau|pyongyang|ulaanbaatar|shenzhen|guangzhou)/)) {
      return 'eastAsia';
    }
    
    // Southeast Asia
    if (cityLower.match(/(bangkok|jakarta|manila|ho chi minh|hanoi|kuala lumpur|singapore|yangon|phnom penh|vientiane|bandar seri begawan)/)) {
      return 'southeastAsia';
    }
    
    // Australia & Oceania
    if (cityLower.match(/(sydney|melbourne|brisbane|perth|adelaide|auckland|wellington|suva|port moresby|nadi|honolulu)/)) {
      return 'australia';
    }
    
    // Default to Western Europe for unknown cities
    return 'westernEurope';
  };

  // Get season modifier based on hemisphere
  const getSeasonModifier = (city) => {
    const month = new Date().getMonth();
    
    // Northern hemisphere cities (most of the world)
    const northernCities = /(rabat|paris|london|new york|tokyo|beijing|moscow|delhi|dubai|cairo)/i;
    
    // Southern hemisphere cities
    const southernCities = /(sydney|melbourne|auckland|johannesburg|buenos aires|santiago|rio de janeiro)/i;
    
    let seasonMod = 0;
    
    if (northernCities.test(city)) {
      // Northern hemisphere seasons
      if (month >= 11 || month <= 1) seasonMod = -8; // Winter
      else if (month >= 2 && month <= 4) seasonMod = -2; // Spring
      else if (month >= 5 && month <= 7) seasonMod = 5; // Summer
      else seasonMod = 0; // Autumn
    } else if (southernCities.test(city)) {
      // Southern hemisphere seasons (opposite)
      if (month >= 11 || month <= 1) seasonMod = 5; // Summer
      else if (month >= 2 && month <= 4) seasonMod = 0; // Autumn
      else if (month >= 5 && month <= 7) seasonMod = -8; // Winter
      else seasonMod = -2; // Spring
    } else {
      // Default to northern hemisphere pattern
      if (month >= 11 || month <= 1) seasonMod = -8;
      else if (month >= 2 && month <= 4) seasonMod = -2;
      else if (month >= 5 && month <= 7) seasonMod = 5;
      else seasonMod = 0;
    }
    
    return seasonMod;
  };

  // Generate weather description based on climate zone
  const generateWeatherDescription = (climateZone) => {
    const zone = climateZones[climateZone] || climateZones.westernEurope;
    const randomIndex = Math.floor(Math.random() * zone.descriptions.length);
    return {
      description: zone.descriptions[randomIndex],
      icon: zone.icons[randomIndex]
    };
  };

  // Generate temperature based on climate zone and season
  const generateTemperature = (climateZone, city, isDaytime = true) => {
    const zone = climateZones[climateZone] || climateZones.westernEurope;
    const seasonMod = getSeasonModifier(city);
    const timeMod = isDaytime ? 0 : -5;
    const randomMod = Math.random() * 6 - 3; // +/- 3 degrees for variation
    
    let temp = zone.baseTemp + seasonMod + timeMod + randomMod;
    temp = Math.max(zone.tempRange.min, Math.min(zone.tempRange.max, temp));
    
    return Math.round(temp);
  };

  // Generate humidity based on climate zone
  const generateHumidity = (climateZone) => {
    const zone = climateZones[climateZone] || climateZones.westernEurope;
    const humidity = Math.floor(Math.random() * (zone.humidity.max - zone.humidity.min + 1)) + zone.humidity.min;
    return humidity;
  };

  // Generate wind speed based on climate zone
  const generateWindSpeed = (climateZone) => {
    const windSpeeds = {
      northAfrica: { min: 5, max: 25 },
      westAfrica: { min: 8, max: 20 },
      eastAfrica: { min: 5, max: 18 },
      southernAfrica: { min: 8, max: 25 },
      northAmerica: { min: 10, max: 35 },
      southAmerica: { min: 5, max: 25 },
      westernEurope: { min: 12, max: 30 },
      easternEurope: { min: 8, max: 25 },
      middleEast: { min: 5, max: 20 },
      southAsia: { min: 8, max: 22 },
      eastAsia: { min: 10, max: 28 },
      southeastAsia: { min: 5, max: 18 },
      australia: { min: 10, max: 30 }
    };
    
    const range = windSpeeds[climateZone] || windSpeeds.westernEurope;
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  };

  // Generate current weather for any city
  const generateCurrentWeather = (city) => {
    const climateZone = detectClimateZone(city);
    const isDaytime = new Date().getHours() >= 6 && new Date().getHours() <= 20;
    
    const { description, icon } = generateWeatherDescription(climateZone);
    const temp = generateTemperature(climateZone, city, isDaytime);
    const humidity = generateHumidity(climateZone);
    const windSpeed = generateWindSpeed(climateZone);
    
    // Format sunrise/sunset based on language
    const sunriseHour = isDaytime ? 6 : 7;
    const sunsetHour = isDaytime ? 18 : 19;
    
    const sunriseTime = language === 'en' 
      ? `${sunriseHour}:${Math.floor(Math.random() * 30) + 15} AM`
      : `${sunriseHour}:${Math.floor(Math.random() * 30) + 15}`;
    
    const sunsetTime = language === 'en' 
      ? `${sunsetHour}:${Math.floor(Math.random() * 30) + 15} PM`
      : `${sunsetHour}:${Math.floor(Math.random() * 30) + 15}`;
    
    return {
      location: city,
      temperature: temp,
      feelsLike: temp - Math.floor(Math.random() * 4),
      humidity: humidity,
      windSpeed: windSpeed,
      pressure: 1013 + Math.floor(Math.random() * 30) - 15,
      description: description,
      sunrise: sunriseTime,
      sunset: sunsetTime,
      uvIndex: Math.floor(Math.random() * 11) + 1,
      visibility: `${Math.floor(Math.random() * 20) + 5} km`,
      cloudCover: `${Math.floor(Math.random() * 100)}%`,
      weatherIcon: icon,
      isDaytime: isDaytime
    };
  };

  // Generate 7-day forecast
  const generateForecast = (city) => {
    const climateZone = detectClimateZone(city);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const dayNames = language === 'en' 
        ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        : ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      
      const shortDayNames = language === 'en'
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      
      const dayName = i === 0 
        ? (language === 'en' ? 'Today' : "Aujourd'hui")
        : dayNames[date.getDay()];
      
      const shortDayName = i === 0
        ? (language === 'en' ? 'Today' : "Auj")
        : shortDayNames[date.getDay()];
      
      const { description, icon } = generateWeatherDescription(climateZone);
      const baseTemp = generateTemperature(climateZone, city, true);
      const highTemp = baseTemp + Math.floor(Math.random() * 6) + 2;
      const lowTemp = baseTemp - Math.floor(Math.random() * 6) - 2;
      
      days.push({
        day: dayName,
        shortDay: shortDayName,
        date: date.toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { 
          month: 'short', 
          day: 'numeric' 
        }),
        temp: Math.round((highTemp + lowTemp) / 2),
        high: highTemp,
        low: lowTemp,
        icon: icon,
        description: description,
        precipitation: `${Math.floor(Math.random() * 70)}%`,
        wind: `${generateWindSpeed(climateZone)} km/h`,
        humidity: `${generateHumidity(climateZone)}%`
      });
    }
    
    return days;
  };

  // Generate hourly forecast
  const generateHourlyForecast = (city) => {
    const climateZone = detectClimateZone(city);
    const hours = [];
    const currentHour = new Date().getHours();
    
    for (let i = 0; i < 10; i++) {
      const hourTime = (currentHour + i) % 24;
      const isDaytime = hourTime >= 6 && hourTime <= 20;
      
      let displayTime;
      if (i === 0) {
        displayTime = language === 'en' ? 'Now' : 'Maintenant';
      } else {
        displayTime = language === 'en' 
          ? `${hourTime % 12 || 12}${hourTime < 12 ? 'AM' : 'PM'}`
          : `${hourTime}h`;
      }
      
      const temp = generateTemperature(climateZone, city, isDaytime);
      const { icon } = generateWeatherDescription(climateZone);
      const precipChance = Math.random() > 0.6 ? Math.floor(Math.random() * 50) + 10 : 0;
      
      hours.push({
        time: displayTime,
        temp: temp,
        icon: icon,
        precipitation: `${precipChance}%`
      });
    }
    
    return hours;
  };

  // Load weather data for any city
  const loadWeatherData = (city = location) => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        // Format city name
        const formattedCity = city
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        // Validate city name
        if (!formattedCity.trim() || formattedCity.length < 2) {
          throw new Error(t.error);
        }
        
        const current = generateCurrentWeather(formattedCity);
        const forecast = generateForecast(formattedCity);
        const hourly = generateHourlyForecast(formattedCity);
        
        // Update video based on weather
        const videoType = getVideoForWeather(current.description);
        setCurrentVideo(weatherVideos[videoType] || weatherVideos.default);
        
        setWeatherData(current);
        setForecastData(forecast);
        setHourlyForecast(hourly);
        setLocation(formattedCity);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  // Load initial weather data
  useEffect(() => {
    loadWeatherData();
    
    // Set initial video
    setCurrentVideo(weatherVideos.sunny);
  }, []);

  // Restart video when it ends
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleEnded = () => {
        video.currentTime = 0;
        video.play();
      };
      
      video.addEventListener('ended', handleEnded);
      
      return () => {
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentVideo]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadWeatherData(searchQuery);
      setSearchQuery('');
    }
  };

  const handleCityClick = (city) => {
    loadWeatherData(city);
  };

  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  const convertTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9/5) + 32);
    }
    return tempC;
  };

  const handleDaySelect = (index) => {
    setSelectedDay(index);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  // Add popular African cities
  const popularAfricanCities = [
    'Monrovia', 'Ifrane', 'Accra', 'Lagos', 'Nairobi', 
    'Johannesburg', 'Cairo', 'Casablanca', 'Marrakech', 'Fes'
  ];

  return (
    <div className="App">
      {/* Video Background */}
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="background-video"
          key={currentVideo}
        >
          <source src={currentVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>
      
      <Header 
        language={language}
        toggleLanguage={toggleLanguage}
        title={t.title}
        subtitle={t.subtitle}
      />
      
      <main className="main-container">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          placeholder={t.searchPlaceholder}
          tip={t.searchTip}
        />
        
        {error && (
          <div className="error-card">
            <p>{error}</p>
            <button onClick={() => loadWeatherData('Rabat')} className="retry-btn">
              <i className="fas fa-redo"></i> {t.retry}
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t.loading}</p>
          </div>
        ) : (
          <>
            <div className="quick-cities">
              <h3 className="section-title">
                <i className="fas fa-map-marker-alt"></i> {t.quickCities}
              </h3>
              <div className="city-buttons">
                {t.cities.map((city) => (
                  <button
                    key={city}
                    className={`city-btn ${location === city ? 'active' : ''}`}
                    onClick={() => handleCityClick(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
              
              <div className="more-cities">
                <p>{language === 'en' ? 'African Cities:' : 'Villes Africaines:'}</p>
                {popularAfricanCities.map((city) => (
                  <button
                    key={city}
                    className={`extra-city-btn ${location === city ? 'active' : ''}`}
                    onClick={() => handleCityClick(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
            
            {weatherData && (
              <CurrentWeather 
                data={weatherData} 
                unit={unit}
                convertTemp={convertTemp}
                toggleUnit={toggleUnit}
                language={language}
              />
            )}
            
            {hourlyForecast && hourlyForecast.length > 0 && (
              <div className="hourly-section">
                <h3 className="section-title">
                  <i className="fas fa-clock"></i> {t.todayForecast}
                </h3>
                <div className="hourly-scroll">
                  {hourlyForecast.map((hour, index) => (
                    <div key={index} className="hour-card">
                      <div className="hour-time">{hour.time}</div>
                      <div className="hour-icon">
                        <i className={`fas fa-${hour.icon}`}></i>
                      </div>
                      <div className="hour-temp">{convertTemp(hour.temp)}°{unit}</div>
                      <div className="hour-precip">{hour.precipitation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {forecastData && (
              <Forecast 
                data={forecastData} 
                unit={unit}
                convertTemp={convertTemp}
                selectedDay={selectedDay}
                onDaySelect={handleDaySelect}
                language={language}
              />
            )}
            
            {forecastData && forecastData[selectedDay] && (
              <WeatherDetails 
                dayData={forecastData[selectedDay]}
                unit={unit}
                convertTemp={convertTemp}
                language={language}
              />
            )}
          </>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Global Weather Forecast • Works Worldwide • Made with React</p>
      </footer>
    </div>
  );
}

export default App;