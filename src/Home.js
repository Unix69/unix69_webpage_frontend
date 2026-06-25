import React, { useMemo, useState } from "react";
import { 
  Container, Title, Text, Button, SimpleGrid, Card, Group,Grid, 
  List, Stack, useMantineTheme, ThemeIcon, Box, Divider, Badge, Tooltip, Paper
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom'; // <-- Aggiunto useNavigate
import { 
  IconBrandGithub, IconBook, IconBuildingFactory2, IconCode, 
  IconArrowRight, IconCalendarEvent, IconBriefcase, IconFolder, 
  IconSchool, IconCpu,  IconCoin,
  IconClock, IconTools, IconWallet, IconDeviceLaptop,
  IconLayersIntersect, IconInfoCircle, IconDownload, IconTerminal, IconBooks,
  IconCreditCard,
  IconCheck
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import * as TablerIcons from "@tabler/icons-react"; // Importiamo tutto come oggetto per risolvere le icone dinamiche


// Importazione di tutte le strutture dati analitiche dal modulo Consulting
import { 
  buisness_service_info,
  buisness_domains_info,
  application_domains_info,
  job_categories_info,
  models_info,
  payment_info,
  slots_info
} from "./components/Consulting"; 

import { 
  ALLOWED_BOOK_FORM_VALUES,
  pricing,
  subjects as staticSubjectsList // Fallback array to ensure subjects never go missing
} from "./components/Lessons"; 


interface ConsultingHomeSectionProps {
  onNavigateToConsulting: () => void;
}
export function ConsultingHomeSection({ onNavigateToConsulting }: ConsultingHomeSectionProps) {

  // 1. Estrazione Job Categories dalla proprietà .items reale
  const jobCategories = useMemo(() => {
    if (!job_categories_info || !job_categories_info.items) return [];
    return job_categories_info.items.map((item) => ({
      id: item.name,
      label: item.name,
      description: item.desc || "Professional engineering services.",
      icon: "IconTools"
    }));
  }, []);

  // 2. Estrazione Application Domains dalla proprietà .items reale
  const applicationDomains = useMemo(() => {
    if (!application_domains_info || !application_domains_info.items) return [];
    return application_domains_info.items.map((item) => ({
      id: item.name,
      label: item.name,
      description: item.desc || "Technical infrastructure solutions."
    }));
  }, []);

  // 3. Estrazione Business Domains dalla proprietà .items reale
  const businessDomains = useMemo(() => {
    if (!buisness_domains_info || !buisness_domains_info.items) return [];
    return buisness_domains_info.items.map((item) => ({
      id: item.name,
      label: item.name,
      description: item.desc || "Strategic engineering solutions."
    }));
  }, []);

  // 4. Mappatura Business Services basata sull'oggetto reale (chiave -> valore con hourlyRate, description, deliverables)
  const businessServices = useMemo(() => {
    if (!buisness_service_info) return [];
    return Object.entries(buisness_service_info).map(([key, value]) => {
      // Estraiamo i valori dall'oggetto deliverables e li trasformiamo in array
      const deliverablesList = value.deliverables ? Object.values(value.deliverables) : [];
      return {
        id: key,
        title: key,
        rate: value.hourlyRate || 0,
        description: value.description || "",
        deliverables: deliverablesList
      };
    });
  }, []);

  // 5. Mappatura Modelli di Sviluppo/Architettura (Navighiamo l'array models_info -> items)
  const structuralModels = useMemo(() => {
    if (!models_info) return [];
    // Raggruppiamo o linearizziamo tutti i sotto-modelli per mostrarli nel riquadro finanziario/architetturale
    return models_info.flatMap((categoryBlock) => {
      return categoryBlock.items.map((item) => ({
        category: categoryBlock.category,
        name: item.name,
        description: item.desc || "",
        complexity: item.complexity || item.speed || "Standard",
        // Gestiamo attributi dinamici diversi a seconda del modello (automation, scalability, persistence...)
        extraLabel: item.automation ? "Automation" : item.scalability ? "Scalability" : item.persistence ? "Persistence" : "Security",
        extraValue: item.automation || item.scalability || item.persistence || item.securityLevel || "N/A"
      }));
    });
  }, []);

  // 6. Estrazione delle Informazioni di Pagamento dall'oggetto reale
  const paymentDetails = useMemo(() => {
    if (!payment_info) return null;
    return {
      depositRequired: payment_info.depositRequired,
      depositText: payment_info.depositPercentage ? `${payment_info.depositPercentage * 100}% upfront deposit required` : "Deposit required",
      notes: payment_info.note || []
    };
  }, []);

  // 7. Estrazione dei Prezzi degli Slot Orari prefissati
  const consultingSlots = useMemo(() => {
    if (!slots_info) return [];
    return Object.entries(slots_info).map(([key, value]) => ({
      key,
      label: value.label,
      price: value.price
    }));
  }, []);

  return (
    <Box py="xl" style={{ gridColumn: 'span 2' }}>
      <Stack gap="lg">
        
        {/* HEADER DI SEZIONE */}
        <div style={{ textAlign: 'center', marginBottom: '5px' }}>
          <Badge color="teal" variant="filled" size="lg" radius="sm" mb="xs">
            B2B & Enterprise Services
          </Badge>
          <Title order={2} size="2.2rem" fw={900} style={{ letterSpacing: '-0.5px' }}>
            Industrial Consulting & System Architecture
          </Title>
          <Text size="md" c="dimmed" maxW={750} mx="auto" mt="xs">
            High-integrity software development, custom hardware interaction layer architectures, and technical advisory for critical industrial applications.
          </Text>
        </div>

        {/* SEZIONE 1: TECHNICAL INTERACTION & CAPABILITIES */}
        <Card withBorder radius="lg" p="xl" shadow="md">
          <Group justify="space-between" mb="md">
            <Group gap="sm">
              <ThemeIcon color="teal" size="lg" radius="md">
                <IconCpu size={20} />
              </ThemeIcon>
              <div>
                <Title order={3} fw={800}>{application_domains_info?.title || "Target Domains & Job Operations"}</Title>
                <Text size="xs" c="dimmed">{application_domains_info?.intro || "System engineering tasks and technical alignment fields."}</Text>
              </div>
            </Group>
          </Group>

          {/* Application Domains */}
          <Divider my="sm" label="Technical Application Domains" labelPosition="left" />
          <Group gap="xs" mb="lg">
            {applicationDomains.map((domain) => (
              <Tooltip key={domain.id} label={domain.description} withArrow position="top" maxWidth={300}>
                <Badge variant="outline" color="teal" size="sm" radius="md" p="md" style={{ cursor: 'help' }}>
                  {domain.label}
                </Badge>
              </Tooltip>
            ))}
          </Group>

          {/* Job Categories */}
          <Divider my="sm" label={job_categories_info?.title || "Operational Engagements & Deliverables"} labelPosition="left" />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="xs">
            {jobCategories.map((category) => {
              const IconComponent = TablerIcons[category.icon] || IconTools;
              return (
                <Paper key={category.id} withBorder p="sm" radius="md" bg="var(--mantine-color-gray-0)">
                  <Group align="flex-start" gap="sm">
                    <ThemeIcon color="teal" size="sm" radius="xl" mt={2}>
                      <IconComponent size={12} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text size="xs" fw={700} c="gray.9">{category.label}</Text>
                      <Text size="xs" c="dimmed" mt={2}>{category.description}</Text>
                    </div>
                  </Group>
                </Paper>
              );
            })}
          </SimpleGrid>
        </Card>

        {/* SEZIONE 2: CORPORATE ARCHITECTURE & SERVICE LINES (Con descrizioni, hourlyRate e deliverables corretti) */}
        <Card withBorder radius="lg" p="xl" shadow="md">
          <Group justify="space-between" mb="md">
            <Group gap="sm">
              <ThemeIcon color="cyan" size="lg" radius="md">
                <IconBuildingFactory2 size={20} />
              </ThemeIcon>
              <div>
                <Title order={3} fw={800}>{buisness_domains_info?.title || "Business Architecture & Vertical Markets"}</Title>
                <Text size="xs" c="dimmed">{buisness_domains_info?.intro || "Strategic lifecycles and business integration frameworks."}</Text>
              </div>
            </Group>
          </Group>

          {/* Business Domains */}
          <Divider my="sm" label="Target Industries" labelPosition="left" />
          <Group gap="xs" mb="lg">
            {businessDomains.map((biz) => (
              <Tooltip key={biz.id} label={biz.description} withArrow maxWidth={250}>
                <Badge variant="light" color="cyan" size="sm" radius="sm" p="sm" style={{ cursor: 'pointer' }}>
                  {biz.label}
                </Badge>
              </Tooltip>
            ))}
          </Group>

          {/* Business Services mappati correttamente sulle tue chiavi reali */}
          <Divider my="sm" label="Active Service Specifications & Hourly Rates" labelPosition="left" />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mt="xs">
            {businessServices.map((service) => (
              <Card key={service.id} withBorder radius="md" p="md" bg="white" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Group justify="space-between" align="center" mb="xs">
                    <Text size="sm" fw={800} c="cyan.9">{service.title}</Text>
                    <Badge color="cyan" variant="filled">€{service.rate}/hr</Badge>
                  </Group>
                  <Text size="xs" c="gray.7" italic mb="sm">
                    {service.description}
                  </Text>
                  
                  {service.deliverables && service.deliverables.length > 0 && (
                    <Box mt="xs">
                      <Text size="11px" fw={700} c="gray.6" mb={4}>Engineered Deliverables:</Text>
                      <List size="xs" spacing={3} icon={<IconCheck size={10} color="var(--mantine-color-cyan-6)" />}>
                        {service.deliverables.map((deliv, index) => (
                          <List.Item key={index}>
                            <Text size="11px" c="gray.8" fw={500}>{deliv}</Text>
                          </List.Item>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        </Card>

        {/* SEZIONE 3: FIXED ADVISORY SLOTS, STRUCTURAL MODELS & POLICIES */}
        <Card withBorder radius="lg" p="xl" bg="gray.0" shadow="xs">
          <Stack gap="md">
            <Group gap="md">
              <ThemeIcon color="blue" size="xl" radius="md" variant="light">
                <IconLayersIntersect size={22} />
              </ThemeIcon>
              <div>
                <Text size="md" fw={800} c="gray.9">Verified Engagement Architecture & Financial Framework</Text>
                <Text size="xs" c="dimmed">Predictable compliance standards, flat-rate advisory brackets, and system design models.</Text>
              </div>
            </Group>

            {/* Flat Rate Brackets (slots_info) */}
            {consultingSlots.length > 0 && (
              <Box mt="xs">
                <Text size="xs" fw={700} c="gray.7" uppercase mb="xs">Advisory Consultation Brackets</Text>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
                  {consultingSlots.map((slot) => (
                    <Paper key={slot.key} withBorder p="sm" radius="md" bg="white" style={{ textAlign: 'center' }}>
                      <Text size="xs" fw={700} c="gray.8">{slot.label}</Text>
                      <Title order={3} c="blue.7" mt={4}>€{slot.price}</Title>
                    </Paper>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            <Grid gutter="xl" mt="xs">
              {/* Box Modelli: Mappatura atomica di tutti gli items estratti da models_info */}
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Text size="xs" fw={700} c="gray.7" uppercase mb="xs">Architectural & Operational Sub-Models</Text>
                <Box style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                    {structuralModels.map((model, idx) => (
                      <Paper key={idx} withBorder p="xs" radius="md" bg="white">
                        <Group justify="space-between" align="flex-start" wrap="nowrap">
                          <Box>
                            <Badge size="9px" variant="light" color="teal" mb={2}>{model.category}</Badge>
                            <Text size="xs" fw={800} c="gray.9">{model.name}</Text>
                            <Text size="10px" c="dimmed" mt={2}>
                              {model.description}
                            </Text>
                          </Box>
                        </Group>
                        <Group justify="space-between" mt="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-1)', paddingTop: '4px' }}>
                          <Text size="9px" c="dimmed">Comp: <strong>{model.complexity}</strong></Text>
                          <Text size="9px" c="dimmed">{model.extraLabel}: <strong>{model.extraValue}</strong></Text>
                        </Group>
                      </Paper>
                    ))}
                  </SimpleGrid>
                </Box>
              </Grid.Col>

              {/* Box Politiche di Pagamento Totali (payment_info) */}
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Box style={{ height: '100%', borderLeft: '1px solid var(--mantine-color-gray-3)' }} pl={{ md: 'xl' }}>
                  <Text size="xs" fw={700} c="gray.7" uppercase mb="xs">B2B Compliance Policies</Text>
                  
                  {paymentDetails && (
                    <Stack gap="sm">
                      {paymentDetails.depositRequired && (
                        <Paper withBorder p="sm" radius="md" bg="blue.0" style={{ borderColor: 'var(--mantine-color-blue-3)' }}>
                          <Group gap={6}>
                            <IconInfoCircle size={14} color="var(--mantine-color-blue-6)" />
                            <Text size="xs" fw={700} c="blue.9">Escrow & Milestone Policy</Text>
                          </Group>
                          <Text size="xs" c="blue.8" fw={500} mt={2}>
                            {paymentDetails.depositText}
                          </Text>
                        </Paper>
                      )}

                      <Paper withBorder p="sm" radius="md" bg="white">
                        <Group gap={6} mb="xs">
                          <IconCreditCard size={14} color="var(--mantine-color-gray-7)" />
                          <Text size="xs" fw={700} c="gray.8">Contractual Clauses & Notes</Text>
                        </Group>
                        <List size="xs" spacing={4} icon={<IconCheck size={10} color="var(--mantine-color-blue-5)" />}>
                          {paymentDetails.notes.map((note, index) => (
                            <List.Item key={index}>
                              <Text size="11px" c="gray.7">{note}</Text>
                            </List.Item>
                          ))}
                        </List>
                      </Paper>
                    </Stack>
                  )}
                </Box>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* TRIGGER DI NAVIGAZIONE FINALE */}
        <Button 
          variant="filled" 
          color="teal" 
          size="md"
          mt="sm"
          rightSection={<IconArrowRight size={18} />}
          onClick={onNavigateToConsulting}
          fullWidth
        >
          Open Interactive Consulting Explorer & Booking Engine
        </Button>

      </Stack>
    </Box>
  );
}



interface LessonsHomeSectionProps {
  lessonsTree: any;
  onNavigateToLessons: () => void;
  onNavigateToLessonsMaterials: () => void;
  onNavigateToRepositories: () => void;
  onNavigateToLanguages?: () => void; // Route to languages.js view
}

export function LessonsHomeSection({ lessonsTree, onNavigateToLessons, onNavigateToLessonsMaterials, onNavigateToRepositories, onNavigateToLanguages }: LessonsHomeSectionProps) {
  const { t } = useTranslation();

  // 1. Dynamic mapping of lesson modalities from the real system whitelist
  const lessonModalities = useMemo(() => {
    if (!ALLOWED_BOOK_FORM_VALUES || !ALLOWED_BOOK_FORM_VALUES.type) return [];
    return ALLOWED_BOOK_FORM_VALUES.type.map((typeString) => ({
      id: typeString,
      label: typeString,
      description: `Targeted sessions optimized for ${typeString.toLowerCase()}.`,
      icon: "IconDeviceLaptop"
    }));
  }, []);

  // 2. SUBJECTS RESOLUTION: Parse filesystem tree with an immediate static fallback
  const activeSubjects = useMemo(() => {
    if (lessonsTree && lessonsTree.children && lessonsTree.children.length > 0) {
      return lessonsTree.children.map((child: any) => {
        const countFiles = (node: any): number => {
          if (node.type === "file") return 1;
          if (node.children) return node.children.reduce((acc: number, c: any) => acc + countFiles(c), 0);
          return 0;
        };
        return {
          id: child.name,
          label: child.name,
          fileCount: countFiles(child),
          description: `Academic filesystem repository for ${child.name}.`
        };
      });
    }
    // Static fallback ensures subjects display even if the tree state hasn't resolved yet
    if (staticSubjectsList && staticSubjectsList.length > 0) {
      return staticSubjectsList.map((subj) => ({
        id: subj,
        label: subj,
        fileCount: 0,
        description: `Verified course syllabus for ${subj}.`
      }));
    }
    return [];
  }, [lessonsTree]);

  // 3. Extract financial pricing structures
  const educationalPackages = useMemo(() => {
    if (!pricing) return [];
    return pricing.map((pack) => ({
      title: pack.title,
      price: pack.price,
      description: pack.description
    }));
  }, []);

  // 4. Reservation terms and metadata structures
  const paymentPolicies = useMemo(() => {
    if (!ALLOWED_BOOK_FORM_VALUES) return null;
    return {
      allowedMethods: ALLOWED_BOOK_FORM_VALUES.payment || ['pay-now', 'pay-later'],
      durations: ALLOWED_BOOK_FORM_VALUES.duration || ['1h', '2h'],
      clauses: [
        "Flexible digital scheduling driven by verified Cal.com workflows",
        "Source code and markdown manuals included in every session archive",
        "Automated booking management via external secure webhooks",
        "Cancellation or rescheduling permitted within server policy terms"
      ]
    };
  }, []);

  return (
    <Box py="xl" style={{ gridColumn: 'span 2' }}>
      <Stack gap="lg">
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '5px' }}>
          <Badge color="indigo" variant="filled" size="lg" radius="sm" mb="xs">
            Academic Training & Mentorship
          </Badge>
          <Title order={2} size="2.2rem" fw={900} style={{ letterSpacing: '-0.5px' }}>
            Structured Engineering Lessons & Syllabi
          </Title>
          <Text size="md" c="dimmed" maxW={750} mx="auto" mt="xs">
            Move progressively from low-level debugging to systems architecture. High-integrity mentorship backed by automated code repositories and live sandboxes.
          </Text>
        </div>

        {/* SECTION 1: AVAILABLE TRAINING METHODS & MODALITIES */}
        <Card withBorder radius="lg" p="xl" shadow="md">
          <Group justify="space-between" mb="md">
            <Group gap="sm">
              <ThemeIcon color="indigo" size="lg" radius="md">
                <IconSchool size={20} />
              </ThemeIcon>
              <div>
                <Title order={3} fw={800}>Didactic Mentorship Frameworks</Title>
                <Text size="xs" c="dimmed">Tailored delivery pipelines for university courses, exams, and source development.</Text>
              </div>
            </Group>
          </Group>

          {/* Active Academic Subjects */}
          <Divider my="sm" label="Active Academic Subjects" labelPosition="left" />
          <Group gap="xs" mb="lg">
            {activeSubjects.map((subject) => (
              <Tooltip key={subject.id} label={`${subject.description} ${subject.fileCount > 0 ? `(${subject.fileCount} dynamic assets)` : ''}`} withArrow position="top" maxWidth={300}>
                <Badge variant="outline" color="indigo" size="sm" radius="md" p="md" style={{ cursor: 'help' }}>
                  {subject.label}
                </Badge>
              </Tooltip>
            ))}
          </Group>

          {/* Lesson Modalities List */}
          <Divider my="sm" label="Operational Modalities & Learning Paths" labelPosition="left" />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="xs">
            {lessonModalities.map((modality) => {
              const IconComponent = TablerIcons[modality.icon] || IconDeviceLaptop;
              return (
                <Paper key={modality.id} withBorder p="sm" radius="md" bg="var(--mantine-color-gray-0)">
                  <Group align="flex-start" gap="sm">
                    <ThemeIcon color="indigo" size="sm" radius="xl" mt={2}>
                      <IconComponent size={12} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text size="xs" fw={700} c="gray.9">{modality.label}</Text>
                      <Text size="xs" c="dimmed" mt={2}>{modality.description}</Text>
                    </div>
                  </Group>
                </Paper>
              );
            })}
          </SimpleGrid>
        </Card>

        {/* SECTION 2: DUAL GRID - OPEN-SOURCE REPOSITORIES & LEARNING RESOURCES HUB */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          
          {/* CARD A: OPEN-SOURCE REPOSITORY ENGINE */}
          <Card withBorder radius="lg" p="xl" shadow="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Group justify="space-between" mb="md">
                <Group gap="sm">
                  <ThemeIcon color="cyan" size="lg" radius="md">
                    <IconCode size={20} />
                  </ThemeIcon>
                  <Title order={3} fw={800}>Open-Source Knowledge</Title>
                </Group>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Every academic learning track is fully backed by code implementations, architectural baselines, and compilation scripts. Both my official <strong>GitHub repositories</strong> and all associated workspace <strong>learning materials</strong> are completely free, open source, and downloadable under permissive free software licenses.
              </Text>
              <Divider my="sm" label="Repository Inventory Assets" labelPosition="left" />
              <List size="xs" spacing={6} icon={<IconCheck size={12} color="var(--mantine-color-cyan-6)" />}>
                <List.Item><Text size="xs" c="gray.8">Automation scripts and isolated sandbox environments for runtime testing</Text></List.Item>
                <List.Item><Text size="xs" c="gray.8">Production-ready reference architectures and software design patterns</Text></List.Item>
                <List.Item><Text size="xs" c="gray.8">Clean source directories structured elegantly inside static filesystem layouts</Text></List.Item>
              </List>
            </Box>
            
            <Group grow mt="lg" gap="sm">
              <Button 
                variant="light" 
                color="cyan" 
                leftSection={<IconDownload size={16} />} 
                onClick={onNavigateToRepositories}
              >
                Browse & Clone GitHub Repos
              </Button>
              <Button 
                variant="filled" 
                color="cyan" 
                rightSection={<IconArrowRight size={16} />} 
                onClick={onNavigateToLessonsMaterials}
              >
                Explore Free Materials
              </Button>
            </Group>
          </Card>

          {/* CARD B: LEARNING RESOURCES HUB (Referencing languages.js capabilities) */}
          <Card withBorder radius="lg" p="xl" shadow="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Group justify="space-between" mb="md">
                <Group gap="sm">
                  <ThemeIcon color="orange" size="lg" radius="md">
                    <IconBooks size={20} />
                  </ThemeIcon>
                  <Title order={3} fw={800}>{t('Learning', 'Learning Resources Hub')}</Title>
                </Group>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Explore a comprehensive indexed hub compiled directly within the languages engine. Access extensive, self-contained documentation, manuals, and code blueprints targeting programming languages, operating systems, backend databases, and advanced developer tooling.
              </Text>
              <Divider my="sm" label="Available Learning Subsystems" labelPosition="left" />
              <SimpleGrid cols={2} spacing="xs">
                <Group gap={6}><IconTerminal size={14} color="var(--mantine-color-orange-6)" /><Text size="xs" c="gray.8">Guides & Tutorials</Text></Group>
                <Group gap={6}><IconTerminal size={14} color="var(--mantine-color-orange-6)" /><Text size="xs" c="gray.8">Manuals & References</Text></Group>
                <Group gap={6}><IconTerminal size={14} color="var(--mantine-color-orange-6)" /><Text size="xs" c="gray.8">Books & Documents</Text></Group>
                <Group gap={6}><IconTerminal size={14} color="var(--mantine-color-orange-6)" /><Text size="xs" c="gray.8">Code Blueprints & Examples</Text></Group>
                <Group gap={6}><IconTerminal size={14} color="var(--mantine-color-orange-6)" /><Text size="xs" c="gray.8">Configuration Modules</Text></Group>
                <Group gap={6}><IconTerminal size={14} color="var(--mantine-color-orange-6)" /><Text size="xs" c="gray.8">Executables & Software Apps</Text></Group>
              </SimpleGrid>
            </Box>
            <Button variant="light" color="orange" mt="lg" rightSection={<IconArrowRight size={16} />} onClick={onNavigateToLanguages}>
              Open Languages & Resources Hub
            </Button>
          </Card>

        </SimpleGrid>

        {/* SECTION 3: TUITION PACKAGE BRACKETS, PAYMENT CLAUSES & COMPLIANCE */}
        <Card withBorder radius="lg" p="xl" bg="gray.0" shadow="xs">
          <Stack gap="md">
            <Group gap="md">
              <ThemeIcon color="blue" size="xl" radius="md" variant="light">
                <IconWallet size={22} />
              </ThemeIcon>
              <div>
                <Text size="md" fw={800} c="gray.9">Tuition Framework & Reservation Clauses</Text>
                <Text size="xs" c="dimmed">Transparent tier pricing, flexible session boundaries, and compliant student policies.</Text>
              </div>
            </Group>

            {/* Price Plan Cards mapping from 'pricing' array */}
            {educationalPackages.length > 0 && (
              <Box mt="xs">
                <Text size="xs" fw={700} c="gray.7" uppercase mb="xs">Predictable Tuition Brackets</Text>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
                  {educationalPackages.map((pack, idx) => (
                    <Paper key={idx} withBorder p="sm" radius="md" bg="white" style={{ textAlign: 'center' }}>
                      <Text size="xs" fw={700} c="gray.8">{pack.title}</Text>
                      <Title order={3} c="blue.7" mt={4}>{pack.price}</Title>
                      <Text size="10px" c="dimmed" mt={2}>{pack.description}</Text>
                    </Paper>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            <Grid gutter="xl" mt="xs">
              {/* Interface Configurations Metadata Box */}
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Text size="xs" fw={700} c="gray.7" uppercase mb="xs">Supported Interface Configurations</Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                  
                  <Paper withBorder p="xs" radius="md" bg="white">
                    <Badge size="9px" variant="light" color="teal" mb={2}>Durations Available</Badge>
                    <Group gap="xs" mt={4}>
                      {paymentPolicies?.durations.map((d: string) => (
                        <Badge key={d} size="xs" color="gray" variant="outline">Session: {d}</Badge>
                      ))}
                    </Group>
                    <Text size="10px" c="dimmed" mt="xs">
                      Sessions scale natively inside synchronized booking views.
                    </Text>
                  </Paper>

                  <Paper withBorder p="xs" radius="md" bg="white">
                    <Badge size="9px" variant="light" color="teal" mb={2}>Payment Strategies</Badge>
                    <Group gap="xs" mt={4}>
                      {paymentPolicies?.allowedMethods.map((m: string) => (
                        <Badge key={m} size="xs" color="blue" variant="light">{m.replace('-', ' ')}</Badge>
                      ))}
                    </Group>
                    <Text size="10px" c="dimmed" mt="xs">
                      Enforces transaction criteria dynamically at validation level.
                    </Text>
                  </Paper>

                </SimpleGrid>
              </Grid.Col>

              {/* Terms and Academic Guidelines Box */}
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Box style={{ height: '100%', borderLeft: '1px solid var(--mantine-color-gray-3)' }} pl={{ md: 'xl' }}>
                  <Text size="xs" fw={700} c="gray.7" uppercase mb="xs">Academic Terms & Clauses</Text>
                  
                  {paymentPolicies && (
                    <Stack gap="sm">
                      <Paper withBorder p="sm" radius="md" bg="blue.0" style={{ borderColor: 'var(--mantine-color-blue-3)' }}>
                        <Group gap={6}>
                          <IconInfoCircle size={14} color="var(--mantine-color-blue-6)" />
                          <Text size="xs" fw={700} c="blue.9">Session Billing Note</Text>
                        </Group>
                        <Text size="xs" c="blue.8" fw={500} mt={2}>
                          Flexible processing through secure payment handlers or deferred validation options.
                        </Text>
                      </Paper>

                      <Paper withBorder p="sm" radius="md" bg="white">
                        <Group gap={6} mb="xs">
                          <IconCreditCard size={14} color="var(--mantine-color-gray-7)" />
                          <Text size="xs" fw={700} c="gray.8">Contractual Parameters</Text>
                        </Group>
                        <List size="xs" spacing={4} icon={<IconCheck size={10} color="var(--mantine-color-blue-5)" />}>
                          {paymentPolicies.clauses.map((clause, index) => (
                            <List.Item key={index}>
                              <Text size="11px" c="gray.7">{clause}</Text>
                            </List.Item>
                          ))}
                        </List>
                      </Paper>
                    </Stack>
                  )}
                </Box>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* FINAL WORKSPACE NAVIGATOR BUTTON */}
        <Button 
          variant="filled" 
          color="indigo" 
          size="md"
          mt="sm"
          rightSection={<IconArrowRight size={18} />}
          onClick={onNavigateToLessons}
          fullWidth
        >
          Open Dynamic Workspace Explorer & Booking Engine
        </Button>

      </Stack>
    </Box>
  );
}








export default function Home() {
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const navigate = useNavigate(); // <-- Inizializzato per gestire il cambio pagina

  // Ipotetico stato locale se l'albero non è presente globalmente
  const [lessonsTree, setLessonsTree] = useState(null); 

  return (
    <Box>
      {/* 1. HERO SECTION */}
      <Box 
        style={{ 
          position: 'relative', 
          background: 'linear-gradient(135deg, #1f62ce 0%, #154594 100%)',
          paddingTop: '80px',
          paddingBottom: '80px',
          color: 'white'
        }}
      >
        <Container size="lg">
          <Stack spacing="md" align="center" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Badge color="yellow" variant="filled" size="lg" radius="sm">
              {t('home_page.hub_badge')}
            </Badge>
            <Title order={1} size="3.5rem" fw={900} style={{ letterSpacing: '-1px' }}>
              {t('home_page.hero_title')}
            </Title>
            <Text size="xl" maxW={650} mx="auto" c="blue.1" fw={400}>
              {t('home_page.hero_subtitle')}
            </Text>
            <Group mt="lg" justify="center">
              <Button
                component={Link}
                to="/profile"
                size="lg"
                color="yellow"
                radius="md"
                rightSection={<IconArrowRight size={18} />}
              >
                {t('home_page.cta_profile')}
              </Button>

              <Button
                component={Link}
                to="/lessons"
                size="lg"
                variant="white"
                color="blue"
                radius="md"
              >
                {t('home_page.cta_materials')}
              </Button>

              <Button
                component={Link}
                to="/consulting"
                size="lg"
                variant="filled"
                color="teal"
                radius="md"
                rightSection={<IconArrowRight size={18} />}
              >
                {t('home_page.cta_consulting')}
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      <Box bg="gray.0" py="xl">
        <Container size="lg" my="md">
          <Stack align="center" spacing="xs" mb="xl" style={{ textAlign: 'center' }}>
            <Title order={2} size="2.2rem" fw={800}>
              {t('home_page.pillars_section_title', 'Core Pillars')}
            </Title>
            <Text size="lg" c="dimmed" maxW={600}>
              {t('home_page.pillars_section_subtitle', 'Explore the main macro-areas of our platform designed to elevate your technical skills.')}
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            {/* PILLAR 1: CONSULTING */}
            <Paper p="xl" radius="md" withBorder style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Stack spacing="md">
                <Group justify="space-between" align="flex-start">
                  <ThemeIcon size={50} radius="md" color="blue" variant="light">
                    <IconBriefcase size={28} />
                  </ThemeIcon>
                  <Badge color="green" variant="light" leftSection={<IconCalendarEvent size={12} />}>
                    {t('home_page.pillars.bookable', 'Book a Session')}
                  </Badge>
                </Group>
                <Title order={3} size="1.4rem" fw={700}>
                  {t('home_page.pillars.consulting_title', 'Professional Consulting')}
                </Title>
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                  {t('home_page.pillars.consulting_desc', 'Tailored architectural solutions, code reviews, and tech strategic planning. You can book a dedicated 1-on-1 live session directly through the platform.')}
                </Text>
              </Stack>
              <Button variant="subtle" color="blue" rightSection={<IconArrowRight size={14} />} mt="lg" onClick={() => navigate("/consulting")}>
                {t('home_page.pillars.explore', 'Explore Consulting')}
              </Button>
            </Paper>

            {/* PILLAR 2: LESSONS */}
            <Paper p="xl" radius="md" withBorder style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Stack spacing="md">
                <Group justify="space-between" align="flex-start">
                  <ThemeIcon size={50} radius="md" color="violet" variant="light">
                    <IconSchool size={28} />
                  </ThemeIcon>
                  <Badge color="green" variant="light" leftSection={<IconCalendarEvent size={12} />}>
                    {t('home_page.pillars.bookable', 'Book a Session')}
                  </Badge>
                </Group>
                <Title order={3} size="1.4rem" fw={700}>
                  {t('home_page.pillars.lessons_title', 'Private & Group Lessons')}
                </Title>
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                  {t('home_page.pillars.lessons_desc', 'Structured mentoring paths to deep-dive into complex technologies. Instantly check availability and book your next live learning session on our calendar.')}
                </Text>
              </Stack>
              <Button variant="subtle" color="violet" rightSection={<IconArrowRight size={14} />} mt="lg" onClick={() => navigate("/lessons")}>
                {t('home_page.pillars.explore_lessons', 'Explore Lessons')}
              </Button>
            </Paper>

            {/* PILLAR 3: E-LEARNING & MATERIALS */}
            <Paper p="xl" radius="md" withBorder style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: theme.colors.yellow[5] }}>
              <Stack spacing="md">
                <Group justify="space-between" align="flex-start">
                  <ThemeIcon size={50} radius="md" color="yellow" variant="light">
                    <IconDeviceLaptop size={28} />
                  </ThemeIcon>
                  <Badge color="yellow" variant="filled" leftSection={<IconDownload size={12} />}>
                    {t('home_page.pillars.free_open', '100% Free & Open')}
                  </Badge>
                </Group>
                <Title order={3} size="1.4rem" fw={700}>
                  {t('home_page.pillars.elearning_title', 'E-Learning Hub')}
                </Title>
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                  {t('home_page.pillars.elearning_desc', 'Access our complete library of documentation, scripts, and complete projects. Everything present on this platform is completely open-source and free to download.')}
                </Text>
              </Stack>
              <Button variant="subtle" color="yellow" rightSection={<IconArrowRight size={14} />} mt="lg" onClick={() => navigate("/lessons#materials")}>
                {t('home_page.pillars.download_now', 'Download Materials')}
              </Button>
            </Paper>
          </SimpleGrid>
        </Container>
      </Box>

      {/* 2. GRID SECTIONS */}
      <Container size="lg" py="xl" my="xl">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {/* NUOVA SEZIONE ESTESA: LESSONS HOME SECTION (Sostituisce la vecchia Card 2 occupando tutta la riga inferiore) */}
          <LessonsHomeSection 
            lessonsTree={lessonsTree}
            onNavigateToLessons={() => navigate("/lessons")}
            onNavigateToLessonsMaterials={() => navigate("/lessons#materials")}
            onNavigateToRepositories={() => navigate("/repositories")}
            onNavigateToLanguages={() => navigate("/languages")} 
          />

          {/* CARD 3: CONSULENZA AZIENDALE AVANZATA */}
          <ConsultingHomeSection 
            onNavigateToConsulting={() => navigate("/consulting")} 
          />

        </SimpleGrid>
      </Container>

      {/* 3. QUICK STATS */}
      <Box bg="gray.1" py="xl" style={{ borderTop: '1px solid var(--mantine-color-gray-2)', borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" style={{ textAlign: 'center' }}>
            <div>
              <Text size="2.5rem" fw={900} c="blue.6">100%</Text>
              <Text fw={700} size="sm" uppercase c="dimmed">{t('home_page.stats_cicd')}</Text>
            </div>
            <div>
              <Text size="2.5rem" fw={900} c="teal.6">30+</Text>
              <Text fw={700} size="sm" uppercase c="dimmed">{t('home_page.stats_subjects')}</Text>
            </div>
            <div>
              <Text size="2.5rem" fw={900} c="grape.6">Live</Text>
              <Text fw={700} size="sm" uppercase c="dimmed">{t('home_page.stats_booking')}</Text>
            </div>
          </SimpleGrid>
        </Container>
      </Box>

      {/* 4. FOOTER CALL-TO-ACTION */}
      <Container size="sm" py="xl" my="xl" style={{ textAlign: 'center' }}>
        <Stack spacing="xs">
          <ThemeIcon size="xl" radius="xl" color="yellow" mx="auto">
            <IconCalendarEvent size={24} />
          </ThemeIcon>
          <Title order={3}>{t('home_page.footer_title')}</Title>
          <Text size="sm" c="dimmed">
            {t('home_page.footer_desc')}
          </Text>
          <Group justify="center" mt="md">
            <Button component={Link} to="/lessons" size="sm" variant="outline" color="blue" leftSection={<IconBook size={16}/>}>
              {t('home_page.footer_btn_tutoring')}
            </Button>
            <Button component={Link} to="/consulting" size="sm" variant="outline" color="teal" leftSection={<IconBriefcase size={16}/>}>
              {t('home_page.footer_btn_consulting')}
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}