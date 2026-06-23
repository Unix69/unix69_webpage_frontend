
import React from 'react';
import PageLogo from '../logo/GnuLinuxLogo.svg';
import HeaderInfoBackgroundImage from '../background/HeaderInfoBackgroundImage.jpg';
import './HeaderInfo.css';
import { Box, Flex, Text, Image, ActionIcon, Menu, Container, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconBrandGithub, IconDownload, IconWorld, IconGitBranch } from '@tabler/icons-react';

import i18n from './i18n';



const HeaderInfo = ({ logo = PageLogo, pageName = "Unix69", githubUrl = "#", lastSync = "15/06/2026", buildVersion = "#8492" }) => {
  const { t, i18n } = useTranslation();

  return (
    <Box py="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', backgroundColor: '#fff' }}>
      <Container size="xl">
        <Flex justify="space-between" align="center">
          
          {/* Left Side: Brand minimal */}
          <Group gap="sm">
            <Image src={logo} w={32} h={32} alt="Logo" />
            <Box>
              <Text fw={700} size="sm" lh={1}>{pageName}</Text>
              <Text size="xs" c="dimmed" lh={1.2}>{t('tagline')}</Text>
            </Box>
          </Group>

          {/* Right Side: Meta & Controls */}
          <Group gap="md">
            {/* Build Info */}
            <Group gap="xs" style={{ display: 'flex', alignItems: 'center' }}>
              <IconGitBranch size={14} color="gray" />
              <Text size="xs" fw={500} c="gray">{buildVersion}</Text>
              <Text size="xs" c="gray">•</Text>
              <Text size="xs" c="gray">{t('last_sync')}: {lastSync}</Text>
            </Group>

            {/* Actions */}
            <Group gap={4}>
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" size="sm">
                    <IconWorld size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => i18n.changeLanguage('en')}>English</Menu.Item>
                  <Menu.Item onClick={() => i18n.changeLanguage('it')}>Italiano</Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <ActionIcon component="a" href={githubUrl} target="_blank" variant="subtle" color="gray" size="sm">
                <IconBrandGithub size={18} />
              </ActionIcon>
            </Group>
          </Group>
          
        </Flex>
      </Container>
    </Box>
  );
};

export default HeaderInfo;

