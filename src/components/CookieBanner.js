import React from 'react';
import { Affix, Paper, Text, Group, Button, ScrollArea, Title, Stack, Divider } from '@mantine/core';
import { useCookieConsent } from './useCookieConsent';

const CookieBanner = () => {
  const { consent, acceptConsent } = useCookieConsent();

  const handleChoice = (type) => {
    acceptConsent(type);
    // Notifies the Layout that the consent state has changed
    window.dispatchEvent(new CustomEvent('consent-updated', { detail: type }));
  };

  if (consent) return null;

  return (
    <Affix position={{ bottom: 40, right: 40, left: 40 }} style={{ zIndex: 1000 }}>
      <Paper 
        shadow="xl" 
        p="xl" 
        withBorder 
        bg="dark.9" 
        style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          border: '1px solid #333'
        }}
      >
        <Stack gap="md">
          <Title order={3} c="white">Privacy and Cookie Policy</Title>
          
          <ScrollArea h={150} type="scroll" offsetScrollbars>
            <Text size="md" c="gray.3" style={{ lineHeight: 1.7 }}>
              Welcome to my profile. To provide you with an optimal experience, I use technical and analytical cookies. 
              This banner allows you to manage your preferences.
              <br /><br />
              <strong>What we process:</strong> Browsing data, IP address, and session preferences.
              <br /><br />
              Consent is optional and can be revoked at any time via the "Manage cookie preferences" link in the footer.
            </Text>
          </ScrollArea>

          <Divider color="dark.6" />

          <Group justify="flex-end" gap="md" mt="sm">
            <Button variant="subtle" color="gray" onClick={() => handleChoice('refused')}>
              Reject all
            </Button>
            <Button variant="outline" color="gray" onClick={() => handleChoice('essential')}>
              Essential only
            </Button>
            <Button color="blue" onClick={() => handleChoice('all')}>
              Accept all
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Affix>
  );
};

export default CookieBanner;