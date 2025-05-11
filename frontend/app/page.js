'use client';
import { Button, Container, Text } from '@mantine/core';
import { useEffect } from 'react';
export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/dashboard';
    }else{
      window.location.href = '/auth/register';
    }
  }, []);
  return (
    <Container size="md" py="xl">
    </Container>
  );
}
