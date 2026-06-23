import React from "react";
import HeaderInfo from "./HeaderInfo";
import HeaderNavigator from "./HeaderNavigator";
import "./Header.css";

const header_navigator_tabs = [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/profile' },
    {label: 'Activities', href: '#activities', dropdown: [
        {label: 'Lessons',path: '/lessons'},
        {label: 'Consulting',path: '/consulting'}
    ]},
    { label: 'Resources', href: '#resources', dropdown: [
      { label: 'Repositories', path: '/repositories' },
      { label: 'Projects', href: '#projects' },
      { label: 'Tools', href: '#repositories' },
      { label: 'Contents', href: '#contents', dropdown: [
        { label: 'Code Snippets', href: '#snippets' },
        { label: 'Guides', href: '#guides' },
        { label: 'Tutorials', href: '#tutorials' },
        { label: 'How To\'s', href: '#howtos' },
        { label: 'Manuals', href: '#manuals' },
        { label: 'Courses', href: '#courses' }
      ]}
    ]},
    { label: 'Learning', href: '#learning', dropdown: [
        { label: 'Languages', path: '/languages' },
        { label: 'Operating Systems', href: '#os_intro' },
        { label: 'Tools', href: '#tools_intro' },
    ]},
    { label: 'Downloads', href: '#downloads' },
    { label: 'References', href: '#references' },
    { label: 'Contacts', href: '#contacts' }
  ];

function Header({ currentPageName }) {
  return (
    <header>
      <HeaderInfo/>
      <HeaderNavigator tabs={header_navigator_tabs}
        headerNavigatorClass="header-navigator"
        headerNavigatorItemClass="header-navigator-item"
        headerNavigatorLinkClass="header-navigator-link"
        headerNavigatorDropdownClass="header-navigator-dropdown"
      />
    </header>
  );
}

export default Header;