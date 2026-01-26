'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import TimeGrid from './TimeGrid';
import { Event, Response } from '@/types';

interface ResultsViewProps {
    event: Event;
    responses: Response[];
}

export default function ResultsView({ event, responses }: ResultsViewProps) {
    const [tabValue, setTabValue] = useState(0);
    const [resultsData, setResultsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, [event.id]);

    const fetchResults = async () => {
        try {
            const response = await fetch(`/api/events/${event.id}/results`);
            const data = await response.json();
            setResultsData(data);
        } catch (error) {
            console.error('Failed to fetch results:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!resultsData) {
        return (
            <Alert severity="error">无法加载结果数据</Alert>
        );
    }

    const { slotCounts, commonSlots, recommendedSlots, totalParticipants } = resultsData;
    const maxCount = Math.max(...slotCounts, 1);

    return (
        <Box>
            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                    <Tab label="热力图" />
                    <Tab label="全员可用" />
                    <Tab label="推荐时间" />
                </Tabs>
            </Paper>

            {tabValue === 0 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        可用人数热力图
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        颜色越深表示可用人数越多
                    </Typography>
                    <TimeGrid
                        event={event}
                        selectedSlots={[]}
                        onSlotsChange={() => { }}
                        heatmapData={slotCounts}
                        maxCount={maxCount}
                    />
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2">0 人</Typography>
                        <Box
                            sx={{
                                flex: 1,
                                height: 20,
                                background: 'linear-gradient(to right, #f0f0f0, #0ea5e9)',
                                borderRadius: 1,
                            }}
                        />
                        <Typography variant="body2">{totalParticipants} 人</Typography>
                    </Box>
                </Paper>
            )}

            {tabValue === 1 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        全员共同可用时间段
                    </Typography>
                    {commonSlots.length === 0 ? (
                        <Typography color="text.secondary">
                            暂无全员共同可用的时间段
                        </Typography>
                    ) : (
                        <List>
                            {commonSlots.map((slotIndex: number, idx: number) => (
                                <ListItem key={idx}>
                                    <ListItemText
                                        primary={`时间段 ${slotIndex}`}
                                        secondary="所有参与者都有空"
                                    />
                                    <Chip label="全员可用" color="success" />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            )}

            {tabValue === 2 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        推荐时间段（按人数排序）
                    </Typography>
                    {recommendedSlots.length === 0 ? (
                        <Typography color="text.secondary">
                            暂无推荐时间段
                        </Typography>
                    ) : (
                        <List>
                            {recommendedSlots.map((slot: any, idx: number) => (
                                <ListItem key={idx}>
                                    <ListItemText
                                        primary={`推荐 ${idx + 1}`}
                                        secondary={`最少 ${slot.minCount} 人，平均 ${slot.averageCount.toFixed(1)} 人`}
                                    />
                                    <Chip
                                        label={`${slot.minCount} 人`}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            )}

            <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    参与者列表
                </Typography>
                <List>
                    {responses.map((response) => (
                        <ListItem key={response.id}>
                            <ListItemText
                                primary={response.name || '匿名参与者'}
                                secondary={`已选择 ${response.availabilitySlots.length} 个时间段`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}
