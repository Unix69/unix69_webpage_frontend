import React from "react";
import { Box, Container, Grid, Text, Stack, Anchor, Group, Divider, Paper, Image } from "@mantine/core";
import { IconExternalLink, IconDownload } from "@tabler/icons-react";
import profileData from "../data/ProfileData";

// Importa i tuoi file originali
import GitHubLogo from "../logo/GitHubLogo.svg";
import LinkedInLogo from "../logo/LinkedInLogo.svg";
import GmailLogo from "../logo/GmailLogo.png";
import ReactLogo from "../logo/ReactLogo.svg";
import JSLogo from "../logo/JSLogo.svg";
import HTMLLogo from "../logo/HTMLLogo.svg";
import CSSLogo from "../logo/CSSLogo.svg";
import CalLogo from "../logo/Cal.svg";

import i18NLogo from "../logo/i18N.svg";
import MantineLogo from "../logo/Mantine.svg";
import RailwayLogo from "../logo/Railway.svg";
import RedisLogo from "../logo/Redis.svg";

const Footer = () => {
  const year = new Date().getFullYear();
  const { name, role, email, orcid, orcidLink, cvFile, contacts } = profileData;

  const techStack = [
    { name: 'React', logo: ReactLogo },
    { name: 'JavaScript', logo: JSLogo },
    { name: 'HTML5', logo: HTMLLogo },
    { name: 'CSS3', logo: CSSLogo },
    { name: 'Matine CSS', logo: MantineLogo },
    { name: 'Cal.com', logo: CalLogo },
    { name: 'i18N', logo: i18NLogo },
    { name: 'Railway', logo: RailwayLogo },
    { name: 'Redis', logo: RedisLogo }
  ];

  return (
    <Box component="footer" bg="gray.9" c="white" mt={80} pt={60}>
      <Container size="xl">
        <Grid gutter={40} pb={50} pl={80}>
          
          {/* ABOUT */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Stack gap="xs">
              <Text fw={700} size="lg">{name}</Text>
              <Text size="sm" c="gray.4">{role}</Text>
              <Text size="xs" c="gray.5" style={{ lineHeight: 1.6 }}>
                Research engineer focused on intelligent systems, distributed architectures and system-level AI integration.
              </Text>
               {cvFile.map((cv, i) => (
                <Anchor key={i} href={cv.path} download c="blue.4" size="sm" fw={600}>
                  <Group gap={8}><IconDownload size={14}/> Download CV</Group>
                </Anchor>
              ))}
            </Stack>
          </Grid.Col>

          {/* NAVIGATION */}
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Stack gap="xs">
              <Text fw={600} c="gray.5" tt="uppercase" size="xs">Navigation</Text>
              {['Home', 'Profile', 'Projects', 'Resources', 'Contact'].map(link => (
                <Anchor key={link} href={`/${link.toLowerCase()}`} c="gray.3" size="sm">{link}</Anchor>
              ))}

            </Stack>
          </Grid.Col>

          {/* PROFESSIONAL (Con le tue immagini originali) */}
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack gap="xs">
              <Text fw={600} c="gray.5" tt="uppercase" size="xs">Professional</Text>
              <Anchor href={orcidLink} target="_blank" c="gray.3" size="sm">ORCID: {orcid}</Anchor>
              <Anchor href={contacts.github} target="_blank" c="gray.3" size="sm">
                <Group gap={8}><Image src={GitHubLogo} w={16} /> GitHub</Group>
              </Anchor>
              <Anchor href={contacts.linkedin} target="_blank" c="gray.3" size="sm">
                <Group gap={8}><Image src={LinkedInLogo} w={16} /> LinkedIn</Group>
              </Anchor>
              <Anchor href={`mailto:${email}`} c="gray.3" size="sm">
                <Group gap={8}><Image src={GmailLogo} w={16} /> Email</Group>
              </Anchor>
              <br/>

            </Stack>
          </Grid.Col>

          {/* SITE (Con i loghi tech originali) */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Text fw={600} c="gray.5" tt="uppercase" size="xs">Site</Text>
              <Text size="sm" c="gray.3">Powered by</Text>
              <Group gap="xs">
                {techStack.map((tech) => (
                  <Paper key={tech.name} bg="gray.8" px="sm" py={6} radius="sm" withBorder={false}>
                    <Group gap={6}>
                      <Image src={tech.logo} w={16} h={16} />
                      <Text size="xs">{tech.name}</Text>
                    </Group>
                  </Paper>
                ))}
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider color="gray.8" />
        <Stack align="center" py="xl" gap="xs">
          <Text size="xs" c="gray.6" ta="center">
            © {year} {name} — All rights reserved · Turin · Italy
          </Text>
          <Anchor 
                size="xs" 
                c="gray.7" 
                onClick={() => localStorage.removeItem('user-consent') || window.location.reload()}
              >
                Reset Cookies
          </Anchor>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;