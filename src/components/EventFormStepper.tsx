'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Card,
    Alert,
    Stack,
    Radio,
    RadioGroup,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format, addDays, differenceInDays } from 'date-fns';

const steps = ['基本信息', '选择模式', '时间配置'];

export default function EventFormStepper() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1: Basic Info
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Step 2: Mode Selection
    const [mode, setMode] = useState<'timeRange' | 'fullDay'>('timeRange');

    // Step 3: Time Configuration
    const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 6), 'yyyy-MM-dd'));
    const [timeMode, setTimeMode] = useState<'standard' | 'period' | 'custom'>('period');

    // Standard mode settings
    const [dayStartTime, setDayStartTime] = useState('09:00');
    const [dayEndTime, setDayEndTime] = useState('22:00');
    const [slotMinutes, setSlotMinutes] = useState(30);
    const [minDurationMinutes, setMinDurationMinutes] = useState(60);

    const handleNext = () => {
        if (activeStep === 0) {
            if (!title.trim()) {
                setError('请输入活动标题');
                return;
            }
        }

        if (activeStep === 2) {
            submitForm();
            return;
        }

        setError('');
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
        setError('');
    };

    const submitForm = async () => {
        const daysDiff = differenceInDays(new Date(endDate), new Date(startDate));
        if (daysDiff > 7 || daysDiff < 0) {
            setError('日期范围需在1-7天之间');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    startDate,
                    endDate,
                    mode,
                    timeMode,
                    ...(timeMode === 'standard' && {
                        dayStartTime,
                        dayEndTime,
                        slotMinutes,
                        minDurationMinutes,
                    }),
                }),
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

    const getDaysCount = () => {
        return Math.max(0, differenceInDays(new Date(endDate), new Date(startDate)) + 1);
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F5F5', py: 4 }}>
            <Box sx={{ maxWidth: 700, mx: 'auto', px: 2 }}>
                {/* Header */}
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                    创建新活动
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                    找到大家都有空的时间
                </Typography>

                {/* Stepper */}
                <Box sx={{ mb: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Content */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    {activeStep === 0 && (
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                                    活动标题 <span style={{ color: '#FA5151' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="例如：周末聚餐、团队建设、电影之夜"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                                    活动描述（可选）
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="添加活动的更多信息..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    inputProps={{ maxLength: 200 }}
                                />
                            </Box>
                        </Stack>
                    )}

                    {activeStep === 1 && (
                        <Stack spacing={3}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                选择活动模式
                            </Typography>

                            <RadioGroup value={mode} onChange={(e) => setMode(e.target.value as any)}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        mb: 2,
                                        cursor: 'pointer',
                                        border: mode === 'timeRange' ? '2px solid #07C160' : '1px solid #E0E0E0',
                                        '&:hover': { borderColor: '#07C160' },
                                    }}
                                    onClick={() => setMode('timeRange')}
                                >
                                    <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                        <Radio value="timeRange" checked={mode === 'timeRange'} />
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 20, color: '#07C160' }} />
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    约时间段
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                选择具体的时间段，如 9:00-10:00、14:00-15:00
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                适合：团队会议、面试安排、工作协调
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>

                                <Card
                                    variant="outlined"
                                    sx={{
                                        cursor: 'pointer',
                                        border: mode === 'fullDay' ? '2px solid #07C160' : '1px solid #E0E0E0',
                                        '&:hover': { borderColor: '#07C160' },
                                    }}
                                    onClick={() => setMode('fullDay')}
                                >
                                    <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                        <Radio value="fullDay" checked={mode === 'fullDay'} />
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <CalendarTodayIcon sx={{ fontSize: 20, color: '#07C160' }} />
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    约整天
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                选择完整的日期，不区分具体时间
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                适合：团建活动、聚餐聚会、出游计划
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </RadioGroup>
                        </Stack>
                    )}

                    {activeStep === 2 && (
                        <Stack spacing={3}>
                            {/* Date Range */}
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                                    日期范围（最多7天）
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                            开始日期
                                        </Typography>
                                        <TextField
                                            type="date"
                                            fullWidth
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                            结束日期
                                        </Typography>
                                        <TextField
                                            type="date"
                                            fullWidth
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                </Box>
                                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#07C160', fontWeight: 500 }}>
                                    ✓ 共 {getDaysCount()} 天
                                </Typography>
                            </Box>

                            {/* Time Division Mode (only for timeRange mode) */}
                            {mode === 'timeRange' && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                                        时间划分方式
                                    </Typography>

                                    <RadioGroup value={timeMode} onChange={(e) => setTimeMode(e.target.value as any)}>
                                        <Stack spacing={1.5}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    cursor: 'pointer',
                                                    border: timeMode === 'standard' ? '2px solid #07C160' : '1px solid #E0E0E0',
                                                }}
                                                onClick={() => setTimeMode('standard')}
                                            >
                                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                                                    <Radio value="standard" />
                                                    <Box sx={{ flex: 1, ml: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            标准模式
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            自定义开始/结束时间和时间间隔
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Card>

                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    cursor: 'pointer',
                                                    border: timeMode === 'period' ? '2px solid #07C160' : '1px solid #E0E0E0',
                                                }}
                                                onClick={() => setTimeMode('period')}
                                            >
                                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                                                    <Radio value="period" />
                                                    <Box sx={{ flex: 1, ml: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            按时段划分
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            上午、下午、晚上（简单快捷）
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Card>

                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    cursor: 'pointer',
                                                    border: timeMode === 'custom' ? '2px solid #07C160' : '1px solid #E0E0E0',
                                                }}
                                                onClick={() => setTimeMode('custom')}
                                            >
                                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                                                    <Radio value="custom" />
                                                    <Box sx={{ flex: 1, ml: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            自定义选项
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            自己添加时间段选项（午餐、晚餐等）
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </Stack>
                                    </RadioGroup>

                                    {/* Standard Mode Settings */}
                                    {timeMode === 'standard' && (
                                        <Box sx={{ mt: 3, p: 2.5, backgroundColor: '#F7F7F7', borderRadius: 2 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                                                详细设置
                                            </Typography>
                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                                    <TextField
                                                        type="time"
                                                        label="每天开始时间"
                                                        value={dayStartTime}
                                                        onChange={(e) => setDayStartTime(e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        type="time"
                                                        label="每天结束时间"
                                                        value={dayEndTime}
                                                        onChange={(e) => setDayEndTime(e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                    />
                                                </Box>
                                                <FormControl fullWidth>
                                                    <InputLabel>时间粒度</InputLabel>
                                                    <Select
                                                        value={slotMinutes}
                                                        label="时间粒度"
                                                        onChange={(e) => setSlotMinutes(Number(e.target.value))}
                                                    >
                                                        <MenuItem value={15}>15 分钟</MenuItem>
                                                        <MenuItem value={30}>30 分钟</MenuItem>
                                                        <MenuItem value={60}>60 分钟</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <FormControl fullWidth>
                                                    <InputLabel>最短活动时长</InputLabel>
                                                    <Select
                                                        value={minDurationMinutes}
                                                        label="最短活动时长"
                                                        onChange={(e) => setMinDurationMinutes(Number(e.target.value))}
                                                    >
                                                        <MenuItem value={30}>30 分钟</MenuItem>
                                                        <MenuItem value={60}>60 分钟</MenuItem>
                                                        <MenuItem value={90}>90 分钟</MenuItem>
                                                        <MenuItem value={120}>120 分钟</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Stack>
                    )}
                </Paper>

                {/* Error */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    {activeStep > 0 && (
                        <Button variant="outlined" onClick={handleBack} sx={{ minWidth: 100 }}>
                            上一步
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={loading}
                        sx={{ minWidth: 120 }}
                    >
                        {loading ? '创建中...' : activeStep === 2 ? '创建活动' : '下一步'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
