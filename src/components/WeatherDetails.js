import React from 'react';

const WeatherDetails = ({ dayData, unit, convertTemp, language }) => {
  if (!dayData) return null;

  const translations = {
    en: {
      temperature: "Temperature",
      highLow: "High • Low",
      precipitation: "Precipitation",
      chanceRain: "Chance of rain",
      wind: "Wind",
      windSpeed: "Wind speed",
      humidity: "Humidity",
      moistureLevel: "Moisture level",
      conditions: "Conditions",
      weatherConditions: "Weather conditions",
      date: "Date",
      details: "Detailed Forecast"
    },
    fr: {
      temperature: "Température",
      highLow: "Max • Min",
      precipitation: "Précipitations",
      chanceRain: "Risque de pluie",
      wind: "Vent",
      windSpeed: "Vitesse du vent",
      humidity: "Humidité",
      moistureLevel: "Niveau d'humidité",
      conditions: "Conditions",
      weatherConditions: "Conditions météo",
      date: "Date",
      details: "Prévisions Détaillées"
    }
  };

  const t = translations[language];

  const details = [
    {
      icon: 'temperature-high',
      title: t.temperature,
      value: `${convertTemp(dayData.temp)}°${unit}`,
      subtext: `${t.highLow}: ${convertTemp(dayData.high)}° • ${convertTemp(dayData.low)}°`
    },
    {
      icon: 'cloud-rain',
      title: t.precipitation,
      value: dayData.precipitation,
      subtext: t.chanceRain
    },
    {
      icon: 'wind',
      title: t.wind,
      value: dayData.wind,
      subtext: t.windSpeed
    },
    {
      icon: 'tint',
      title: t.humidity,
      value: dayData.humidity,
      subtext: t.moistureLevel
    },
    {
      icon: 'cloud',
      title: t.conditions,
      value: dayData.description,
      subtext: t.weatherConditions
    },
    {
      icon: 'calendar-day',
      title: t.date,
      value: dayData.date,
      subtext: dayData.day
    }
  ];

  return (
    <div className="details-section">
      <h3 className="section-title">
        <i className="fas fa-chart-bar"></i> {t.details}
      </h3>
      <div className="details-grid">
        {details.map((detail, index) => (
          <div key={index} className="detail-card">
            <div className="detail-icon">
              <i className={`fas fa-${detail.icon}`}></i>
            </div>
            <div className="detail-content">
              <h4 className="detail-title">{detail.title}</h4>
              <div className="detail-value">{detail.value}</div>
              <div className="detail-subtext">{detail.subtext}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;