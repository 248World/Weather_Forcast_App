import React from 'react';

const CurrentWeather = ({ data, unit, convertTemp, toggleUnit, language }) => {
  if (!data) return null;

  const getWeatherIcon = (description) => {
    const iconMap = {
      'Sunny': 'sun',
      'Partly Cloudy': 'cloud-sun',
      'Cloudy': 'cloud',
      'Rain': 'cloud-rain',
      'Light Rain': 'cloud-rain',
      'Clear': 'sun',
      'Windy': 'wind',
      'Snow': 'snowflake',
      'Foggy': 'smog',
      'Drizzle': 'cloud-rain',
      'Showers': 'cloud-showers-heavy',
      'Mostly Sunny': 'sun',
      'Snow Flurries': 'snowflake',
      'Snow Showers': 'snowflake'
    };
    return iconMap[description] || 'cloud-sun';
  };

  const icon = getWeatherIcon(data.description);

  const translations = {
    en: {
      feelsLike: "Feels like",
      sunrise: "Sunrise",
      sunset: "Sunset",
      uvIndex: "UV Index",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      pressure: "Pressure",
      visibility: "Visibility",
      dewPoint: "Dew Point",
      cloudCover: "Cloud Cover"
    },
    fr: {
      feelsLike: "Ressenti",
      sunrise: "Lever",
      sunset: "Coucher",
      uvIndex: "Indice UV",
      humidity: "Humidité",
      windSpeed: "Vent",
      pressure: "Pression",
      visibility: "Visibilité",
      dewPoint: "Point de rosée",
      cloudCover: "Couverture nuageuse"
    }
  };

  const t = translations[language];

  return (
    <div className="current-weather-card">
      <div className="weather-header">
        <div className="location-info">
          <h2>{data.location}</h2>
          <p className="current-date">
            {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="unit-toggle">
          <button 
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`} 
            onClick={toggleUnit}
          >
            °C
          </button>
          <button 
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`} 
            onClick={toggleUnit}
          >
            °F
          </button>
        </div>
      </div>
      
      <div className="weather-main">
        <div className="temp-section">
          <div className="temp-display">
            <span className="temp-value">{convertTemp(data.temperature)}</span>
            <span className="temp-unit">°{unit}</span>
          </div>
          <p className="feels-like">
            {t.feelsLike} {convertTemp(data.feelsLike)}°{unit}
          </p>
          <div className="condition-display">
            <div className="condition-icon">
              <i className={`fas fa-${icon}`}></i>
            </div>
            <div className="condition-text">{data.description}</div>
          </div>
        </div>
        
        <div className="weather-extra">
          <div className="extra-card">
            <div className="extra-icon">
              <i className="fas fa-sun"></i>
            </div>
            <div className="extra-label">{t.sunrise}</div>
            <div className="extra-value">{data.sunrise}</div>
          </div>
          <div className="extra-card">
            <div className="extra-icon">
              <i className="fas fa-moon"></i>
            </div>
            <div className="extra-label">{t.sunset}</div>
            <div className="extra-value">{data.sunset}</div>
          </div>
          <div className="extra-card">
            <div className="extra-icon">
              <i className="fas fa-temperature-high"></i>
            </div>
            <div className="extra-label">{t.uvIndex}</div>
            <div className="extra-value">{data.uvIndex}</div>
          </div>
        </div>
      </div>
      
      <div className="weather-grid">
        <div className="weather-item">
          <div className="weather-label">{t.humidity}</div>
          <div className="weather-value">{data.humidity}%</div>
        </div>
        <div className="weather-item">
          <div className="weather-label">{t.windSpeed}</div>
          <div className="weather-value">{data.windSpeed} km/h</div>
        </div>
        <div className="weather-item">
          <div className="weather-label">{t.pressure}</div>
          <div className="weather-value">{data.pressure} hPa</div>
        </div>
        <div className="weather-item">
          <div className="weather-label">{t.visibility}</div>
          <div className="weather-value">{data.visibility}</div>
        </div>
        <div className="weather-item">
          <div className="weather-label">{t.dewPoint}</div>
          <div className="weather-value">{convertTemp(data.dewPoint)}°{unit}</div>
        </div>
        <div className="weather-item">
          <div className="weather-label">{t.cloudCover}</div>
          <div className="weather-value">{data.cloudCover}</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;