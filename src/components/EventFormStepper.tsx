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

    // Custom time slots (for custom mode)
    const [customTimeSlots, setCustomTimeSlots] = useState<Array<{label: string; startTime: string; endTime: string}>>([]);
    const [newSlotLabel, setNewSlotLabel] = useState('');
    const [newSlotStart, setNewSlotStart] = useState('09:00');
    const [newSlotEnd, setNewSlotEnd] = useState('10:00');
    const [customSlotError, setCustomSlotError] = useState('');

    // Check if time ranges overlap
    const checkTimeOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
        const timeToMinutes = (time: string) => {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        };
        
        const s1 = timeToMinutes(start1);
        const e1 = timeToMinutes(end1);
        const s2 = timeToMinutes(start2);
        const e2 = timeToMinutes(end2);
        
        // Check if ranges overlap
        return (s1 < e2 && e1 > s2);
    };

    // Add custom time slot with validation
    const addCustomTimeSlot = () => {
        setCustomSlotError('');
        
        if (!newSlotLabel.trim()) {
            setCustomSlotError('请输入时间段标签');
            return;
        }
        
        if (!newSlotStart || !newSlotEnd) {
            setCustomSlotError('请设置开始和结束时间');
            return;
        }
        
        // Check if start time is before end time
        const timeToMinutes = (time: string) => {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        };
        
        if (timeToMinutes(newSlotStart) >= timeToMinutes(newSlotEnd)) {
            setCustomSlotError('开始时间必须早于结束时间');
            return;
        }
        
        // Check for overlaps with existing slots
        for (const slot of customTimeSlots) {
            if (checkTimeOverlap(newSlotStart, newSlotEnd, slot.startTime, slot.endTime)) {
                setCustomSlotError(`时间段与「${slot.label}」重叠，请调整时间`);
                return;
            }
        }
        
        // All validations passed, add the slot
        setCustomTimeSlots([...customTimeSlots, {
            label: newSlotLabel.trim(),
            startTime: newSlotStart,
            endTime: newSlotEnd,
        }]);
        
        // Reset form
        setNewSlotLabel('');
        setNewSlotStart('09:00');
        setNewSlotEnd('10:00');
        setCustomSlotError('');
    };

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
        if (daysDiff < 0) {
            setError('结束日期不能早于开始日期');
            return;
        }
        if (mode === 'timeRange' && daysDiff > 13) {
            setError('约时间段模式日期范围最多14天');
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
                    timeMode: mode === 'timeRange' ? timeMode : undefined,
                    ...(mode === 'timeRange' && timeMode === 'standard' && {
                        dayStartTime,
                        dayEndTime,
                        slotMinutes,
                        minDurationMinutes,
                    }),
                    ...(mode === 'timeRange' && timeMode === 'custom' && {
                        customTimeSlots,
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
                                        border: mode === 'timeRange' ? 2 : 1,
                                        borderColor: mode === 'timeRange' ? 'primary.main' : 'divider',
                                        bgcolor: mode === 'timeRange' ? 'background.default' : 'background.paper',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { borderColor: 'primary.main' },
                                    }}
                                    onClick={() => setMode('timeRange')}
                                >
                                    <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                        <Radio value="timeRange" checked={mode === 'timeRange'} />
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
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
                                        border: mode === 'fullDay' ? 2 : 1,
                                        borderColor: mode === 'fullDay' ? 'primary.main' : 'divider',
                                        bgcolor: mode === 'fullDay' ? 'background.default' : 'background.paper',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { borderColor: 'primary.main' },
                                    }}
                                    onClick={() => setMode('fullDay')}
                                >
                                    <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                        <Radio value="fullDay" checked={mode === 'fullDay'} />
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <CalendarTodayIcon sx={{ fontSize: 20, color: 'primary.main' }} />
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
                                    日期范围{mode === 'timeRange' ? '（最多14天）' : ''}
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
                                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'primary.main', fontWeight: 500 }}>
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
                                                    border: timeMode === 'standard' ? 2 : 1,
                                                    borderColor: timeMode === 'standard' ? 'primary.main' : 'divider',
                                                    bgcolor: timeMode === 'standard' ? 'background.default' : 'background.paper',
                                                    transition: 'all 0.2s ease',
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
                                                    border: timeMode === 'period' ? 2 : 1,
                                                    borderColor: timeMode === 'period' ? 'primary.main' : 'divider',
                                                    bgcolor: timeMode === 'period' ? 'background.default' : 'background.paper',
                                                    transition: 'all 0.2s ease',
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
                                                    border: timeMode === 'custom' ? 2 : 1,
                                                    borderColor: timeMode === 'custom' ? 'primary.main' : 'divider',
                                                    bgcolor: timeMode === 'custom' ? 'background.default' : 'background.paper',
                                                    transition: 'all 0.2s ease',
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

                                            {/* Time Slots Preview */}
                                            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E0E0E0' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500 }}>
                                                    时间槽预览
                                                </Typography>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    flexWrap: 'wrap', 
                                                    gap: 0.5,
                                                    maxHeight: 200,
                                                    overflowY: 'auto',
                                                    p: 1,
                                                    backgroundColor: 'white',
                                                    borderRadius: 1
                                                }}>
                                                    {(() => {
                                                        const [startHour, startMin] = dayStartTime.split(':').map(Number);
                                                        const [endHour, endMin] = dayEndTime.split(':').map(Number);
                                                        const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                                                        const totalSlots = Math.floor(totalMinutes / slotMinutes);
                                                        const displaySlots = totalSlots > 20 ? 20 : totalSlots;
                                                        
                                                        return (
                                                            <>
                                                                {Array.from({ length: displaySlots }).map((_, i) => {
                                                                    const minutes = startHour * 60 + startMin + i * slotMinutes;
                                                                    const hour = Math.floor(minutes / 60);
                                                                    const min = minutes % 60;
                                                                    return (
                                                                        <Box
                                                                            key={i}
                                                                            sx={{
                                                                                px: 1,
                                                                                py: 0.5,
                                                                                bgcolor: 'background.default',
                                                                                border: 1,
                                                                                borderColor: 'primary.main',
                                                                                borderRadius: 0.5,
                                                                                fontSize: '0.7rem',
                                                                                color: 'primary.dark',
                                                                                fontWeight: 500,
                                                                            }}
                                                                        >
                                                                            {`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`}
                                                                        </Box>
                                                                    );
                                                                })}
                                                                {totalSlots > 20 && (
                                                                    <Box sx={{ px: 1, py: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                                                                        ...等{totalSlots - 20}个
                                                                    </Box>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                    {(() => {
                                                        const [startHour, startMin] = dayStartTime.split(':').map(Number);
                                                        const [endHour, endMin] = dayEndTime.split(':').map(Number);
                                                        const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                                                        const totalSlots = Math.floor(totalMinutes / slotMinutes);
                                                        return `共 ${getDaysCount()} 天 × ${totalSlots} 个时段 = ${getDaysCount() * totalSlots} 个选项`;
                                                    })()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Period Mode Preview */}
                                    {timeMode === 'period' && (
                                        <Box sx={{ mt: 3, p: 2.5, backgroundColor: '#F7F7F7', borderRadius: 2 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                                                时间段预览
                                            </Typography>
                                            <Stack spacing={1}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
                                                    <Typography variant="body2">上午 (09:00 - 12:00)</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main' }} />
                                                    <Typography variant="body2">下午 (12:00 - 18:00)</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.dark' }} />
                                                    <Typography variant="body2">晚上 (18:00 - 22:00)</Typography>
                                                </Box>
                                            </Stack>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                                共 {getDaysCount()} 天 × 3 个时段 = {getDaysCount() * 3} 个选项
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Custom Mode Settings */}
                                    {timeMode === 'custom' && (
                                        <Box sx={{ mt: 3, p: 2.5, backgroundColor: '#F7F7F7', borderRadius: 2 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                                                自定义时间段
                                            </Typography>
                                            
                                            {/* Existing slots - Preview */}
                                            {customTimeSlots.length > 0 && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500, color: 'text.secondary' }}>
                                                        已添加的时间段预览
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        {customTimeSlots.map((slot, index) => (
                                                            <Box 
                                                                key={index}
                                                                sx={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    gap: 1, 
                                                                    p: 1.5, 
                                                                    bgcolor: 'background.paper', 
                                                                    borderRadius: 1,
                                                                    border: 1,
                                                                    borderColor: 'divider'
                                                                }}
                                                            >
                                                                <Box 
                                                                    sx={{ 
                                                                        width: 8, 
                                                                        height: 8, 
                                                                        borderRadius: '50%', 
                                                                        backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 60%)`,
                                                                        flexShrink: 0
                                                                    }} 
                                                                />
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                        {slot.label}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {slot.startTime} - {slot.endTime}
                                                                    </Typography>
                                                                </Box>
                                                                <Button 
                                                                    size="small" 
                                                                    onClick={() => {
                                                                        setCustomTimeSlots(customTimeSlots.filter((_, i) => i !== index));
                                                                    }}
                                                                    sx={{
                                                                        color: 'error.main',
                                                                        '&:hover': {
                                                                            bgcolor: 'error.lighter',
                                                                        }
                                                                    }}
                                                                >
                                                                    删除
                                                                </Button>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                                                        共 {getDaysCount()} 天 × {customTimeSlots.length} 个时段 = {getDaysCount() * customTimeSlots.length} 个选项
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Add new slot */}
                                            <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px dashed #E0E0E0' }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                                    添加新时间段
                                                </Typography>
                                                <Stack spacing={1.5}>
                                                    <TextField
                                                        size="small"
                                                        label="标签"
                                                        placeholder="例如：下午 4-5"
                                                        value={newSlotLabel}
                                                        onChange={(e) => {
                                                            setNewSlotLabel(e.target.value);
                                                            setCustomSlotError('');
                                                        }}
                                                        fullWidth
                                                    />
                                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                                                        <TextField
                                                            size="small"
                                                            type="time"
                                                            label="开始时间"
                                                            value={newSlotStart}
                                                            onChange={(e) => {
                                                                setNewSlotStart(e.target.value);
                                                                setCustomSlotError('');
                                                            }}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                        <TextField
                                                            size="small"
                                                            type="time"
                                                            label="结束时间"
                                                            value={newSlotEnd}
                                                            onChange={(e) => {
                                                                setNewSlotEnd(e.target.value);
                                                                setCustomSlotError('');
                                                            }}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Box>
                                                    
                                                    {/* Error message */}
                                                    {customSlotError && (
                                                        <Alert severity="error" sx={{ mt: 1 }}>
                                                            {customSlotError}
                                                        </Alert>
                                                    )}
                                                    
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={addCustomTimeSlot}
                                                        disabled={!newSlotLabel.trim() || !newSlotStart || !newSlotEnd}
                                                        color="primary"
                                                    >
                                                        添加时间段
                                                    </Button>
                                                </Stack>
                                            </Box>
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
                        <Button 
                            variant="outlined" 
                            onClick={handleBack} 
                            sx={{ minWidth: 100 }}
                        >
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
