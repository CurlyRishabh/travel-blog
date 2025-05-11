import { useState, useEffect } from 'react';
import { Card, Image, Grid, Pagination, Group, Select, Text, Box, TextInput, NumberInput, MultiSelect, Button, Paper, Title, Container } from '@mantine/core';
import { IconSearch, IconMapPin, IconTags, IconCoin } from '@tabler/icons-react';
import BlogCard from './BlogCard';

export default function BlogDashboard() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Add search state
    const [searchParams, setSearchParams] = useState({
        query: '',
        destination: '',
        minCost: '',
        maxCost: '',
        tags: []
    });

    // Add pagination state
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Add items per page options
    const limitOptions = [
        { value: '5', label: '5 per page' },
        { value: '10', label: '10 per page' },
        { value: '20', label: '20 per page' },
        { value: '50', label: '50 per page' }
    ];

    // Example tags - you might want to fetch these from your backend
    const availableTags = [
        { value: 'adventure', label: 'Adventure' },
        { value: 'nature', label: 'Nature' },
        { value: 'city', label: 'City' },
        { value: 'beach', label: 'Beach' },
        { value: 'mountains', label: 'Mountains' }
    ];

    const fetchBlogs = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            // Build search query parameters
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...searchParams,
                tags: JSON.stringify(searchParams.tags)
            });

            // Remove empty parameters
            Object.entries(searchParams).forEach(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    params.delete(key);
                }
            });

            const response = await fetch(`http://localhost:3001/blog/search?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const data = await response.json();
            setBlogs(data.blogs);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(pagination.currentPage, pagination.limit);
    }, []); // Initial fetch

    const handleSearch = () => {
        fetchBlogs(1, pagination.limit); // Reset to first page when searching
    };

    const handlePageChange = (newPage) => {
        fetchBlogs(newPage, pagination.limit);
    };

    const handleLimitChange = (newLimit) => {
        fetchBlogs(1, parseInt(newLimit));
    };

    return (
        <Container size="xl">
            {/* Search Controls */}
            <Paper shadow="sm" radius="md" p="xl" mb="xl" bg="gray.0">
                <Grid>
                    <Grid.Col span={6}>
                        <TextInput
                            placeholder="Search blogs..."
                            value={searchParams.query}
                            onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
                            leftSection={<IconSearch size={16} />}
                            styles={{ input: { '&:focus': { borderColor: 'var(--mantine-color-blue-5)' } } }}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            placeholder="Destination"
                            value={searchParams.destination}
                            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                            leftSection={<IconMapPin size={16} />}
                            styles={{ input: { '&:focus': { borderColor: 'var(--mantine-color-blue-5)' } } }}
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <NumberInput
                            placeholder="Min Cost"
                            value={searchParams.minCost}
                            onChange={(value) => setSearchParams({ ...searchParams, minCost: value })}
                            leftSection={<IconCoin size={16} />}
                            styles={{ input: { '&:focus': { borderColor: 'var(--mantine-color-blue-5)' } } }}
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <NumberInput
                            placeholder="Max Cost"
                            value={searchParams.maxCost}
                            onChange={(value) => setSearchParams({ ...searchParams, maxCost: value })}
                            leftSection={<IconCoin size={16} />}
                            styles={{ input: { '&:focus': { borderColor: 'var(--mantine-color-blue-5)' } } }}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <MultiSelect
                            data={availableTags}
                            placeholder="Select tags"
                            value={searchParams.tags}
                            onChange={(value) => setSearchParams({ ...searchParams, tags: value })}
                            leftSection={<IconTags size={16} />}
                            styles={{
                                input: { '&:focus': { borderColor: 'var(--mantine-color-blue-5)' } },
                                pill: { backgroundColor: 'var(--mantine-color-blue-1)' }
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Button
                            onClick={handleSearch}
                            fullWidth
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'cyan' }}
                        >
                            Search
                        </Button>
                    </Grid.Col>
                </Grid>
            </Paper>

            {/* Loading and Error States */}
            {loading && (
                <Paper p="xl" ta="center">
                    <Text size="lg" c="dimmed">Loading blogs...</Text>
                </Paper>
            )}

            {error && (
                <Paper p="xl" ta="center" bg="red.0">
                    <Text c="red">Error: {error}</Text>
                </Paper>
            )}

            {/* Blog Grid */}
            {!loading && !error && (
                <>
                    <Grid mb="md" gutter="lg">
                        {blogs.map((blog) => (
                            <Grid.Col key={blog.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                                <BlogCard blog={blog} />
                            </Grid.Col>
                        ))}
                    </Grid>

                    {/* Pagination controls */}
                    <Paper shadow="xs" p="md" radius="md">
                        <Group justify="space-between" align="center">
                            <Group>
                                <Text size="sm" c="dimmed">Items per page:</Text>
                                <Select
                                    w={120}
                                    value={pagination.limit.toString()}
                                    data={limitOptions}
                                    onChange={handleLimitChange}
                                    styles={{
                                        input: { '&:focus': { borderColor: 'var(--mantine-color-blue-5)' } }
                                    }}
                                />
                            </Group>

                            <Group>
                                <Text size="sm" c="dimmed">
                                    Showing {blogs.length} of {pagination.total} blogs
                                </Text>
                                <Pagination
                                    value={pagination.currentPage}
                                    onChange={handlePageChange}
                                    total={pagination.totalPages}
                                    boundaries={1}
                                    siblings={1}
                                />
                            </Group>
                        </Group>
                    </Paper>
                </>
            )}
        </Container>
    );
}