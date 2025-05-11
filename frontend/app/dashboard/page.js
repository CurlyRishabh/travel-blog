'use client';

import { useState, useEffect } from 'react';
import {
  AppShell,
  Text,
  Burger,
  useMantineTheme,
  Avatar,
  Group,
  Button,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  MultiSelect,
  FileInput,
  Stack,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import BlogDashboard from './components/BlogDashboard';
import { notifications } from '@mantine/notifications';


export default function DashboardPage() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editProfileModalOpened, { open: openEditProfileModal, close: closeEditProfileModal }] = useDisclosure(false);
  const [blogs, setBlogs] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    profile_picture: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const get_user = async () => {
      const response = await fetch('http://localhost:3001/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data);
      setUserProfile(data);
    }
    if (token) {
      get_user();
    }
  }, []);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      destination: '',
      total_cost: 0,
      tags: [],
      image: null,
    },
    validate: {
      title: (value) => (value.length < 2 ? 'Title must have at least 2 characters' : null),
      description: (value) => (value.length < 10 ? 'Description must have at least 10 characters' : null),
      destination: (value) => (value.length < 2 ? 'Destination is required' : null),
      total_cost: (value) => (value < 0 ? 'Cost cannot be negative' : null),
    },
  });

  const editProfileForm = useForm({
    initialValues: {
      name: '',
      username: '',
      profile_picture: null,
    },
    validate: {
      name: (value) => (value && value.length < 2 ? 'Name must have at least 2 characters' : null),
      username: (value) => (value && value.length < 2 ? 'Username must have at least 2 characters' : null),
    },
  });

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem('token');

    // Create a new FormData instance
    const form = new FormData();

    // Append all the fields
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('destination', formData.destination);
    form.append('total_cost', formData.total_cost);
    form.append('image', formData.image); // This should be the File object

    // If tags is an array, stringify it
    form.append('tags', JSON.stringify(formData.tags));

    try {
      const response = await fetch('http://localhost:3001/blog/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header - it will be automatically set with boundary
        },
        body: form
      });

      if (!response.ok) {
        throw new Error('Failed to create blog');
      }
      notifications.show({
        position: 'top-right',
        title: 'Success',
        message: 'Blog created successfully',
        color: 'green',
      });
      closeModal();

      const data = await response.json();
      // Handle success
    } catch (error) {
      // Handle error
      notifications.show({
        position: 'top-right',
        title: 'Error',
        message: 'Failed to create blog',
        color: 'red',
      });
      console.error('Error creating blog:', error);
    }
  };

  const handleEditProfile = async (formData) => {
    const token = localStorage.getItem('token');
    const form = new FormData();

    if (formData.name) form.append('name', formData.name);
    if (formData.username) form.append('username', formData.username);
    if (formData.profile_picture) form.append('profile_picture', formData.profile_picture);

    try {
      const response = await fetch('http://localhost:3001/auth/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUserProfile(data);
      closeEditProfileModal();
      notifications.show({
        position: 'top-right',
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        position: 'top-right',
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red'
      });
    }
  };

  useEffect(() => {
    if (editProfileModalOpened && userProfile) {
      editProfileForm.setValues({
        name: userProfile.name || '',
        username: userProfile.username || '',
      });
    }
  }, [editProfileModalOpened, userProfile]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group className='flex items-center gap-2 cursor-pointer' onClick={openEditProfileModal}>
              <Avatar
                className='border-2 border-gray-300 rounded-full'
                src={`http://localhost:3001/${userProfile.profile_picture}`}
                radius="xl"
                size="md"
              />
              <Text fw={500}>{userProfile.name || userProfile.username}</Text>
            </Group>
          </Group>
          <Title order={2} mb="lg" ta="center" c="blue.7">
            Travel Blog Explorer
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Button
          fullWidth
          color="blue"
          onClick={openModal}
          mb="xl"
        >
          Add New Blog
        </Button>
      </AppShell.Navbar>

      <AppShell.Main>
        {/* Add Blog Modal */}
        <Modal
          opened={modalOpened}
          onClose={closeModal}
          title="Create New Blog Post"
          size="lg"
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
              <TextInput
                required
                label="Title"
                placeholder="Enter blog title"
                {...form.getInputProps('title')}
              />

              <Textarea
                required
                label="Description"
                placeholder="Enter blog description"
                minRows={4}
                {...form.getInputProps('description')}
              />

              <TextInput
                required
                label="Destination"
                placeholder="Enter destination"
                {...form.getInputProps('destination')}
              />

              <NumberInput
                label="Total Cost"
                placeholder="Enter total cost"
                min={0}
                precision={2}
                {...form.getInputProps('total_cost')}
              />

              <MultiSelect
                label="Tags"
                placeholder="Select tags"
                data={[
                  'Adventure', 'Luxury', 'Budget', 'Family',
                  'Solo', 'Food', 'Culture', 'Nature'
                ]}
                searchable
                {...form.getInputProps('tags')}
              />

              <FileInput
                label="Blog Image"
                placeholder="Upload blog image"
                accept="image/*"
                {...form.getInputProps('image')}
              />

              <Button type="submit" fullWidth mt="md">
                Create Blog Post
              </Button>
            </Stack>
          </form>
        </Modal>
        <Modal
          opened={editProfileModalOpened}
          onClose={closeEditProfileModal}
          title="Edit Profile"
          size="md"
        >
          <form onSubmit={editProfileForm.onSubmit(handleEditProfile)}>
            <Stack spacing="md">
              <TextInput
                label="Name"
                placeholder="Enter your name"
                {...editProfileForm.getInputProps('name')}
              />

              <TextInput
                label="Username"
                placeholder="Enter your username"
                {...editProfileForm.getInputProps('username')}
              />

              <FileInput
                label="Profile Picture"
                placeholder="Upload new profile picture"
                accept="image/*"
                {...editProfileForm.getInputProps('profile_picture')}
              />

              <Button type="submit" fullWidth mt="md">
                Update Profile
              </Button>
            </Stack>
          </form>
        </Modal>
        <BlogDashboard />
      </AppShell.Main>
    </AppShell>
  );
}