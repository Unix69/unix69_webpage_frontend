import React from 'react';
import GitHubLogo from '../Logo/GitHubLogo.svg';
import TelegramLogo from '../Logo/TelegramLogo.svg';
import GmailLogo from '../Logo/GmailLogo.png';
import './HeaderContactInfo.css';

const HeaderContactInfo = ({
  githubURL = "https://github.com",
  telegramURL = "https://telegram.me/gpdev94",
  gmailURL = "mailto:giuseppe.pedone.developer@gmail.com",
  containerClass = "contact-info",
  labelClass = "contact-label",
  githubInfoClass = "github-info",
  githubLogoClass = "github-logo",
  githubUrlClass = "github-url",
  telegramInfoClass = "telegram-info",
  telegramLogoClass = "telegram-logo",
  gmailInfoClass = "gmail-info",
  gmailLogoClass = "gmail-logo"
}) => {
  return (
    <div className={containerClass}>
      <div className={labelClass}>Contacts</div>

      <div className={telegramInfoClass}>
        <a href={telegramURL} target="_blank" rel="noopener noreferrer">
          <img src={TelegramLogo} alt="Telegram" className={telegramLogoClass}/>
        </a>
      </div>

      <div className={gmailInfoClass}>
        <a href={gmailURL} target="_blank" rel="noopener noreferrer">
          <img src={GmailLogo} alt="Gmail" className={gmailLogoClass}/>
        </a>
      </div>

      <div className={githubInfoClass}>
        <a href={githubURL} className={githubUrlClass} target="_blank" rel="noopener noreferrer">
          <img src={GitHubLogo} alt="GitHub" className={githubLogoClass}/>
        </a>
      </div>
    </div>
  );
};

export default HeaderContactInfo;