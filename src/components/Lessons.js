

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Modal,
  Tabs, 
  ScrollArea,
  TextInput,
  Container, 
  Title, 
  Badge, 
  SimpleGrid, 
  rem, 
  Card, 
  Text,
  CopyButton, 
  Button, 
  Group, 
  Collapse, 
  Stack, 
  Box, 
  Paper, 
  ThemeIcon, 
  List, 
  Divider,
  Select,
  ActionIcon,
  Checkbox,
  Tooltip,
  Affix,
  Transition,
  Center,
  Chip,
  Grid,
  SegmentedControl
} from '@mantine/core';


import { startOfWeek, addWeeks, subWeeks, format, isSameDay, addDays, isToday } from 'date-fns';










import {
  IconBolt,
  IconBrandAppleArcade,
  IconBrandGoogle,
  IconUser,
  IconMail,
  IconCategory,
  IconFolderOff,
  IconInfoCircle,
  IconCopy,
  IconCopied,
  IconWallet,
  IconX,
  IconSearch, 
  IconDownload, 
  IconFileTypePdf, 
  IconFileTypeMp4, 
  IconFileTypeZip,
  IconCalendarEvent,
  IconDeviceLaptop, 
  IconFileCode, 
  IconMessageChatbot, 
  IconTargetArrow, 
  IconCalendar, 
  IconBook,
  IconCalendarCheck, 
  IconDeviceDesktopCode, 
  IconShieldLock, 
  IconNetwork, 
  IconFolder,
  IconBooks,
  IconChevronRight, 
  IconChevronDown,
  IconChevronLeft, 
  IconFileText, 
  IconSchool, 
  IconCode, 
  IconDatabase, 
  IconTarget, 
  IconClock, 
  IconFileCheck,
  IconBrandPaypal,
  IconCreditCard,
  IconBrandRevolut,
  IconTransfer,
  IconCheck,
  IconAlertTriangle,
  IconBuildingBank,
  IconHelp,
  IconTerminal,
  IconBox,
  IconBookmark,
  IconBulb,
  IconFile,
  IconLink,
  IconFileZip,
  IconBrandApple
} from '@tabler/icons-react';



import { DateTimePicker } from '@mantine/dates';




import "./Lessons.css";

/*
=====================================================
LESSONS PAGE
=====================================================

Designed for:

- GitHub Pages
- Static filesystem content
- Dynamic directory tree rendering
- Cal.com integration
- Downloadable lesson materials
- Modern UI

=====================================================
HOW IT WORKS
=====================================================

1. Put lessons inside:

public/lessons/

2. Generate lessons-tree.json automatically

3. React renders everything dynamically

=====================================================
EXAMPLE STRUCTURE
=====================================================

public/
└── lessons/
    ├── Programming/
    │   ├── C++/
    │   │   └── materials/
    │   │       ├── tutorials/
    │   │       ├── guides/
    │   │       ├── scripts/
    │   │       └── projects/
    │   │
    │   └── Python/
    │
    ├── Operating Systems/
    └── Networking/

=====================================================
*/

const CAL_TUTORING_LINK = "https://cal.com/giuseppe-pedone-28bua5/it-tutoring";
const CAL_CONSULTING_LINK = "https://cal.com/giuseppe-pedone-28bua5/it-consulting";
const RAILWAY_BACKEND_LINK = "https://unix69webpagebackend-production.up.railway.app";



const subjects = [
  'Programming',
  'Operating Systems',
  'Networking',
  'Cybersecurity',
  'Algorithms',
  'Databases',
  'Artificial Intelligence',
];

const availability = [
  {
    day: 'Monday',
    slots: [
      { time: '09:00 - 11:00', available: true },
      { time: '15:00 - 17:00', available: false },
    ],
  },
  {
    day: 'Tuesday',
    slots: [
      { time: '10:00 - 12:00', available: true },
      { time: '16:00 - 18:00', available: true },
    ],
  },
  {
    day: 'Wednesday',
    slots: [
      { time: '14:00 - 16:00', available: false },
    ],
  },
];

const pricing = [
  {
    title: 'Single Lesson',
    price: '€35',
    description: '1 personalized lesson',
  },
  {
    title: '5 Lessons Package',
    price: '€160',
    description: 'Discounted package',
  },
  {
    title: '10 Lessons Package',
    price: '€300',
    description: 'Extended learning path',
  },
];



function getFieldErrors(info, lessonsTree) {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validSubjects = getSubjects(lessonsTree);

  // Name: mostriamo errore solo se l'utente ha iniziato a scrivere e poi ha cancellato
  if (info.name !== undefined && info.name !== "" && !info.name?.trim()) errors.name = "Full name is required.";
  
  // Email: mostriamo errore solo se contiene caratteri ma non è valida
  if (info.email !== undefined && info.email !== "" && !emailRegex.test(info.email)) errors.email = "Invalid email format.";
  
  // Subject
  if (info.subject !== undefined && !validSubjects.includes(info.subject)) errors.subject = "Please select a valid subject.";
  
  // Altri campi
  if (info.duration && !ALLOWED_BOOK_FORM_VALUES.duration.includes(info.duration)) errors.duration = "Invalid duration.";
  if (info.type && !ALLOWED_BOOK_FORM_VALUES.type.includes(info.type)) errors.type = "Invalid lesson type.";
  
  return errors;
}

export function BookingFormSection({ lessonInfo, setLessonInfo, lessonsTree, onBook, loading }) {
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (field, value) => {
    const newInfo = { ...lessonInfo, [field]: value };
    setLessonInfo(newInfo);
    setFormErrors(getFieldErrors(newInfo, lessonsTree));
  };

  const handleBookSubmit = () => {
    // Validazione finale prima dell'invio
    const finalErrors = getFieldErrors(lessonInfo, lessonsTree);
    if (Object.keys(finalErrors).length > 0) {
      setFormErrors(finalErrors); // Mostra tutti gli errori se ce ne sono
      return;
    }
    onBook();
  };

  useEffect(() => {
    // 1. Definiamo i valori di default
    const defaultSubject = getSubjects(lessonsTree)?.[0];
    const defaultType = ALLOWED_BOOK_FORM_VALUES.type[0];
    const defaultDuration = '1h';

    // 2. Creiamo un oggetto con solo i valori mancanti
    const updates = {};
    if (!lessonInfo.subject && defaultSubject) updates.subject = defaultSubject;
    if (!lessonInfo.type && defaultType) updates.type = defaultType;
    if (!lessonInfo.duration) updates.duration = defaultDuration;
    if (!lessonInfo.payment) updates.payment = 'pay-now';

    // 3. Se ci sono cambiamenti, aggiorniamo una sola volta
    if (Object.keys(updates).length > 0) {
      setLessonInfo(prev => ({ ...prev, ...updates }));
    }
  }, [lessonsTree]);


  return (
    <Paper withBorder p="xl" radius="lg" shadow="sm">
      <Title order={3} mb="xl" c="blue" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <IconCalendarEvent /> Configure your session
      </Title>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box p="md" style={{ border: '1px solid #eee', borderRadius: '12px' }}>
            <DateTimePicker
              label="Pick date and time"
              value={lessonInfo.date}
              onChange={(val) => handleChange('date', val)}
              error={formErrors.date}
              leftSection={<IconCalendarEvent size={16} />}
              styles={{
                calendarHeader: { padding: '4px 8px' },
                calendarHeaderControl: { width: '24px', height: '24px' },
                day: { width: '30px', height: '30px' }
              }}
            />
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <Group grow>
              <TextInput label="Full Name" error={formErrors.name} leftSection={<IconUser size={16}/>} placeholder="John Doe" value={lessonInfo.name} onChange={(e) => handleChange('name', e.target.value)} />
              <TextInput label="Email" error={formErrors.email} leftSection={<IconMail size={16}/>} placeholder="john@example.com" value={lessonInfo.email} onChange={(e) => handleChange('email', e.target.value)} />
            </Group>

            <TextInput label="Lesson Title" error={formErrors.title} leftSection={<IconBook size={16}/>} placeholder="e.g., Intro to React" value={lessonInfo.title} onChange={(e) => handleChange('title', e.target.value)} />

            <SimpleGrid cols={2}>
              <Select label="Subject" error={formErrors.subject} leftSection={<IconSchool size={16}/>} data={getSubjects(lessonsTree)} value={lessonInfo.subject} onChange={(val) => handleChange('subject', val)} />
              <Select label="Duration" error={formErrors.duration} leftSection={<IconClock size={16}/>} data={[{value: '1h', label: '1 Hour'}, {value: '2h', label: '2 Hours'}]} value={lessonInfo.duration} onChange={(val) => handleChange('duration', val)} />
            </SimpleGrid>

            <Select label="Lesson Type" error={formErrors.type} leftSection={<IconCategory size={16}/>} data={ALLOWED_BOOK_FORM_VALUES.type} value={lessonInfo.type || ALLOWED_BOOK_FORM_VALUES.type[0]} onChange={(val) => handleChange('type', val)} />

            <Box>
              <Text size="sm" fw={500} mb={5}>Payment Preference</Text>
              <SegmentedControl
                fullWidth
                color="blue"
                variant="default"
                radius="md"
                data={[
                  { label: 'Pay on booking', value: 'pay-now' },
                  { label: 'Pay Later', value: 'pay-later' }
                ]}
                value={lessonInfo.payment || 'pay-now'} 
                onChange={(val) => handleChange('payment', val)}
                styles={(theme) => ({
                  indicator: { backgroundColor: theme.colors.blue[6] },
                })}
              />
            </Box>
          </Stack>
        </Grid.Col>
      </Grid>

      <Button fullWidth size="lg" mt="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} loading={loading} onClick={handleBookSubmit}>
        Confirm & Book Session
      </Button>
    </Paper>
  );
}


const ALLOWED_BOOK_FORM_VALUES = {
  duration: ['1h', '2h'],
  payment: ['pay-now', 'pay-later'],
  type: ['Private Lessons', 'Hands-on Projects','Exam Tutoring','Live Pair Programming','Thesis Support','Homework & Tasks', 'Ongoing Mentorship']
};

function validateBookingData(info, lessonsTree) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validSubjects = getSubjects(lessonsTree);

  // Validazione campi base
  if (!info.name?.trim()) return "Full name is required.";
  if (!emailRegex.test(info.email)) return "A valid email is required.";
  
  // Validazione dinamica del Subject basata su lessonsTree
  if (!info.subject || !validSubjects.includes(info.subject)) {
    return "Please select a valid subject from the available list.";
  }

  // Validazione valori permessi (Whitelist)
  if (!ALLOWED_BOOK_FORM_VALUES.duration.includes(info.duration)) return "Invalid duration selected.";
  if (!ALLOWED_BOOK_FORM_VALUES.payment.includes(info.payment)) return "Invalid payment method.";
  if (!ALLOWED_BOOK_FORM_VALUES.type.includes(info.type)) return "Invalid service type.";

  return null;
}








function getSubjects(lessonsTree) {
  if (!lessonsTree?.children) return [];
  return lessonsTree.children.map(child => child.name);
}




export default function Lessons() {
  const [search, setSearch] = useState('');
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [lessonsTree, setLessonsTree] = useState(null);
  const [lesson_info, setLessonInfo] = useState({
    name: '',
    email: '',
    subject: '',
    title:'',
    date: null,
    time: '',
    duration: '1h',
    type: 'Private Lessons',
    payment: 'pay-later'
  });


  const subjectOptions = useMemo(() => {
    return lessonsTree?.children?.map(child => child.name) || [];
  }, [lessonsTree]);


  async function handleFormSubmit() {
    // 1. Validazione base
    const errorMsg = validateBookingData(lesson_info, lessonsTree);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    
    // 2. Controllo data selezionata nel form
    if (!lesson_info.date) {
      alert("Please select a date and time!");
      return;
    }

    setBookingLoading(true);

    try {
      const idempotencyKey = crypto.randomUUID();
      
      // Convertiamo la data del DateTimePicker in formato ISO
      const startTime = lesson_info.date.toISOString();
      // Calcoliamo l'end time basato sulla durata scelta nel form
      const durationMs = lesson_info.duration === '1h' ? 3600000 : 7200000;
      const endTime = new Date(lesson_info.date.getTime() + durationMs).toISOString();

      // 3. Chiamata al tuo backend (stessa logica del vecchio bookSlot)

      alert("StartTime in ISO format" && startTime);
      
      const reserveRes = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/reserve-slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: startTime, idempotencyKey }),
      });

      if (!reserveRes.ok) throw new Error("This slot is no longer available.");
      const { token } = await reserveRes.json();

      const request_tx_timestamp = new Date().toISOString();

      const bookRes = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: startTime,
          end: endTime,
          name: lesson_info.name,
          email: lesson_info.email,
          title: lesson_info.title,
          subject: lesson_info.subject,
          type: lesson_info.type,
          lockToken: token,
          idempotencyKey,
          tutoring_event_id: `${lesson_info.duration}-${lesson_info.payment === 'pay-now' ? 'stripe' : 'manual'}`,
          request_tx_timestamp
          
        }),
      });

      if (!bookRes.ok) throw new Error("Booking failed");

      alert("Booking successful!");
      // Ora puoi reindirizzare a una pagina di ringraziamento o confermare a video
    } catch (err) {
      alert(err.message);
    } finally {
      setBookingLoading(false);
    }
  }

  async function bookSlot(slot, lesson_info) {
    setBookingLoading(true);

    try {
      const idempotencyKey = crypto.randomUUID();

      // 1. RESERVE SLOT
      const reserveRes = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/reserve-slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: slot.startTime,
          idempotencyKey,
        }),
      });

      if (!reserveRes.ok) {
        const err = await reserveRes.json();
        alert(err.error || "Slot not available");
        return;
      }

      const { token } = await reserveRes.json();
      const paymentType = lesson_info.payment === 'pay-now' ? 'stripe' : 'manual';
      const eventKey = `${lesson_info.duration}-${paymentType}`;

      const errorMsg = validateBookingData(lesson_info, lessonsTree);
      if (errorMsg) {
        alert(errorMsg);
        return;
      }
      
      const request_tx_timestamp = new Date().toISOString();

      // 2. BOOK SLOT
      const bookRes = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: slot.startTime,
          end: slot.endTime,
          name: lesson_info.name,
          email: lesson_info.email,
          title: lesson_info.title,
          lockToken: token,
          idempotencyKey,
          tutoring_event_id: eventKey,
          subject: lesson_info.subject,
          type: lesson_info.type,
          request_tx_timestamp: request_tx_timestamp
        }),
      });

      if (!bookRes.ok) {
        const err = await bookRes.json();
        alert(err.error || "Booking failed");
        return;
      }

      const data = await bookRes.json();

      // 3. SUCCESS ONLY
      window.open(CAL_TUTORING_LINK, "_blank");

    } catch (err) {
      alert(err.message || "Unexpected error");
    } finally {
      setBookingLoading(false);
    }
  }



  
  // 2. Sposta qui gli useEffect
  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoadingAvailability(true);
        const res = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/availability`);
        
        // Controlliamo il tipo di risposta
        console.log("Stato risposta:", res.status); 
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        console.log("Dati ricevuti dal browser:", data);
        setAvailabilityData(data?.slots || []); 
      } catch (err) {
        console.error("ERRORE CRITICO:", err); // <-- Guarda qui nella console
        setError("Cannot load availability");
      } finally {
        setLoadingAvailability(false);
      }
    }
    loadAvailability();
  }, []);

  useEffect(() => {
    fetch('/resources-tree.json')
        .then(res => res.json())
        .then(data => setLessonsTree(data))
        .catch(err => console.error('Failed to load lessons tree:', err));
  }, []);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject =>
      subject.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Questa funzione prepara il form e apre il modal
  const handleSlotSelect = (slot) => {
    setLessonInfo(prev => ({
      ...prev,
      date: new Date(slot.start) // Imposta la data cliccata
    }));
    setModalOpened(true);
  };

  const handleBook = async () => {
    await handleFormSubmit(); 
    setModalOpened(false);
  };

  const handleDurationSelect = (duration) => {
    setLessonInfo(prev => ({ ...prev, duration: duration }));
    setModalOpened(true);
  
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="lessons-container">
      <HeroSection />
       <br/>
       <br/>
      <OfferDetailsSection />
       <br/>
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        <LessonModalitiesSection />
         <br/>
         <br/>
        <LessonsInfoSection />
         <br/>
         <br/>
        <PricingSection onDurationSelect={handleDurationSelect} />
         <br/>
         <br/>
        <BookingFormSection 
          lessonInfo={lesson_info} 
          setLessonInfo={setLessonInfo}
          lessonsTree={lessonsTree}
          onBook={handleFormSubmit}        // <--- Qui passi la funzione
          loading={bookingLoading}        // <--- Qui passi lo stato di caricamento
        />
         <br/>
         <br/>
        <AvailabilitySection 
          availabilityData={availabilityData}
          loading={loadingAvailability}
          onSlotSelect={handleSlotSelect} // Passiamo il trigger
        />
        <br/>
        <br/>
        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} size="lg">
          <BookingFormSection 
            lessonInfo={lesson_info}
            setLessonInfo={setLessonInfo}
            onBook={handleBook}
            loading={bookingLoading}
            lessonsTree={lessonsTree}
          />
        </Modal>
        <br/>
        <br/>
        <SubjectsSection
          search={search}
          setSearch={setSearch}
          lessonsTree={lessonsTree} // Passa tutto l'albero
        />
        <br/>
        <br/>
        <MaterialsSection 
          lessonsTree={lessonsTree} // Passa il dato
        />
        <br/>
        <br/>
        <br/>
      </div>
    </div>
  );
}



export function OfferDetailsSection() {
  const features = [
    {
      title: "Comprehensive Support",
      desc: "From foundational school concepts to advanced engineering degrees. Personalized study plans for every level.",
      icon: <IconSchool size={28} />,
      color: "blue"
    },
    {
      title: "Technical Mastery",
      desc: "Deep dive into ASM, C/C++, Python, Algorithms, OS, and Computer Architecture.",
      icon: <IconCode size={28} />,
      color: "cyan"
    },
    {
      title: "Practical Methodology",
      desc: "Live pair programming, real-world code reviews, and hands-on project building.",
      icon: <IconTargetArrow size={28} />,
      color: "teal"
    },
    {
      title: "Exam & Thesis Prep",
      desc: "Specialized mentoring to crush your university exams and experimental thesis projects.",
      icon: <IconFileText size={28} />,
      color: "orange"
    }
  ];

  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#fdfdfd' }}>
      <Container size="lg">
        <Title order={2} ta="center" mb={10}>Offering Expert Tutoring & Mentorship</Title>
        <Text ta="center" c="dimmed" mb={50} size="lg">
          Master complex technologies with a <strong>hands-on, result-oriented approach</strong>.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {features.map((item, index) => (
            <Card 
              key={index} 
              withBorder 
              radius="lg" 
              p="xl" 
              className="hover-card"
              style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
            >
              <Group mb="md">
                <ThemeIcon size={50} radius="xl" variant="light" color={item.color}>
                  {item.icon}
                </ThemeIcon>
                <Title order={4}>{item.title}</Title>
              </Group>
              <Text size="sm" c="dimmed">{item.desc}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      <style>{`
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--mantine-shadow-md);
          border-color: var(--mantine-color-blue-2);
        }
      `}</style>
    </section>
  );
}



export function HeroSection() {
  return (
    <section 
      style={{ 
        padding: '120px 20px', 
        position: 'relative',
        background: 'linear-gradient(180deg, var(--mantine-color-gray-0) 0%, #ffffff 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Elementi decorativi di sfondo (sfere sfocate) */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(34, 139, 230, 0.1)',
        filter: 'blur(80px)'
      }} />

      <Container size="lg">
        <Stack gap="xl" align="center" ta="center">
          
          <Badge 
            size="xl" 
            variant="light" 
            color="blue"
            radius="xl"
            px={20}
          >
            Technical Mentoring 2026
          </Badge>

          <Title 
            order={1} 
            style={{ 
              fontSize: 'clamp(40px, 8vw, 72px)', 
              lineHeight: 1.1,
              maxWidth: '800px' 
            }}
          >
            Don't just study. 
            <br /> 
            <Text span c="blue" inherit>Build</Text> your future.
          </Title>

          <Text 
            size="xl" 
            c="dimmed" 
            maw={600}
          >
            Personalized paths in OS, Cybersecurity, and Software Engineering. 
            From debugging your first script to architecting complex systems.
          </Text>

          <Group justify="center" mt="md">
            <Button 
              size="xl" 
              radius="md"
              component="a" 
              href={CAL_TUTORING_LINK} 
              leftSection={<IconCalendar size={20} />}
            >
              Book a session
            </Button>
            <Button 
              size="xl" 
              radius="md"
              variant="default" 
              component="a" 
              href="#materials" 
              leftSection={<IconBook size={20} />}
            >
              Explore materials
            </Button>
          </Group>

        </Stack>
      </Container>
    </section>
  );
}



function getFolderStats(node) {
  let stats = {
    // Basic metrics
    files: 0,
    sizeBytes: 0,
    sizeKb: 0,
    lastModified: node.lastModified || 0,
    
    // Rich metadata
    extensions: new Set(),
    
    // Legacy alias (for code expecting 'count')
    get count() { return this.files; }
  };

  const walk = (n) => {
    if (n.type === 'file') {
      stats.files += 1;
      stats.sizeBytes += (n.size || 0);
      stats.sizeKb += (n.size || 0) / 1024;
      
      // Update last modified based on the latest file
      stats.lastModified = Math.max(stats.lastModified, n.lastModified || 0);
      
      // Extract file extensions
      const ext = n.name.split('.').pop().toLowerCase();
      stats.extensions.add(ext);
      
    } else if (n.children) {
      n.children.forEach(walk);
    }
  };

  walk(node);

  // Convert Set to Array for easier consumption
  return {
    ...stats,
    extensions: Array.from(stats.extensions)
  };
}



// --- Sezione Principale ---
export function SubjectsSection({ lessonsTree, search, setSearch }) {
  const matchesSearch = (node, query) => {
    if (node.name.toLowerCase().includes(query.toLowerCase())) return true;
    return node.children ? node.children.some(child => matchesSearch(child, query)) : false;
  };

  const filtered = lessonsTree?.children?.filter(subject => matchesSearch(subject, search)) || [];

  return (
    <section>
      {/* Intestazione con spiegazione interattiva */}
      <Paper p="xl" radius="md" mb="xl" withBorder bg="var(--mantine-color-gray-0)">
        <Group justify="space-between" align="flex-start">
          <Box style={{ flex: 1 }}>
            <Title order={2} mb="xs">
              <IconBook size={28} style={{ verticalAlign: 'middle', marginRight: 10 }} />
              Explore Subjects & Materials
            </Title>
            <Text c="dimmed">
              Esplora il tuo percorso formativo. Ogni materia contiene materiale rilevato automaticamente (PDF, Script, Codice, Media), 
              organizzato per facilitare il tuo apprendimento.
            </Text>
          </Box>
          <TextInput
            placeholder="Cerca materie, argomenti o file..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 350 }}
            size="md"
          />
        </Group>
      </Paper>

      {/* Griglia delle Materie */}
      {filtered.length > 0 ? (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {filtered.map((subject) => (
            <SubjectCard key={subject.name} subject={subject} search={search} />
          ))}
        </SimpleGrid>
      ) : (
        <Center py={100}>
          <Stack align="center">
            <IconFolderOff size={64} color="var(--mantine-color-gray-4)" />
            <Title order={3} c="dimmed">Nessun risultato trovato</Title>
            <Text c="dimmed">Prova a cambiare i termini di ricerca.</Text>
          </Stack>
        </Center>
      )}
    </section>
  );
}

// --- Card Materia ---
function SubjectCard({ subject, search }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Usiamo useMemo per le stats (calcolo unico all'avvio)
  const stats = useMemo(() => getFolderStats(subject), [subject]);

  useEffect(() => {
    if (search && search.length > 0) setIsOpen(true);
  }, [search]);

  // Filtro ricorsivo invariato
  const getFilteredChildren = (nodes, query) => {
    if (!query) return nodes;
    
    return nodes.reduce((acc, n) => {
      // 1. Il nodo corrente matcha?
      const matchesSelf = n.name.toLowerCase().includes(query.toLowerCase());
      
      // 2. I figli matchano?
      const filteredChildren = n.children ? getFilteredChildren(n.children, query) : [];
      
      // 3. Se matcho io O i miei figli matchano, includo il nodo
      if (matchesSelf || filteredChildren.length > 0) {
        acc.push({ 
          ...n, 
          children: n.children ? filteredChildren : undefined,
          // Forza l'apertura se c'è un match nei figli
          forceOpen: filteredChildren.length > 0 
        });
      }
      return acc;
    }, []);
  };

  const visibleChildren = useMemo(() => getFilteredChildren(subject.children || [], search), [subject, search, isOpen]);
  const bookingUrl = `${CAL_TUTORING_LINK}?subject=${encodeURIComponent(subject.name)}`;

  return (
    <Card withBorder radius="md" p="md">
      {/* Header con Icona e Data */}
      <Group mb="xs" justify="space-between">
        <Group gap="xs">
          <IconDatabase size={24} color="var(--mantine-color-blue-6)" />
          <Title order={4}>{subject.name}</Title>
        </Group>
        <Text size="xs" c="dimmed">
          Updated: {new Date(stats.lastModified).toLocaleDateString()}
        </Text>
      </Group>

      {/* Info Stats (Badge) */}
      <Stack gap="xs" mb="md">
        <Group gap="sm">
          <Badge variant="light" color="blue">{stats.files} items</Badge>
          <Badge variant="light" color="gray">{formatSize(stats.sizeBytes)}</Badge>
        </Group>
        
        {/* Badge Estensioni */}
        <Group gap={4}>
          {stats.extensions.slice(0, 5).map(ext => (
            <Badge key={ext} size="xs" variant="outline" color="dark">
              {ext.toUpperCase()}
            </Badge>
          ))}
          {stats.extensions.length > 5 && (
            <Text size="xs" c="dimmed">+{stats.extensions.length - 5} more</Text>
          )}
        </Group>
      </Stack>
      
      {/* Azioni */}
      <Group grow gap="xs">
        <Button component="a" href={bookingUrl} target="_blank" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
          Book it
        </Button>
        <Button variant="light" color="gray" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Collapse" : "Browse"}
        </Button>
      </Group>

      {/* Area Collapsabile */}
      <Collapse in={isOpen}>
        <Box mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)', maxHeight: '300px', overflowY: 'auto' }}>
          {visibleChildren.map((child, i) => (
            child.type === 'folder' 
              ? <DirectoryNode key={child.path || i} node={child} />
              : <FileItem key={child.path || i} file={child} />
          ))}
        </Box>
      </Collapse>
    </Card>
  );
}

export function LessonModalitiesSection() {
  return (
    <section style={{ padding: '60px 0', background: 'var(--mantine-color-gray-0)' }}>
      <Container size="xl">
        <Title order={2} mb="xl" ta="center">Lesson Modalities</Title>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          <LessonTypeCard 
            icon={<IconTargetArrow size={24} />}
            title="Private Lessons"
            desc="Lessons tailored to your specific goals and learning pace."
          />
          <LessonTypeCard 
            icon={<IconFileCode size={24} />}
            title="Hands-on Projects"
            desc="Expert guidance to build academic software and solve complex tasks."
          />
          <LessonTypeCard 
            icon={<IconDeviceLaptop size={24} />}
            title="Exam Tutoring"
            desc="Direct support to help you pass university exams successfully."
          />
          <LessonTypeCard 
            icon={<IconDeviceLaptop size={24} />}
            title="Live Pair Programming"
            desc="Real-time debugging and coding sessions with direct feedback."
          />
          <LessonTypeCard 
            icon={<IconFileText size={24} />}
            title="Thesis Support"
            desc="Specialized mentoring for experimental Master's thesis projects."
          />
          <LessonTypeCard 
            icon={<IconBook size={24} />}
            title="Homework & Tasks"
            desc="Direct help with school/university assignments and exercises."
          />
          <LessonTypeCard 
            icon={<IconMessageChatbot size={24} />}
            title="Ongoing Mentorship"
            desc="Continuous support for your career and technical roadblocks."
          />
        </SimpleGrid>
      </Container>
    </section>
  );
}

export function LessonsInfoSection() {
  return (
    <section style={{ padding: '60px 0' }}>
      <Container size="xl">
        <Title order={2} mb="xl" ta="center">Didactic Methodology & Offering</Title>
        
        {/* Griglia Informazioni Generali */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb={60}>
          <InfoCard 
            title="Who is it for?"
            icon={<IconSchool size={24} />}
            description="From high school students to master's engineering degrees."
            items={['University students (BSc/MSc)', 'Beginners to Advanced developers', 'Professionals seeking upskilling', 'Students needing exam/thesis support']}
          />
          <InfoCard 
            title="Core Subjects"
            icon={<IconCode size={24} />}
            description="Specialized mastery in low-level and high-level languages."
            items={['ASM, C/C++, Python', 'Algorithms & Advanced Programming', 'Operating Systems & System Programming', 'Computer Architecture & RDBMS']}
          />
          <InfoCard 
            title="Teaching Approach"
            icon={<IconTarget size={24} />}
            description="Incremental learning with real-world practical application."
            items={['Personalized study plans', 'Live pair programming', 'Hands-on projects & Code reviews', 'University exam & Thesis preparation']}
          />
          <InfoCard 
            title="Booking & Logistics"
            icon={<IconClock size={24} />}
            description="Flexible, remote, and fully managed."
            items={['Online lessons via video call', '1h (standard) or 2h (extended) sessions', 'Real-time Cal.com booking', 'Downloadable didactic materials']}
          />
        </SimpleGrid>
      </Container>
    </section>
  );
}

// Card per le sezioni principali
function InfoCard({ title, icon, description, items }) {
  return (
    <Paper withBorder p="xl" radius="lg" shadow="sm" h="100%">
      <Group mb="sm">
        <ThemeIcon size={40} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
          {icon}
        </ThemeIcon>
        <Text fw={700} size="xl">{title}</Text>
      </Group>
      <Text size="sm" c="dimmed" mb="md" fs="italic">{description}</Text>
      <Divider mb="md" />
      <List spacing="xs" size="sm" center icon={
        <ThemeIcon color="blue" size={20} radius="xl"><IconFileCheck size={14} /></ThemeIcon>
      }>
        {items.map((item, index) => <List.Item key={index}>{item}</List.Item>)}
      </List>
    </Paper>
  );
}




// FeatureCard per le modalità di lezione
function LessonTypeFeatureCard({ icon, title, desc, children }) {
  return (
    <Paper withBorder p="md" radius="lg" shadow="sm" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Group mb="xs">
        <ThemeIcon size={40} radius="md" variant="light" color="blue">
          {icon}
        </ThemeIcon>
        <Text fw={700}>{title}</Text>
      </Group>
      
      <Text size="sm" c="dimmed" mb="md" style={{ flexGrow: 1 }}>{desc}</Text>
      
      {children}
    </Paper>
  );
}


function LessonTypeCard({ icon, title, desc }) {
  const bookingUrl = `${CAL_TUTORING_LINK}?type=${encodeURIComponent(title)}`;

  return (
    <LessonTypeFeatureCard icon={icon} title={title} desc={desc}>
      <Button 
        component="a" 
        href={bookingUrl} 
        target="_blank" 
        variant="subtle" 
        size="xs" 
        rightSection={<IconChevronRight size={14} />}
      >
        Book this service
      </Button>
    </LessonTypeFeatureCard>
  );
}

export function AvailabilitySection({ onSlotSelect }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);

      const start = format(currentWeekStart, 'yyyy-MM-dd');
      const end = format(addDays(currentWeekStart, 7), 'yyyy-MM-dd');

      try {
        

        const params = new URLSearchParams({ start, end });
        const res = await fetch(`${RAILWAY_BACKEND_LINK}/api/cal/availability?${params.toString()}`);


        const json = await res.json();
        setAvailabilityData(json.slots || []);
      } catch (err) {
        console.error("Errore fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [currentWeekStart]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)), [currentWeekStart]);
  
  // Orari fissi (puoi renderli dinamici o tenerli fissi per coerenza visiva)
  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  console.log("Dati ricevuti da /availability:", availabilityData);


  return (
    <section className="section-box">
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={800}>Weekly Schedule</Text>
        <Group gap="xs" style={{ opacity: loading ? 0.5 : 1 }}>
          <ActionIcon size="lg" variant="default" disabled={loading} onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}><IconChevronLeft /></ActionIcon>
          <Badge size="lg" variant="outline">{format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d')}</Badge>
          <ActionIcon size="lg" variant="default" onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}><IconChevronRight /></ActionIcon>
        </Group>
      </Group>

      <SimpleGrid cols={8} spacing="xs" style={{ alignItems: 'flex-start' }}>
        <Stack gap="xs" pt={50}>
          {timeSlots.map(time => <Text key={time} ta="right" size="sm" c="dimmed" fw={600} h={60} pt={20}>{time}</Text>)}
        </Stack>

        {weekDays.map(day => (
          <Stack key={day} gap="xs">
            <Paper className="header-paper" p="xs" ta="center" withBorder radius="md" bg={isToday(day) ? 'blue.0' : undefined}>
              <Text size="xs" tt="uppercase" c="dimmed">{format(day, 'EEE')}</Text>
              <Text fw={700} size="lg">{format(day, 'dd')}</Text>
            </Paper>


            {timeSlots.map(time => {
              // 1. Estrai l'ora dal tuo array (es. "11:00" -> 11)
              const targetHour = parseInt(time.split(':')[0], 10);

              // 2. Cerca lo slot confrontando l'ora LOCALE del browser
              const slot = availabilityData.find(s => {
                // new Date() converte automaticamente la stringa UTC in ora italiana
                const d = new Date(s.start); 
                
                // getHours() restituisce l'ora nel fuso orario del PC (es. 09:00 UTC -> 11:00 locale)
                return isSameDay(d, day) && d.getHours() === targetHour;
              });

              const isAvailable = !!slot;

              return (
                <Box key={time} style={{ height: '60px', position: 'relative' }}>
                  <Box 
                    className={`slot-card ${isAvailable ? 'available' : 'unavailable'}`}
                    onClick={() => isAvailable && onSlotSelect(slot)}
                  >
                    {isAvailable ? (
                      <>
                        <IconCalendarEvent size={20} className="status-icon" />
                        <div className="hover-content">
                          <IconBook size={20} />
                          <Text size="xs" fw={700}>BOOK IT</Text>
                        </div>
                      </>
                    ) : (
                      <div className="unavailable-content">
                        <IconX size={16} stroke={3} />
                      </div>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        ))}
      </SimpleGrid>

      <style>{`
       /* Header dei giorni: Look più pulito e "floating" */
        .header-paper {
          transition: all 0.3s ease;
          border-bottom: 2px solid var(--mantine-color-blue-2);
          background-color: var(--mantine-color-white);
        }
        .header-paper:hover {
          transform: translateY(-2px);
          box-shadow: var(--mantine-shadow-sm);
        }

        /* Stile base slot */
        .slot-card { 
          height: 52px; width: 100%; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
          margin-bottom: 8px;
          border: 1px solid transparent;
        }

        /* Slot Occupato: Feedback visivo di "Chiuso" */
        .slot-card.unavailable { 
          background-color: var(--mantine-color-gray-0); 
          border: 1px solid var(--mantine-color-gray-2);
          color: var(--mantine-color-gray-4); 
          cursor: not-allowed;
          position: relative;
          /* Pattern a righe diagonali per dare l'idea di "area non disponibile" */
          background-image: repeating-linear-gradient(
            45deg,
            var(--mantine-color-gray-0),
            var(--mantine-color-gray-0) 10px,
            var(--mantine-color-gray-1) 10px,
            var(--mantine-color-gray-1) 20px
          );
        }

        /* Icona X centrata e ben visibile */
        .unavailable-content {
          opacity: 0.5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Effetto al passaggio del mouse sugli slot occupati (opzionale) */
        .slot-card.unavailable:hover {
          background-color: var(--mantine-color-gray-1);
          border-color: var(--mantine-color-gray-3);
        }

        /* Stile Slot Disponibile: Moderno ed Energetico */
        .slot-card.available { 
          background-color: var(--mantine-color-blue-0); 
          border: 1px solid var(--mantine-color-blue-3);
          color: var(--mantine-color-blue-7);
        }
        .slot-card.available:hover { 
          background-color: var(--mantine-color-blue-6); 
          color: var(--mantine-color-white); 
          transform: scale(1.05); 
          box-shadow: 0 8px 16px -4px rgba(33, 154, 240, 0.4);
          z-index: 10;
        }

        /* Gestione icone */
        .hover-content { 
          display: none; 
          flex-direction: column; 
          align-items: center; 
          gap: 2px; 
          font-weight: 700;
        }

        .slot-card.available:hover .status-icon { display: none; }
        .slot-card.available:hover .hover-content { display: flex; }
      `}</style>
    </section>
  );
}

export function PricingSection({ onDurationSelect }) {
  const { t } = useTranslation();

  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#f8f9fa' }}>
      <Container size="xl">
        <Title order={2} ta="center" mb={50}>Flexible Booking & Payments</Title>

        {/* 1. Pricing Grid */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mb={60}>
          <Card withBorder radius="lg" p="xl" shadow="sm">
            <Text fz="lg" fw={700}>Pay-as-you-go</Text>
            <Text fz={40} fw={900} my="md">€20<Text span size="sm" c="dimmed">/hour</Text></Text>
            <Stack gap="xs">
              {/* Modifica qui: richiama la funzione passata come prop */}
              <Button size="md" variant="light" onClick={() => onDurationSelect('1h')}>
                Book 1 Hour
              </Button>
              <Button size="md" variant="outline" onClick={() => onDurationSelect('2h')}>
                Book 2 Hours
              </Button>
            </Stack>
          </Card>
          
          <Card withBorder radius="lg" p="xl" bg="blue.0">
            <Badge color="blue" mb="sm">BEST VALUE</Badge>
            <Text fz="lg" fw={700}>Lesson Bundles</Text>
            <Stack gap={10} my="lg">
              <Text>3 Lessons: <Text span fw={700}>€50</Text></Text>
              <Text>5 Lessons: <Text span fw={700}>€80</Text></Text>
              <Text>10 Lessons: <Text span fw={700}>€150</Text></Text>
            </Stack>
            <Button size="md" color="blue" fullWidth>Contact for Bundle</Button>
          </Card>

          <Card withBorder radius="lg" p="xl">
            <Text fz="lg" fw={700}>Policies</Text>
            <List spacing="xs" size="sm" mt="md" center icon={<IconCheck size={16} color="teal"/>}>
              <List.Item>Refunds: Never</List.Item>
              <List.Item>Cancellation: 2 biz days notice</List.Item>
            </List>
          </Card>
        </SimpleGrid>
        <br/>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {/* Option 1 - Instant Payment */}
          <Group p="md" bg="white" style={{ borderRadius: 8, border: '1px solid var(--mantine-color-blue-1)' }}>
            <ThemeIcon size="xl" radius="xl" variant="light" color="green">
              <IconBolt size={22} />
            </ThemeIcon>
            <Stack gap={0} flex={1}>
              <Text size="sm" fw={700}>Instant Payment</Text>
              <Text size="xs" c="dimmed">Fast and secure via Stripe</Text>
            </Stack>
            <Group gap={8}>
              <Tooltip label="Credit Card"><IconCreditCard size={18} color="var(--mantine-color-blue-5)" /></Tooltip>
              <Tooltip label="Apple Pay"><IconBrandAppleArcade size={18} color="var(--mantine-color-blue-5)" /></Tooltip>
              <Tooltip label="Google Pay"><IconBrandGoogle size={18} color="var(--mantine-color-blue-5)" /></Tooltip>
            </Group>
          </Group>

          {/* Option 2 - Deferred Payment */}
          <Group p="md" bg="white" style={{ borderRadius: 8, border: '1px solid var(--mantine-color-blue-1)' }}>
            <ThemeIcon size="xl" radius="xl" variant="light" color="orange">
              <IconClock size={22} />
            </ThemeIcon>
            <Stack gap={0} flex={1}>
              <Text size="sm" fw={700}>Deferred Payment</Text>
              <Text size="xs" c="dimmed">Pay later via Bank Transfer/PayPal</Text>
            </Stack>
            <Group gap={8}>
              <Tooltip label="Bank Transfer"><IconBuildingBank size={18} color="var(--mantine-color-blue-5)" /></Tooltip>
              <Tooltip label="PayPal"><IconBrandPaypal size={18} color="var(--mantine-color-blue-5)" /></Tooltip>
            </Group>
          </Group>
        </SimpleGrid>

        <br/>
        <br/>

        {/* 2. Payment Board */}
        <Paper withBorder p="xl" radius="xl" shadow="sm">
          <Tabs defaultValue="stripe" color="blue">
            <Tabs.List mb="lg">
              <Tabs.Tab value="stripe" leftSection={<IconCreditCard size={16} />}>Stripe</Tabs.Tab>
              <Tabs.Tab value="paypal" leftSection={<IconBrandPaypal size={16} />}>PayPal</Tabs.Tab>
              <Tabs.Tab value="bank" leftSection={<IconBuildingBank size={16} />}>Bank Transfer</Tabs.Tab>
            </Tabs.List>

            {/* STRIPE TAB */}
            <Tabs.Panel value="stripe" pt="xs">
              <Paper bg="gray.0" p="xl" radius="md" withBorder>
                <Text fw={700} mb={4}>Instant Payment via Stripe</Text>
                <Text size="sm" c="dimmed" mb="lg">Secure and tracked transaction. Click below to proceed.</Text>
                <Button color="blue" size="md" leftSection={<IconCreditCard size={18} />}>Proceed to Payment</Button>
              </Paper>
            </Tabs.Panel>

            {/* PAYPAL TAB */}
            <Tabs.Panel value="paypal" pt="xs">
              <PaymentDetailCard 
                icon={<IconBrandPaypal size={30} color="#0070BA" />}
                title="PayPal"
                detail="giuseppe.pedone@email.com"
                action="go at PayPal"
                link="https://paypal.me/giuseppe"
              />
            </Tabs.Panel>

            {/* BANK TRANSFER TAB */}
            <Tabs.Panel value="bank" pt="xs">
              <BankDetailCard 
                bankName="BPER Banca"
                beneficiary="Giuseppe Pedone"
                iban="IT00 0000 0000 0000 0000 0000 000"
                causale="Tutoring - 25/06/2026 #BILLCODE"
              />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Container>
    </section>
  );
}


// Per PayPal e altri semplici
function PaymentDetailCard({ icon, title, detail, action, link }) {
  return (
    <Card withBorder radius="md" p="md">
      <Group mb="xs">
        {icon}
        <Text fw={700}>{title}</Text>
      </Group>
      <Text size="sm" c="dimmed" mb="sm">{detail}</Text>
      <Button variant="subtle" size="xs" rightSection={<IconChevronRight size={14}/>} component="a" href={link} target="_blank">
        {action}
      </Button>
    </Card>
  );
}

// Specifico per il Bonifico
function BankDetailCard({ bankName, beneficiary, iban, causale }) {
  return (
    <Card withBorder radius="md" p="md" bg="blue.0" style={{borderColor: 'var(--mantine-color-blue-2)'}}>
      <Group mb="sm"><IconBuildingBank size={30} color="#228be6" /><Text fw={700}>Bank Transfer ({bankName})</Text></Group>
      <Stack gap={4} mt="xs">
        <BankField label="Beneficiary" value={beneficiary} />
        <BankField label="IBAN" value={iban} />
        <BankField label="Causale" value={causale} />
      </Stack>
    </Card>
  );
}

function BankField({ label, value }) {
  return (
    <Group justify="space-between" p={6} bg="white" style={{borderRadius: 4}}>
      <Stack gap={0}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{label}</Text>
        <Text size="sm" fw={600}>{value}</Text>
      </Stack>
      <CopyButton value={value}>
        {({ copied, copy }) => (
          <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
            <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
              {/* Utilizza IconCheck per l'avvenuta copia invece di un inesistente IconCopied */}
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
}




const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function MaterialsSection({ lessonsTree }) {
  const [catSearchQuery, setCatSearchQuery] = useState('');     // Per la sezione Categorie
  const [downloadSearchQuery, setDownloadSearchQuery] = useState(''); // Per la sezione Download
  const [selectedPaths, setSelectedPaths] = useState(new Set());
  
  
  const [activeCategoryFilters, setActiveCategoryFilters] = useState([]);
  const [openedCategories, setOpenedCategories] = useState({});
  const categoryIcons = {
    'GUIDES': <IconBook size={20} />,
    'HOW-TO': <IconHelp size={20} />,
    'MANUALS': <IconFileText size={20} />,
    'CODE-SNIPPETS': <IconCode size={20} />,
    'SCRIPTS': <IconTerminal size={20} />,
    'EXAMPLES': <IconBox size={20} />,
    'REFERENCES': <IconBookmark size={20} />,
    'KNOWLEDGE': <IconBulb size={20} />,
    'DEFAULT': <IconFolder size={20} />
  };

  const toggleSelection = useCallback((item, isSelected) => {
    setSelectedPaths(prev => {
      // 1. Crea un nuovo Set basato sul precedente
      const next = new Set(prev);
      
      // 2. Logica: se è una cartella, ricorsione; se è un file, aggiungi/rimuovi
      const walk = (n) => {
        if (n.type === 'file') {
          isSelected ? next.add(n.path) : next.delete(n.path);
        } else if (n.children) {
          n.children.forEach(walk);
        }
      };
      
      walk(item);
      return next; // 3. Ritorna il nuovo riferimento: React farà il re-render
    });
  }, []);

  const [openedSubjects, setOpenedSubjects] = useState({});

  const toggleSubject = (subjectName) => {
    setOpenedSubjects(prev => ({
      ...prev,
      [subjectName]: !prev[subjectName]
    }));
  };

  
 
  const toggleCategory = (catName) => {
    setOpenedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const toggleCategoryFilter = (catName) => {
    setActiveCategoryFilters(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  // Calcolo delle risorse per categoria
  const crossCategoryResources = useMemo(() => {
    const targetCategories = ['KNOWLEDGE', 'GUIDES', 'HOW-TO', 'MANUALS', 'CODE-SNIPPETS', 'SCRIPTS', 'EXAMPLES', 'APPLICATIONS', 'PROJECTS', 'TUTORIALS', 'REFERENCES', 'MULTIMEDIA'];
    const result = {};
    const traverse = (node, subject, pathArr = []) => {
      if (node.type === 'folder' && targetCategories.includes(node.name.toUpperCase())) {
        const catName = node.name.toUpperCase();
        if (!result[catName]) result[catName] = [];
        node.children?.forEach(child => {
          result[catName].push({ ...child, subject, pathInfo: [...pathArr, node.name].join(' > ') });
        });
      }
      node.children?.forEach(child => traverse(child, subject, [...pathArr, node.name]));
    };
    lessonsTree?.children?.forEach(s => traverse(s, s.name, [s.name]));
    return result;
  }, [lessonsTree]);

  // Logica di filtraggio avanzato (Filtri + Ricerca)
  const filteredCategories = useMemo(() => {
    const query = catSearchQuery.toLowerCase();
    return Object.entries(crossCategoryResources)
      .filter(([catName, items]) => {
        const matchesCategory = activeCategoryFilters.length === 0 || activeCategoryFilters.includes(catName);
        const matchesText = query === '' || catName.toLowerCase().includes(query) || items.some(i => i.name.toLowerCase().includes(query));
        return matchesCategory && matchesText;
      })
      .map(([catName, items]) => {
        const filteredItems = query ? items.filter(i => i.name.toLowerCase().includes(query)) : items;
        const totalSize = filteredItems.reduce((acc, curr) => acc + (curr.size || 0), 0);
        const extensions = Array.from(new Set(filteredItems.map(i => i.name.split('.').pop().toLowerCase())));
        return { catName, items: filteredItems, totalSize, extensions };
      });
  }, [crossCategoryResources, catSearchQuery, activeCategoryFilters]);




  const processedTree = useMemo(() => {
    if (!lessonsTree) return null;

    const decorate = (node) => {
      // 1. Calcola le stats (il lavoro pesante avviene qui una sola volta)
      const stats = getFolderStats(node); 
      
      // 2. Crea un nuovo oggetto con le stats incluse
      const decorated = { ...node, stats };
      
      // 3. Decora ricorsivamente i figli
      if (node.children) {
        decorated.children = node.children.map(decorate);
      }
      return decorated;
    };
    
    return { 
      ...lessonsTree, 
      children: lessonsTree.children?.map(decorate) 
    };
  }, [lessonsTree]);


  useEffect(() => {
    // Se c'è una ricerca attiva, apriamo tutte le categorie che hanno risultati
    if (catSearchQuery.length > 0) {
      const newOpenedState = {};
      filteredCategories.forEach(cat => {
        newOpenedState[cat.catName] = true; // Forza l'apertura
      });
      setOpenedCategories(newOpenedState);
    } else {
      // Se la ricerca è vuota, chiudiamo tutto (o resetta come preferisci)
      setOpenedCategories({});
    }
  }, [filteredCategories, catSearchQuery]);




  const CompactFileRow = ({ file, selectedPaths = new Set(), onToggle }) => {
    const isChecked = selectedPaths.has(file.path);

    return (
      <Box 
        p="xs" 
        mb="xs"
        style={{ 
          border: '1px solid #f1f3f5',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}
      >
        {/* RIGA 1: Nome file e Azioni */}
        <Group justify="space-between" mb={4} wrap="nowrap">
          <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <Checkbox 
                size="xs" 
                // Usiamo il valore calcolato
                checked={isChecked} 
                onChange={(e) => {
                  // Chiamiamo la funzione passata dal padre
                  onToggle(file, e.currentTarget.checked);
                }} 
              />
            <Badge size="xs" variant="filled" color="blue" w={50}>{file.name.split('.').pop().toUpperCase()}</Badge>
            <Text fw={600} size="sm" truncate>{file.name}</Text>
          </Group>
          
          <ActionPanel item={file} type="file" />
        </Group>

        {/* RIGA 2: Percorso e Dimensione */}
        <Group justify="space-between" mt={4}>
          <Text size="xs" c="dimmed" truncate style={{ flex: 1 }}>
            <IconFolder size={12} style={{ marginRight: 4 }} />
            {file.topicPath}
          </Text>
          <Badge size="xs" variant="light" color="gray">
            {formatSize(file.size)}
          </Badge>
        </Group>
      </Box>
    );
  };


  // Logica di ricerca flatMap aggiornata
  const allFiles = useMemo(() => {
    let files = [];
    const traverse = (node, subject, pathArr = []) => {
      if (node.type === 'file') {
        files.push({ ...node, subject, topicPath: pathArr.join(' > ') });
      } else if (node.children) {
        node.children.forEach(child => traverse(child, subject, [...pathArr, node.name]));
      }
    };
    lessonsTree?.children?.forEach(s => traverse(s, s.name));
    return files;
  }, [lessonsTree]);

  const groupedResults = useMemo(() => {
    if (!downloadSearchQuery) return {};
    return allFiles
      .filter(f => f.name.toLowerCase().includes(downloadSearchQuery.toLowerCase()))
      .reduce((acc, file) => {
        const ext = file.name.split('.').pop().toUpperCase();
        if (!acc[ext]) acc[ext] = [];
        acc[ext].push(file);
        return acc;
      }, {});
  }, [downloadSearchQuery, allFiles]);

  return (
    <section style={{ padding: '20px 0', maxWidth: '1000px', margin: '0 auto' }}>


      <Paper withBorder p="xl" radius="md" mb="xl">
        <Title order={2} mb="xs">
              <IconSearch size={28} style={{ verticalAlign: 'middle', marginRight: 10 }} />
              Explore, Search and Download free Materials based on Categories
        </Title>
        <Stack gap="md">
          <TextInput
            placeholder="Search materials based on categories..."
            size="lg" radius="md" leftSection={<IconSearch size={20} />}
            value={catSearchQuery} onChange={(e) => setCatSearchQuery(e.target.value.trimStart())}
          />
          <Group gap="xs">
            <Text size="sm" c="dimmed">filter by:</Text>
            {Object.keys(crossCategoryResources).map(cat => (
              <Chip key={cat} checked={activeCategoryFilters.includes(cat)} onChange={() => toggleCategoryFilter(cat)} size="xs">
                {cat}
              </Chip>
            ))}
          </Group>
        </Stack>
      </Paper>

      {/* Main Categories Display */}
      <Stack gap="md">
        {filteredCategories.map(({ catName, items, totalSize, extensions }) => {
          const Icon = categoryIcons[catName] || categoryIcons['DEFAULT'];
          return (
            <Box key={catName} style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden' }}>
              <Group p="md" onClick={() => toggleCategory(catName)} style={{ cursor: 'pointer' }} justify="space-between">
                <Group>
                  <Box c="blue">{Icon}</Box>
                  <Stack gap={0}>
                    <Title order={4} tt="uppercase">{catName}</Title>
                    <Group gap="xs">
                      <Badge variant="light" size="sm">{items.length} items</Badge>
                      <Text size="xs" c="dimmed">{formatSize(totalSize)}</Text>
                      {extensions.slice(0, 3).map(ext => <Badge key={ext} size="xs" variant="outline">{ext.toUpperCase()}</Badge>)}
                    </Group>
                  </Stack>
                </Group>
                <IconChevronRight size={16} style={{ transform: openedCategories[catName] ? 'rotate(90deg)' : 'none' }} />
              </Group>
              
              <Collapse in={openedCategories[catName]}>
                <Box p="md" style={{ borderTop: '1px solid #eee' }}>
                  <Stack gap={5}>
                    {items.map(item => (
                      item.type === 'folder' 
                        ? <DirectoryNode key={item.path} node={item} selectedPaths={selectedPaths} onToggle={toggleSelection} />
                        : <FileItem key={item.path} file={item} subject={item.subject} topic={item.pathInfo} selectedPaths={selectedPaths} onToggle={toggleSelection} />
                    ))}
                  </Stack>
                </Box>
              </Collapse>
          </Box>
          );
        })}
      </Stack>
      
      <br/>
      <br/>
      <Paper withBorder p="xl" radius="md" shadow="sm" bg="var(--mantine-color-gray-0)">
        <Stack gap="md">
          {/* Header della sezione */}
          <Box>
            <Title order={2} mb="xs">
              <IconDownload size={28} style={{ verticalAlign: 'middle', marginRight: 10 }} />
              Search and Download files
            </Title>
            <Text c="dimmed" size="sm">
              Find istantly your resources and download them through this platform.
            </Text>
          </Box>

          {/* Input di Ricerca */}
          <TextInput
            placeholder="Search all files..."
            size="lg" 
            radius="md" 
            leftSection={<IconSearch size={20} />}
            value={downloadSearchQuery} 
            onChange={(e) => setDownloadSearchQuery(e.target.value.trimStart())}
            styles={{ input: { backgroundColor: '#fff', border: '1px solid #dee2e6' } }}
          />

          <br/>

          {/* Area Risultati (Condizionale) */}
          <Collapse in={!!downloadSearchQuery}>
            <Paper withBorder p="xl" radius="md" shadow="lg" bg="white" mt="md">
              <Group gap="xs" mb="xs">
                <ThemeIcon variant="light" color="blue" size="md" radius="sm">
                  <IconSearch size={18} />
                </ThemeIcon>
                <Title order={3} fw={600}>
                  Results for <Text span c="blue" inherit>"{downloadSearchQuery}"</Text>
                </Title>
              </Group>

              {/* 1. VISUALE RAPIDA: Tutti i risultati unificati */}
              <Box mb="xl">
                <Text fw={600} mb="xs" size="sm" c="dimmed" tt="uppercase">View Results (All files)</Text>
                <Stack gap={2}>
                  {allFiles
                    .filter(f => f.name.toLowerCase().includes(downloadSearchQuery.toLowerCase()))
                    .slice(0, 5) // Mostra solo i primi 5 per rapidità
                    .map(f => (
                      <CompactFileRow key={f.path} file={f} selectedPaths={selectedPaths} onToggle={toggleSelection}/>
                    ))}
                </Stack>
              </Box>
              
              <Box mb="xl">
                <Text fw={600} mb="xs" size="sm" c="dimmed" tt="uppercase">All files by category</Text>
                 <Stack gap="lg">
                  {Object.entries(groupedResults).map(([ext, files]) => (
                    <Box key={ext}>
                      <Badge size="md" mb="xs" color="blue" variant="light">
                        {ext} Files ({files.length})
                      </Badge>
                      <Stack gap={2}>
                        {files.map(f => (
                          <CompactFileRow key={f.path} file={f} selectedPaths={selectedPaths} onToggle={toggleSelection}/>
                        ))}
                      </Stack>
                    </Box>
                  ))} 
                </Stack>
              </Box>
              {/* 2. CATEGORIZZAZIONE DETTAGLIATA (Come volevi) */}
             
            </Paper>
          </Collapse>
        </Stack>
      </Paper>


      {/* Pulsante Download */}
      <Affix position={{ bottom: 30, right: 30 }}>
        <Transition transition="slide-up" mounted={selectedPaths.size > 0}>
          {(styles) => (
            <Button style={styles} size="lg" radius="xl" color="blue" shadow="xl" leftSection={<IconDownload size={20} />}
              onClick={() => alert(`Download ${selectedPaths.size} file!`)}>
              Download {selectedPaths.size} {selectedPaths.size === 1 ? 'file' : 'files'}
            </Button>
          )}
        </Transition>
      </Affix>
    </section>
  );
}



const ActionPanel = ({ item, type }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + item.path);
  };

  return (
    <Group gap={4}>
      <ActionIcon variant="subtle" color="gray" title="Copy Link" onClick={handleCopy}>
        <IconLink size={16} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="blue" title="Download Raw" onClick={() => console.log('Raw:', item.path)}>
        <IconDownload size={16} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="green" title="Download ZIP" onClick={() => console.log('ZIP:', item.path)}>
        <IconFileZip size={16} />
      </ActionIcon>
    </Group>
  );
};


const getStatsForNode = (node) => {
  // Se è un file, le sue stats sono fisse
  if (node.type === 'file') {
    return {
      count: 1,
      sizeBytes: node.size || 0,
      extensions: [node.name.split('.').pop().toLowerCase()]
    };
  }

  // Se è una cartella, aggrega i dati dei figli diretti
  if (node.children) {
    const childrenStats = node.children.map(child => getStatsForNode(child));
    
    return {
      count: childrenStats.reduce((acc, s) => acc + s.count, 0),
      sizeBytes: childrenStats.reduce((acc, s) => acc + s.sizeBytes, 0),
      extensions: Array.from(new Set(childrenStats.flatMap(s => s.extensions)))
    };
  }

  return { count: 0, sizeBytes: 0, extensions: [] };
};


const DirectoryNode = React.memo(({ node, selectedPaths, onToggle }) => {
  const [open, setOpen] = useState(false);
  const stats = useMemo(() => getStatsForNode(node), [node]);
  useEffect(() => {
    if (node.forceOpen) setOpen(true);
  }, [node.forceOpen]);

  return (
    <Box>
      <Group p="xs" justify="space-between">
        <Group 
          style={{ cursor: 'pointer', flex: 1 }} 
          onClick={() => setOpen(!open)}
        >
          <Checkbox 
            checked={!!selectedPaths?.has(node.path)} 
            onChange={(e) => onToggle(node, e.currentTarget.checked)}
            onClick={(e) => e.stopPropagation()} 
          />
          <Box>
            <Text size="sm">{node.name}</Text>
            <Text size="xs" c="dimmed">
              {stats.count} file • {formatSize(stats.sizeBytes)}
            </Text>
          </Box>
        </Group>

        
        <ActionPanel item={node} type="folder" />
      </Group>

      <Collapse in={open}>
        <Stack pl="lg">
          {open && node.children?.map(child => (
            child.type === 'folder' 
              ? <DirectoryNode 
                  key={child.path} 
                  node={child} 
                  selectedPaths={selectedPaths} 
                  onToggle={onToggle} 
                />
              : <FileItem 
                  key={child.path} 
                  file={child} 
                  selectedPaths={selectedPaths} 
                  onToggle={onToggle} 
                />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
});

const FileItem = React.memo(({ file, selectedPaths, onToggle }) => {
  return (
    <Group p="xs" justify="space-between">
      <Group p="xs">
        <Checkbox checked={!!selectedPaths?.has(file.path)} onChange={(e) => onToggle(file, e.currentTarget.checked)} />
        <Text size="sm">{file.name}</Text>
        
        <Badge size="xs">{formatSize(file.size)}</Badge>
      </Group>
      <ActionPanel item={file} type="file" />
    </Group>
  );
});


/*
=====================================================
AUTO DIRECTORY TREE GENERATION
=====================================================

Create generate-tree.js

-----------------------------------------------------

import fs from 'fs';
import path from 'path';

function buildTree(dirPath) {
  const stats = fs.statSync(dirPath);

  if (stats.isFile()) {
    return {
      name: path.basename(dirPath),
      type: 'file',
      path: dirPath.replace('public', ''),
    };
  }

  return {
    name: path.basename(dirPath),
    type: 'folder',
    children: fs
      .readdirSync(dirPath)
      .map(child => buildTree(path.join(dirPath, child))),
  };
}

const tree = buildTree('./public/lessons');

fs.writeFileSync(
  './src/data/lessons-tree.json',
  JSON.stringify(tree, null, 2)
);

-----------------------------------------------------

Then import JSON dynamically:

import lessonsTree from '../data/lessons-tree.json';

=====================================================
GITHUB PAGES SUPPORT
=====================================================

This component works perfectly on GitHub Pages because:

- all assets are static
- materials are downloadable
- no backend required
- tree generated at build time

=====================================================
CAL.COM API INTEGRATION
=====================================================

The Lessons page is designed to integrate directly with Cal.com APIs.

GOALS:

- allow students to book lessons
- choose:
  - subject
  - topic
  - duration
  - date
  - time slot
- automatically sync availability
- automatically mark busy slots
- allow real-time scheduling
- receive booking notifications
- optionally populate external files/databases

=====================================================
SUGGESTED FLOW
=====================================================

Student opens Lessons page
        ↓
Chooses:

- Subject
- Topic
- Duration
- Time slot

        ↓
Lessons page calls Cal.com API
        ↓
Cal.com checks availability
        ↓
Available slots shown on calendar
        ↓
Student books lesson
        ↓
Cal.com:

- sends notification
- updates Google Calendar
- blocks occupied slots
- optionally triggers webhook

=====================================================
RECOMMENDED CAL.COM FEATURES
=====================================================

- Event Types
- API Routing Forms
- Availability API
- Bookings API
- Webhooks
- Google Calendar Sync
- Outlook Sync
- Zoom / Meet Integration

=====================================================
CALENDAR SYNCHRONIZATION
=====================================================

The availability section should:

1. fetch free/busy slots from Cal.com
2. render them dynamically
3. disable occupied slots
4. update automatically

=====================================================
EXAMPLE API FLOW
=====================================================

GET availability:

fetch('/api/cal/availability')

POST booking:

fetch('/api/cal/book', {
  method: 'POST',
  body: JSON.stringify({
    subject,
    topic,
    date,
    duration,
    student,
  })
})

=====================================================
WEBHOOKS
=====================================================

Recommended:

Cal.com → Webhook → Your backend

Possible actions:

- save booking in JSON
- save booking in database
- send email
- notify Telegram bot
- generate lesson ID
- attach materials
- generate invoice

=====================================================
DIRECTORY TREE STRUCTURE
=====================================================

The page is filesystem-driven.

You provide:

Materials/
└── Subject/
    └── Topic/
        ├── Material/
        │   ├── Tutorials/
        │   ├── Examples/
        │   ├── Projects/
        │   ├── Scripts/
        │   └── Guides/
        │
        └── License/
            └── LICENSE.md

The React component dynamically renders:

- subjects
- topics
- materials
- downloadable files
- licenses

WITHOUT hardcoding folder names.

=====================================================
DIRECTORY TREE FEATURES
=====================================================

The materials explorer supports:

- collapsible folders
- nested navigation
- recursive rendering
- file downloads
- modern explorer UI
- unlimited depth
- automatic updates
- GitHub Pages compatibility

=====================================================
AUTO TREE GENERATION
=====================================================

Filesystem changes:

- add folder
- rename folder
- delete file
- add topic
- add material

ONLY require regenerating:

lessons-tree.json

No React code modifications needed.

=====================================================
AVAILABILITY CALENDAR
=====================================================

The calendar section is designed to:

- display available slots
- display busy slots
- synchronize with Cal.com
- synchronize with Google Calendar
- update in real-time
- disable unavailable slots
- allow direct booking

=====================================================
BOOKING SECTION IMPROVEMENTS
=====================================================

Recommended future UI:

- embedded Cal.com widget
- subject selector
- topic selector
- lesson type selector
- duration selector
- real calendar grid
- timezone support
- recurring lessons
- package booking
- payment integration
- Stripe checkout

=====================================================
GITHUB PAGES SUPPORT
=====================================================

This architecture works on GitHub Pages because:

- lessons/materials are static
- directory tree is pre-generated
- React only renders JSON
- downloadable files are public assets

Dynamic features are delegated to:

- Cal.com APIs
- serverless functions
- webhooks

=====================================================
RECOMMENDED ARCHITECTURE
=====================================================

React Frontend
        ↓
Lessons Explorer
        ↓
Cal.com APIs
        ↓
Availability + Booking
        ↓
Webhook / Serverless Backend
        ↓
Notifications + Storage

=====================================================
ROUTING EXAMPLE
=====================================================

<Route path="/activities" element={<Activities />} />
<Route path="/activities/lessons" element={<Lessons />} />

=====================================================
*/
