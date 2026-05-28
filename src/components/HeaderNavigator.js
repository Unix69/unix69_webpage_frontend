import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import './HeaderNavigator.css';

function HeaderNavigator({
  headerNavigatorClass = "header-navigator",
  headerNavigatorItemClass = "header-navigator-item",
  headerNavigatorLinkClass = "header-navigator-link",
  headerNavigatorDropdownClass = "header-navigator-dropdown"
}) {

  const location = useLocation();
  const navRef = useRef(null);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/profile' },
    {label: 'Activities', href: '#activities', dropdown: [
        {label: 'Lessons',path: '/lessons'}
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

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.path === location.pathname);
    if (index !== -1) {
      setActiveTab(index);
    }
  }, [location.pathname]);

  useEffect(() => {
    if(navRef.current) {
      const tabElements = Array.from(navRef.current.children)
        .filter(el => el.classList.contains(headerNavigatorItemClass));

      const activeLink = tabElements[activeTab];
      if(activeLink){
        setHighlightStyle({
          width: `${activeLink.offsetWidth}px`,
          left: `${activeLink.offsetLeft}px`
        });
      }
    }
  }, [activeTab]);

  // funzione ricorsiva per renderizzare dropdown e sub-dropdown con path
  const renderDropdownItem = (item) => (
    <div
      key={item.label}
      className={`dropdown-item ${item.dropdown ? 'has-submenu' : ''}`}
    >
      {item.path ? (
        <Link to={item.path}>{item.label}</Link>
      ) : (
        <a href={item.href}>{item.label}</a>
      )}

      {item.dropdown && (
        <div className="header-navigator-subdropdown">
          {item.dropdown.map(sub => renderDropdownItem(sub))}
        </div>
      )}
    </div>
  );

  return (
    <nav className={headerNavigatorClass} ref={navRef}>
      <div className="highlight" style={highlightStyle}></div>

      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`${headerNavigatorItemClass} ${activeTab === index ? 'active' : ''}`}
          onClick={() => setActiveTab(index)}
        >
          {tab.path ? (
            <Link to={tab.path} className={headerNavigatorLinkClass}>
              {tab.label}
            </Link>
          ) : (
            <a href={tab.href} className={headerNavigatorLinkClass}>
              {tab.label}
            </a>
          )}

          {tab.dropdown && (
            <div className={headerNavigatorDropdownClass}>
              {tab.dropdown.map(item => renderDropdownItem(item))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default HeaderNavigator;