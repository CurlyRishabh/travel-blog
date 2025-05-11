'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    TextInput,
    PasswordInput,
    Button,
    Group,
    Stack,
    Alert
} from '@mantine/core';
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            notifications.show({
                position: 'top-right',
                title: 'Success',
                message: 'Login successful',
                color: 'green',
            });

            localStorage.setItem('token', data.token);
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
            notifications.show({
                position: 'top-right',
                title: 'Error',
                message: 'Login failed',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing="md">
                {error && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Error"
                        color="red"
                        variant="light"
                    >
                        {error}
                    </Alert>
                )}

                <TextInput
                    required
                    label="Email"
                    placeholder="your@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<IconMail size={16} />}
                    radius="md"
                />

                <PasswordInput
                    required
                    label="Password"
                    placeholder="Your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={<IconLock size={16} />}
                    radius="md"
                />

                <Group position="apart" mt="md">
                    <Button
                        component="a"
                        href="#"
                        variant="subtle"
                        color="gray"
                        size="sm"
                    >
                        Forgot password?
                    </Button>
                </Group>

                <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                    size="md"
                    radius="md"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    variant="gradient"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </Stack>
        </form>
    );
}