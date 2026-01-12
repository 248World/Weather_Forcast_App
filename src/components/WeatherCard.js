import React from 'react';

const WeatherCard = ({ day, date, temperature, location, icon, unit, high, low, precipitation, description }) => {
  return (
    <div className="weather-card">
      <div className="card-header">
        <h3>{day}</h3>
        <span className="card-date">{date}</span>
      </div>
      <div className="card-body">
        <div className="card-icon">{icon}</div>
        <div className="card-temp">
          {temperature}°{unit}
        </div>
        <div className="card-description">{description}</div>
      </div>
      <div className="card-footer">
        <div className="card-details">
          <div className="detail-row">
            <span className="detail-label">High:</span>
            <span className="detail-value">{high}°{unit}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Low:</span>
            <span className="detail-value">{low}°{unit}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Rain:</span>
            <span className="detail-value">{precipitation}</span>
          </div>
        </div>
        <div className="card-hover-info">
          <span className="hover-text">Click for details</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;