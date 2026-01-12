import React from 'react';

const Forecast = ({ data, unit, convertTemp, selectedDay, onDaySelect, language }) => {
  if (!data || data.length === 0) return null;

  const getIconClass = (icon) => {
    return `fas fa-${icon}`;
  };

  const translations = {
    en: {
      high: "High",
      low: "Low",
      rain: "Rain",
      wind: "Wind",
      currentlyViewing: "Currently viewing"
    },
    fr: {
      high: "Max",
      low: "Min",
      rain: "Pluie",
      wind: "Vent",
      currentlyViewing: "Affichage actuel"
    }
  };

  const t = translations[language];

  const getDayName = (day, shortDay, index) => {
    if (language === 'fr') {
      const daysFr = ['Aujourd\'hui', 'Sam', 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu'];
      return index === 0 ? 'Aujourd\'hui' : daysFr[index] || shortDay;
    }
    return day;
  };

  return (
    <div className="forecast-section">
      <div className="forecast-header">
        <h3 className="section-title">
          <i className="fas fa-calendar-alt"></i> {language === 'en' ? '7-Day Forecast' : 'Prévisions 7 Jours'}
        </h3>
        <p className="forecast-note">
          <i className="fas fa-mouse-pointer"></i> {language === 'en' ? 'Click on a day for details' : 'Cliquez sur un jour pour plus de détails'}
        </p>
      </div>
      
      <div className="forecast-grid">
        {data.map((day, index) => (
          <div 
            key={index} 
            className={`forecast-card ${selectedDay === index ? 'selected' : ''}`}
            onClick={() => onDaySelect(index)}
          >
            <div className="day-header">
              <div className="day-name">{getDayName(day.day, day.shortDay, index)}</div>
              <div className="day-date">{day.date}</div>
            </div>
            
            <div className="forecast-icon">
              <i className={getIconClass(day.icon)}></i>
            </div>
            
            <div className="forecast-temp">
              {convertTemp(day.temp)}°{unit}
            </div>
            
            <div className="forecast-description">
              {day.description}
            </div>
            
            <div className="forecast-details">
              <div className="forecast-detail">
                <span className="forecast-label">{t.high}:</span>
                <span className="forecast-value">{convertTemp(day.high)}°</span>
              </div>
              <div className="forecast-detail">
                <span className="forecast-label">{t.low}:</span>
                <span className="forecast-value">{convertTemp(day.low)}°</span>
              </div>
              <div className="forecast-detail">
                <span className="forecast-label">{t.rain}:</span>
                <span className="forecast-value">{day.precipitation}</span>
              </div>
              <div className="forecast-detail">
                <span className="forecast-label">{t.wind}:</span>
                <span className="forecast-value">{day.wind}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="current-selection">
        {t.currentlyViewing}: <strong>{data[selectedDay]?.day}</strong> - {data[selectedDay]?.description}
      </div>
    </div>
  );
};

export default Forecast;