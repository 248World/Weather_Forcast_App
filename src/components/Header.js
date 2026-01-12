import React from 'react';

const Header = ({ language, toggleLanguage, title, subtitle }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1>
            <i className="fas fa-cloud-sun"></i> {title}
          </h1>
          <p>{subtitle}</p>
        </div>
        
        <div className="header-controls">
          <div className="language-selector">
            <button onClick={toggleLanguage} className="language-btn">
              <span className="language-flag">
                {language === 'en' ? '🇬🇧' : '🇫🇷'}
              </span>
              <span className="language-text">
                {language === 'en' ? 'English' : 'Français'}
              </span>
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;