import React from "react";
import { useState } from "react";

import "./Profile.css";

import profileData from "../data/ProfileData";
import profilePhoto from "../photo/profile_photo.jpg";


import GitHubLogo from "../logo/GitHubLogo.svg";
import TelegramLogo from "../logo/TelegramLogo.svg";
import GmailLogo from "../logo/GmailLogo.png";
import LinkedInLogo from "../logo/LinkedInLogo.svg";

import ProfileTechnologies from './ProfileTechnologies';

import { Card, Image, List,
     Box, Anchor, Badge, Stack, Timeline, Paper, ThemeIcon, Title, Text, Group, 
     Avatar, Button, Divider, Grid } from '@mantine/core';
import { IconBriefcase, IconBuilding, IconFileText, 
  IconExternalLink, IconSchool, IconBrain, IconBook, IconDownload,
  IconBrandGithub, IconMail } from '@tabler/icons-react';


const Profile = () => {

  const {
    name, role, cvFile,
    summary, education, researchInterests,
    workTimeline, companies, publications, contacts
  } = profileData;

  return (
    <div className="profile-container">
      <Group align="flex-start" gap="xl" mb="xl">
        {/* Avatar moderno */}
        <Avatar 
          src={profilePhoto} 
          size={170} 
          radius="md" 
          style={{ border: '1px solid var(--mantine-color-gray-3)' }}
        />

        {/* Info Profilo */}
        <Stack gap="xs">
          <Box>
            <Title order={1} c="blue.7">{name}</Title>
            <Title order={2} size="h3" c="blue.5" fw={500}>{role}</Title>
          </Box>

          {/* ORCID */}
          {profileData.orcid && (
            <Text size="sm" fw={600} c="orange.6">
              ORCID: <Anchor href={profileData.orcidLink} target="_blank" c="blue.7" fz="sm">
                {profileData.orcid} <IconExternalLink size={12} />
              </Anchor>
            </Text>
          )}

          {/* Bottoni CV */}
          <Group gap="sm" mt="sm">
            {cvFile.map((cv, i) => (
              <Button
                key={i}
                component="a"
                href={cv.path}
                download
                leftSection={<IconDownload size={18} />}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              >
                Download {cv.name}
              </Button>
            ))}
          </Group>
        </Stack>
      </Group>

      <Stack gap="xl">
        {/* 1. Professional Summary */}
        <Paper p="xl" withBorder radius="md">
          <Group mb="sm">
            <ThemeIcon color="blue" variant="light" size="lg"><IconBook size={20} /></ThemeIcon>
            <Title order={3}>Professional Summary</Title>
          </Group>
          <Text size="md" c="gray.7" style={{ lineHeight: 1.6 }}>{summary}</Text>
        </Paper>

        {/* 2. Education (Uso della Timeline per un effetto professionale) */}
        <Paper p="xl" withBorder radius="md">
          <Group mb="xl">
            <ThemeIcon color="blue" variant="light" size="lg"><IconSchool size={20} /></ThemeIcon>
            <Title order={3}>Education</Title>
          </Group>
          
          <Timeline active={0} bulletSize={24} lineWidth={2} color="blue">
            {education.map((edu, i) => (
              <Timeline.Item key={i} title={edu.title} bullet={<IconSchool size={12} />}>
                <Text size="sm" c="dimmed">{edu.period}</Text>
                <Text size="sm" fw={500} mb="xs">{edu.institution}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Paper>

        {/* 3. Research Interests (Badge dinamici) */}
        <Paper p="xl" withBorder radius="md">
          <Group mb="md">
            <ThemeIcon color="blue" variant="light" size="lg"><IconBrain size={20} /></ThemeIcon>
            <Title order={3}>Research Interests</Title>
          </Group>
          
          <Group gap="xs">
            {researchInterests.map((r, i) => (
              <Badge key={i} variant="light" size="lg" tt="none" radius="sm" color="blue">
                {r}
              </Badge>
            ))}
          </Group>
        </Paper>
      </Stack>


      <Stack gap="xl">
        {/* 1. Work Experience (Timeline) */}
        <Paper p="xl" withBorder radius="md">
          <Group mb="xl">
            <ThemeIcon color="blue" variant="light" size="lg"><IconBriefcase size={20} /></ThemeIcon>
            <Title order={3}>Work Experience</Title>
          </Group>
          
          <Timeline active={0} bulletSize={20} lineWidth={2} color="blue">
            {workTimeline.map((job, i) => (
              <Timeline.Item key={i} title={job.title} bullet={<IconBriefcase size={12} />}>
                <Text size="sm" c="dimmed">{job.period}</Text>
                <Text size="sm" mt={4}>{job.description}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Paper>

        {/* 2. Companies & Collaborations (Grid di Card) */}
        <Paper p="xl" withBorder radius="md">
          <Group mb="xl">
            <ThemeIcon color="blue" variant="light" size="lg"><IconBuilding size={20} /></ThemeIcon>
            <Title order={3}>Companies & Collaborations</Title>
          </Group>

          <Grid>
            {companies.map((company, i) => (
              <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
                <Card withBorder radius="md" component="a" href={company.link} target="_blank">
                  <Card.Section p="md" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Image src={company.logo} alt={company.name} h={80} w={90} fit="contain" />
                  </Card.Section>
                  <Text fw={600} ta="center">{company.name}</Text>
                  <Text size="xs" c="dimmed" ta="center">{company.role}</Text>
                  <Text size="xs" c="blue" ta="center" mt={4}>{company.period}</Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>

        {/* 3. Publications (List ordinata) */}
        <Paper p="xl" withBorder radius="md">
          <Group mb="md">
            <ThemeIcon color="blue" variant="light" size="lg"><IconFileText size={20} /></ThemeIcon>
            <Title order={3}>Publications</Title>
          </Group>
          <br/>
          <br/>
          <List spacing="md" size="sm" center icon={<ThemeIcon color="blue" size={24} radius="xl"><IconFileText size={14}/></ThemeIcon>}>
            {profileData.publications.map((pub, i) => (
              <List.Item key={i}>
                <Group justify="space-between">
                  <Box>
                    <Text fw={600}>{pub.title}</Text>
                    <Text size="xs" c="dimmed">{pub.venue}</Text>
                  </Box>
                  <Anchor href={pub.file} download size="xs" fw={700}>
                    <Group gap={4}><IconDownload size={14}/> PDF</Group>
                  </Anchor>
                </Group>
              </List.Item>
            ))}
          </List>
        </Paper>
      </Stack>

      <br/>
      <br/>
      <ProfileTechnologies />

      <br/>
      <br/>
      <section>
        <h3>Contacts</h3>
        <div className="contact-container">

          <a href={contacts.linkedin} target="_blank" rel="noopener noreferrer">
            <img src={LinkedInLogo} alt="LinkedIn"/> LinkedIn ↗
          </a>

          <a href={contacts.github} target="_blank" rel="noopener noreferrer">
            <img src={GitHubLogo} alt="GitHub"/> GitHub ↗
          </a>

          <a href={contacts.telegram} target="_blank" rel="noopener noreferrer">
            <img src={TelegramLogo} alt="Telegram"/> Telegram ↗
          </a>

          <a href={contacts.gmail}>
            <img src={GmailLogo} alt="Gmail"/> Gmail ↗
          </a>

        </div>
      </section>

    </div>
  );
};

export default Profile;