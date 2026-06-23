import React, { useState } from "react";
import { Paper, Group, Text, Collapse, Badge, ActionIcon, Stack, Box } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import profileData from "../data/ProfileData";

const ProfileTechnologies = () => {
  const [openedCategories, setOpenedCategories] = useState({});

  const toggleCategory = (category) => {
    setOpenedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <Stack gap="md" mt="xl">
      <Text size="sm" c="dimmed" fw={700}>
        Experienced Technologies
      </Text>
      
      <Stack gap="xs">
        {Object.entries(profileData.technologies).map(([category, items], i) => {
          const isOpened = !!openedCategories[category];
          
          return (
            <Paper key={i} withBorder radius="md" p={0} overflow="hidden">
              <Group 
                justify="space-between" 
                p="md" 
                style={{ cursor: 'pointer' }}
                onClick={() => toggleCategory(category)}
              >
                <Text fw={600} c="blue.6">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <ActionIcon variant="subtle" color="gray" style={{ 
                  transform: isOpened ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s' 
                }}>
                  <IconChevronDown size={18} />
                </ActionIcon>
              </Group>

              <Collapse in={isOpened}>
                <Box p="md" pt={0} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                  <Group gap="xs" mt="md">
                    {items.map((item, j) => (
                      <Badge 
                        key={j} 
                        variant="light" 
                        size="lg" 
                        tt="none"
                        color="blue"
                        style={{ cursor: 'default' }}
                      >
                        {item}
                      </Badge>
                    ))}
                  </Group>
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default ProfileTechnologies;