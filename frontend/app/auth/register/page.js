'use client';

import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  FileInput,
  Text,
  Image,
  Card,
  Grid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { css } from '@emotion/react';
import Link from 'next/link';
import {
  IconUser,
  IconMail,
  IconLock,
  IconSignature,
  IconPhoto,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      name: '',
      userType: 'USER',
      profile_picture: null,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      username: (value) => (value.length < 3 ? 'Username must be at least 3 characters' : null),
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
    },
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      notifications.show({
        position: 'top-right',
        title: 'Success',
        message: 'Registration successful',
        color: 'green',
      });
      window.location.href = '/auth/login';
    } catch (error) {
      notifications.show({
        position: 'top-right',
        title: 'Error',
        message: 'Registration failed',
        color: 'red',
      });
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen m-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <Container >
        <Paper radius="lg" p="xl" withBorder className="form-container w-[600px]" >
          <div className='flex justify-center'>

            <Image src="/register_page.jpg" radius="md" alt="Travel Blog Logo" h={240} />
          </div>
          <Card>

            <Title order={2} className="text-center mb-6"
              sx={{ color: '#1a1b1e', fontSize: '2rem', fontWeight: 600 }}>
              Join Our Travel Community
            </Title>

          </Card>
          <Text color="dimmed" size="sm" align="center" mb="xl">
            Create your account to start sharing your travel experiences
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-2">
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  required
                  label="Username"
                  placeholder="Your username"
                  icon={<IconUser size={16} />}
                  {...form.getInputProps('username')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  required
                  label="Full Name"
                  placeholder="Your name"
                  icon={<IconSignature size={16} />}
                  {...form.getInputProps('name')}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  required
                  label="Email"
                  placeholder="hello@example.com"
                  icon={<IconMail size={16} />}
                  {...form.getInputProps('email')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <PasswordInput
                  required
                  label="Password"
                  placeholder="Create a strong password"
                  icon={<IconLock size={16} />}
                  {...form.getInputProps('password')}
                />
              </Grid.Col>
            </Grid>

            <FileInput
              label="Profile Picture"
              placeholder="Upload your profile picture"
              accept="image/*"
              icon={<IconPhoto size={16} />}
              className='mb-4'
              {...form.getInputProps('profile_picture')}
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="md"
              radius="md"
              gradient={{ from: 'blue', to: 'cyan' }}
              variant="gradient"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>

            <Text align="center" className="mt-4 text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Log in
              </Link>
            </Text>
          </form>
        </Paper >
      </Container>
    </div >
  );
}