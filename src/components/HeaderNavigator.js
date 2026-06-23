import React from 'react';
import { Menu, Group, UnstyledButton, Box } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { 
  IconChevronRight, IconHome, IconUser, IconBooks, IconCode, 
  IconDownload, IconMessage, IconSettings, IconCategory 
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next'; // <--- IMPORTANTE

import './HeaderNavigator.css';

const navIcons = {
  'Home': <IconHome size={18} />,
  'Profile': <IconUser size={18} />,
  'Activities': <IconCategory size={18} />,
  'Resources': <IconBooks size={18} />,
  'Learning': <IconCode size={18} />,
  'Downloads': <IconDownload size={18} />,
  'References': <IconSettings size={18} />,
  'Contacts': <IconMessage size={18} />
};

function HeaderNavigator({ tabs = [] }) {
  const location = useLocation();
  const { t } = useTranslation(); // <--- INIZIALIZZA LA TRADUZIONE

  const renderDropdown = (items, currentPath) => {
    if (!items) return null;

    return items.map((item) => {
      const isActive = isTabActive(item, currentPath);

      if (item.dropdown) {
        return (
          <Menu key={item.label} position="right-start" trigger="hover" openDelay={0}>
            <Menu.Target>
              <Menu.Item 
                rightSection={<IconChevronRight size={14} />}
                c="white"
                styles={{ item: { backgroundColor: 'transparent', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' } } }}
              >
                {t(item.label)} {/* <--- TRADUZIONE NEL DROPDOWN */}
              </Menu.Item>
            </Menu.Target>
            <Menu.Dropdown bg="blue.9">
              {renderDropdown(item.dropdown, currentPath)}
            </Menu.Dropdown>
          </Menu>
        );
      }
      
      return (
        <Menu.Item 
          key={item.label} 
          component={item.path ? Link : 'a'} 
          to={item.path} 
          href={item.href}
          c={isActive ? '#ffeb3b' : 'white'}
          classNames={{ item: 'dropdown-item-hover' }}
          styles={{
            item: {
              backgroundColor: isActive ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
              borderLeft: isActive ? '4px solid #ffeb3b' : '4px solid transparent',
              transition: 'background-color 0.2s ease',
            }
          }}
        >
          {t(item.label)} {/* <--- TRADUZIONE NEL DROPDOWN ITEM */}
        </Menu.Item>
      );
    });
  };

  return (
    <Box component="nav" px="md" style={{ background: 'radial-gradient(circle, #1f62ce, #1f76b4)', borderBottom: '2px solid #1f4eb4' }}>
      <Group gap={4}>
        {tabs.map((tab) => {
          const isActive = isTabActive(tab, location.pathname);
          const tabContent = (
            <UnstyledButton 
              px="lg" py="md"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: isActive ? '#ffeb3b' : 'white',
                fontWeight: 700,
                backgroundColor: isActive ? 'rgba(0,0,0,0.3)' : 'transparent',
                borderBottom: isActive ? '2px solid #ffeb3b' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
              styles={{ root: { '&:hover': { backgroundColor: 'rgba(128, 9, 9, 0.2)' } } }}
            >
              {/* Usiamo tab.label per prendere l'icona (chiave inglese), ma t(tab.label) per il testo */}
              {navIcons[tab.label] || null} {t(tab.label)} 
            </UnstyledButton>
          );

          if (tab.dropdown) {
            return (
              <Menu key={tab.label} position="bottom-start" offset={-4} trigger="hover" openDelay={0}>
                <Menu.Target>{tabContent}</Menu.Target>
                <Menu.Dropdown bg="blue.9" style={{ borderRadius: '0 0 8px 8px' }}>
                  {renderDropdown(tab.dropdown, location.pathname)} 
                </Menu.Dropdown>
              </Menu>
            );
          }

          return (
            <Link key={tab.label} to={tab.path} style={{ textDecoration: 'none' }}>
              {tabContent}
            </Link>
          );
        })}
      </Group>
    </Box>
  );
}

// Assicurati che isTabActive sia definita nel file (come l'avevi già)
const isTabActive = (tab, currentPath) => {
  if (!currentPath) return false;
  if (tab.path === currentPath) return true;
  if (tab.dropdown) return tab.dropdown.some(child => isTabActive(child, currentPath));
  return false;
};

export default HeaderNavigator;