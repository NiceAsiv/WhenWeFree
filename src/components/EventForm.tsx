'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Paper,
    TextField,
    Button,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from '@mui/material';
import { EventFormData } from '@/types';

export default function EventForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dayStartTime: '09:00',
        dayEndTime: '22:00',
        slotMinutes: 30,
        minDurationMinutes: 60,
    });

    const handleChange = (field: keyof EventFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || '创建失败');
            }

            const data = await response.json();
            router.push(data.shareUrl);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="活动标题"
                            value={formData.title}
                            onChange={handleChange('title')}
                            placeholder="例如：团队周会"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="描述（可选）"
                            value={formData.description}
                            onChange={handleChange('description')}
                            placeholder="添加活动描述..."
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="date"
                            label="开始日期"
                            value={formData.startDate}
                            onChange={handleChange('startDate')}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="date"
                            label="结束日期"
                            value={formData.endDate}
                            onChange={handleChange('endDate')}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="time"
                            label="每天开始时间"
                            value={formData.dayStartTime}
                            onChange={handleChange('dayStartTime')}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="time"
                            label="每天结束时间"
                            value={formData.dayEndTime}
                            onChange={handleChange('dayEndTime')}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>时间粒度</InputLabel>
                            <Select
                                value={formData.slotMinutes}
                                label="时间粒度"
                                onChange={handleChange('slotMinutes')}
                            >
                                <MenuItem value={15}>15 分钟</MenuItem>
                                <MenuItem value={30}>30 分钟</MenuItem>
                                <MenuItem value={60}>60 分钟</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>最短活动时长</InputLabel>
                            <Select
                                value={formData.minDurationMinutes}
                                label="最短活动时长"
                                onChange={handleChange('minDurationMinutes')}
                            >
                                <MenuItem value={30}>30 分钟</MenuItem>
                                <MenuItem value={60}>60 分钟</MenuItem>
                                <MenuItem value={90}>90 分钟</MenuItem>
                                <MenuItem value={120}>120 分钟</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="时区"
                            value={formData.timezone}
                            onChange={handleChange('timezone')}
                            helperText="默认为浏览器时区"
                        />
                    </Grid>

                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => router.back()}
                            >
                                取消
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                {loading ? '创建中...' : '创建活动'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}
