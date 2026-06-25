import React from 'react';
import { Menu, Group, UnstyledButton, Box, Stack, NavLink } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { 
  IconChevronRight, IconHome, IconUser, IconBooks, IconCode, 
  IconDownload, IconMessage, IconSettings, IconCategory 
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

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

function HeaderNavigator({ tabs = [], isMobile = false, onCloseMobileMenu }) {
  const location = useLocation();
  const { t } = useTranslation();

  // --- RENDERING DESKTOP: I tuoi dropdown Menu standard ---
  const renderDesktopDropdown = (items, currentPath) => {
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
                {t(item.label)}
              </Menu.Item>
            </Menu.Target>
            <Menu.Dropdown bg="blue.9">
              {renderDesktopDropdown(item.dropdown, currentPath)}
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
          {t(item.label)}
        </Menu.Item>
      );
    });
  };

  // --- RENDERING MOBILE: NavLink verticali ricorsivi (Accordion-style) ---
  const renderMobileTabs = (items) => {
    return items.map((item) => {
      const isActive = isTabActive(item, location.pathname);

      if (item.dropdown) {
        return (
          <NavLink
            key={item.label}
            label={t(item.label)}
            leftSection={navIcons[item.label] || null}
            childrenOffset="md"
            defaultOpened={isActive}
            styles={{
              root: { color: isActive ? '#ffeb3b' : 'white', fontWeight: 700 },
              label: { fontSize: '15px' }
            }}
          >
            {renderMobileTabs(item.dropdown)}
          </NavLink>
        );
      }

      return (
        <NavLink
          key={item.label}
          component={item.path ? Link : 'a'}
          to={item.path}
          href={item.href}
          label={t(item.label)}
          leftSection={navIcons[item.label] || null}
          active={isActive}
          onClick={onCloseMobileMenu} // Chiude il drawer laterale quando clicchi su un link finale
          styles={{
            root: {
              color: isActive ? '#ffeb3b' : 'white',
              backgroundColor: isActive ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
              borderLeft: isActive ? '4px solid #ffeb3b' : '4px solid transparent',
              fontWeight: 600
            }
          }}
        />
      );
    });
  };

  // ==========================================
  // RENDER STRUTTURA MOBILE (Laterale/Verticale)
  // ==========================================
  if (isMobile) {
    return (
      <Box component="nav" p="md" style={{ height: '100%' }}>
        <Stack gap={4}>
          {renderMobileTabs(tabs)}
        </Stack>
      </Box>
    );
  }

  // ==========================================
  // RENDER STRUTTURA DESKTOP (Orizzontale)
  // ==========================================
  return (
    <Box 
      component="nav" 
      px="md" 
      visibleFrom="md" // Nasconde l'intero header orizzontale su mobile usando i breakpoint di Mantine
      style={{ background: 'radial-gradient(circle, #1f62ce, #1f76b4)', borderBottom: '2px solid #1f4eb4' }}
    >
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
              {navIcons[tab.label] || null} {t(tab.label)} 
            </UnstyledButton>
          );

          if (tab.dropdown) {
            return (
              <Menu key={tab.label} position="bottom-start" offset={-4} trigger="hover" openDelay={0}>
                <Menu.Target>{tabContent}</Menu.Target>
                <Menu.Dropdown bg="blue.9" style={{ borderRadius: '0 0 8px 8px' }}>
                  {renderDesktopDropdown(tab.dropdown, location.pathname)} 
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

const isTabActive = (tab, currentPath) => {
  if (!currentPath) return false;
  if (tab.path === currentPath) return true;
  if (tab.dropdown) return tab.dropdown.some(child => isTabActive(child, currentPath));
  return false;
};

export default HeaderNavigator;