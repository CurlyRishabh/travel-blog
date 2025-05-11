'use client';

import LoginForm from '../../../components/auth/LoginForm';
import { Card, Container, Image, Stack } from '@mantine/core';
import Link from 'next/link';
import { IconCompass } from '@tabler/icons-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <Container size="sm" className="px-4">
        <Card shadow="sm" radius="md" className="w-full">
          <Stack spacing="lg">
            {/* Logo or Brand Image */}
            <div className="text-center">
                <Image
                  radius="md"
                  src="/login_page.jpg"
                  alt="Travel Blog Logo"
                  width={120}
                  height={120}

                fallback={
                  <div className="w-[120px] h-[120px] bg-blue-100 rounded-full flex items-center justify-center">
                    <IconCompass size={48} className="text-blue-500" />
                  </div>
                }
              />
              <h2 className="text-3xl font-bold text-gray-900 mt-4">Welcome Back, Explorer!</h2>
              <p className="mt-2 text-gray-600">Continue your journey with us</p>
            </div>

            <LoginForm />

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                href="/auth/register" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Start your journey
              </Link>
            </div>
          </Stack>
        </Card>
      </Container>
    </div>
  );
}