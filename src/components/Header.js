import React from "react";
import HeaderInfo from "./HeaderInfo";
import HeaderNavigator from "./HeaderNavigator";
import "./Header.css";

function Header({ currentPageName }) {
  return (
    <header>
      <HeaderInfo/>
      <HeaderNavigator
        headerNavigatorClass="header-navigator"
        headerNavigatorItemClass="header-navigator-item"
        headerNavigatorLinkClass="header-navigator-link"
        headerNavigatorDropdownClass="header-navigator-dropdown"
      />
    </header>
  );
}

export default Header;