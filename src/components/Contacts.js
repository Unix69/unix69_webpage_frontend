
// Assicurati che i path delle immagini siano corretti nel tuo progetto
import GitHubLogo from "../logo/GitHubLogo.svg";
import LinkedInLogo from "../logo/LinkedInLogo.svg";
import GmailLogo from "../logo/GmailLogo.png";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Title, 
  Text, 
  Group, 
  Anchor, 
  Image, 
  Stack, 
  Button, 
  Badge, 
  ThemeIcon,
  Divider,
  SimpleGrid
} from '@mantine/core';
import { 
  IconPhone, 
  IconClock, 
  IconCalendarCheck, 
  IconCheck 
} from '@tabler/icons-react';


import profileData from '../data/ProfileData';

export default function Contact() {
  const { t } = useTranslation();
  const { contacts, email, phone } = profileData;

  return (
    <Box bg="gray.0" py={60} style={{ minHeight: 'calc(100vh - 80px)' }}>
      <Container size="lg">
        {/* Intestazione Pagina */}
        <Stack align="center" spacing="xs" mb={50} style={{ textAlign: 'center' }}>
          <Badge color="blue" variant="light" size="lg" radius="sm">{t('contact.badge', 'GET IN TOUCH')}</Badge>
          <Title order={1} size="2.8rem" fw={900} style={{ letterSpacing: '-1px' }}>{t('contact.title', "Let's Connect")}</Title>
          <Text size="lg" c="dimmed" maxW={550}>{t('contact.subtitle', 'Choose the best channel to reach out.')}</Text>
        </Stack>

        <Grid gutter={40} align="stretch">
          {/* COLONNA SINISTRA: INFO CARD */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper p={40} radius="lg" style={{ background: 'linear-gradient(135deg, #1A1B1E 0%, #2C2E33 100%)', color: 'white', height: '100%' }}>
              <Stack spacing={30}>
                <div>
                  <Title order={3} size="1.5rem" fw={700} mb="xs">{t('contact.info_title', 'Contact Information')}</Title>
                </div>

                <Stack spacing="md">
                  {/* Email */}
                  <Anchor href={contacts.gmail} c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                    <Group gap={15}>
                      <Image src={GmailLogo} w={20} h={20} style={{ filter: 'brightness(1.2)' }} />
                      <div>
                        <Text size="xs" c="gray.5" fw={500}>{t('contact.email_label', 'EMAIL ME')}</Text>
                        <Text size="sm" fw={600} c="white">{profileData.email}</Text>
                      </div>
                    </Group>
                  </Anchor>

                  {/* Phone */}
                  <Anchor href={`tel:${profileData.phone.replace(/\s/g, '')}`} c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                    <Group gap={15}>
                      <ThemeIcon size={36} radius="md" color="blue" variant="light">
                        <IconPhone size={18} />
                      </ThemeIcon>
                      <div>
                        <Text size="xs" c="gray.5" fw={500}>{t('contact.phone_label', 'CALL OR WHATSAPP')}</Text>
                        <Text size="sm" fw={600} c="white">{profileData.phone}</Text>
                      </div>
                    </Group>
                  </Anchor>
                </Stack>

                <Divider color="gray.8" />

                {/* Orari */}
                <Stack spacing="sm">
                  <Group gap={10}>
                    <IconClock size={18} style={{ color: '#228be6' }} />
                    <Text size="xs" c="gray.5" fw={700}>{t('contact.hours_title', 'AVAILABILITY')}</Text>
                  </Group>
                  <SimpleGrid cols={2} spacing="xs">
                    <div>
                      <Text size="xs" c="gray.4">Mon - Fri</Text>
                      <Text size="sm" fw={600}>09:00 - 18:30</Text>
                    </div>
                    <div>
                      <Text size="xs" c="gray.4">Saturday</Text>
                      <Text size="sm" fw={600}>09:00 - 13:00</Text>
                    </div>
                  </SimpleGrid>
                </Stack>
              </Stack>

              {/* Social Links */}
              <Stack spacing="xs" mt={40}>
                <Text size="xs" c="gray.5" fw={700}>{t('contact.find_me', 'FIND ME ON')}</Text>
                <Group gap="xl">
                  <Anchor href={contacts.github} target="_blank" c="gray.3" size="sm">
                    <Group gap={8}><Image src={GitHubLogo} w={18} /> GitHub</Group>
                  </Anchor>
                  <Anchor href={contacts.linkedin} target="_blank" c="gray.3" size="sm">
                    <Group gap={8}><Image src={LinkedInLogo} w={18} /> LinkedIn</Group>
                  </Anchor>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* COLONNA DESTRA: BOOKING & RULES */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper p={40} radius="lg" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Stack spacing={35}>
                <Stack spacing="md">
                  <Group gap="md">
                    <ThemeIcon size={44} color="blue" radius="md" variant="light">
                      <IconCalendarCheck size={24} />
                    </ThemeIcon>
                    <div>
                      <Title order={3} size="1.6rem" fw={800}>{t('contact.booking_title', 'Instant Booking')}</Title>
                      <Text size="sm" c="dimmed">{t('contact.booking_desc', 'Schedule a live session.')}</Text>
                    </div>
                  </Group>
                  <Box pl={60}>

                    <Stack spacing="sm" pl={60}>
                      <Group gap="sm">
                        <Button 
                          component={Link} 
                          to="/lessons#booking" 
                          size="md" 
                          color="violet" 
                          radius="md"
                          variant="filled"
                        >
                          {t('contact.book_lesson', 'Book a Lesson')}
                        </Button>
                        
                        <Button 
                          component={Link} 
                          to="/consulting#booking" 
                          size="md" 
                          color="blue" 
                          radius="md"
                          variant="outline"
                        >
                          {t('contact.book_consulting', 'Book Consulting')}
                        </Button>
                      </Group>
                    </Stack>
                  </Box>
                </Stack>

                <Divider />

                <Stack spacing="xs" p="xl" radius="md" bg="gray.0" style={{ borderLeft: '4px solid #228be6' }}>
                  <Title order={4} size="1.1rem" fw={700}>{t('contact.platform_rules_title', 'Open Source')}</Title>
                  <Text size="sm" c="dimmed">{t('contact.platform_rules_desc', 'All content is 100% free.')}</Text>
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}