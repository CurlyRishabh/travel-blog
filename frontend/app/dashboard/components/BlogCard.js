import { Card, Image, Text, Group, Badge, ActionIcon, Stack, Tooltip } from '@mantine/core';
import { IconMapPin, IconCalendarEvent, IconCurrencyDollar } from '@tabler/icons-react';
import { format } from 'date-fns';

export default function BlogCard({ blog }) {
    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                }
            }}
        >
            <Card.Section >
                <Image
                    className="h-[180px]"
                    src={`http://localhost:3001/${blog.image}`}
                    height={200}
                    alt={blog.title}
                    fallbackSrc="https://placehold.co/600x400?text=Travel+Blog"
                    style={{
                        objectFit: 'cover',
                    }}
                />
            </Card.Section>

            <Stack gap="xs" mt="md">
                {/* Title */}
                <Text fw={700} size="lg" lineClamp={2}>
                    {blog.title}
                </Text>

                {/* Tags */}
                <Group gap="xs" mt="xs">
                    {blog.tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="light"
                            color={tag === 'Luxury' ? 'gold' :
                                tag === 'Budget' ? 'blue' : 'gray'}
                        >
                            {tag}
                        </Badge>
                    ))}
                </Group>

                {/* Description */}
                <Text size="sm" c="dimmed" lineClamp={2} mt="xs">
                    {blog.description}
                </Text>

                {/* Location and Cost Info */}
                <Group mt="md" justify="space-between">
                    <Group gap="xs">
                        <IconMapPin size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />
                        <Text size="sm" fw={500}>
                            {blog.destination}
                        </Text>
                    </Group>
                    <Tooltip label="Total Cost">
                        <Group gap="xs">
                            <IconCurrencyDollar size={16} style={{ color: 'var(--mantine-color-green-6)' }} />
                            <Text size="sm" fw={500}>
                                {Number(blog.total_cost).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                })}
                            </Text>
                        </Group>
                    </Tooltip>
                </Group>

                {/* Date */}
                <Group mt="xs" gap="xs">
                    <IconCalendarEvent size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                    <Text size="xs" c="dimmed">
                        {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                    </Text>
                </Group>
            </Stack>
        </Card>
    );
}