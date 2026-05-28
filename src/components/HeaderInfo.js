
import React from 'react';
import PageLogo from '../logo/GnuLinuxLogo.svg';
import HeaderInfoBackgroundImage from '../background/HeaderInfoBackgroundImage.jpg';
import './HeaderInfo.css';

const HeaderInfo = ({
  logo = PageLogo,
  url = "www.unix69.githubio.com",
  pageName = "Unix69",
  className = "header-info",
  logoClass = "header-info-logo",
  urlClass = "header-info-url"
}) => {
  return (
    <div className={className} style={{ backgroundImage: `url(${HeaderInfoBackgroundImage})` }}>
      <img src={logo} alt="Logo" className={logoClass}/>
      <a href={url} className={urlClass}>{pageName}</a>
    </div>
  );
};

export default HeaderInfo;