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
import { useTranslation } from "@/hooks/useTranslation";

export default function EventFormStepper() {
    const { t } = useTranslation();
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const steps = [
        t('createEvent.steps.basicInfo'),
        t('createEvent.steps.selectMode'),
        t('createEvent.steps.timeConfig')
    ];

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
    const [customTimeSlots, setCustomTimeSlots] = useState<Array<{ label: string; startTime: string; endTime: string }>>([]);
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
            setCustomSlotError(t('createEvent.customMode.errorLabel'));
            return;
        }

        if (!newSlotStart || !newSlotEnd) {
            setCustomSlotError(t('createEvent.customMode.errorTime'));
            return;
        }

        // Check if start time is before end time
        const timeToMinutes = (time: string) => {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        };

        if (timeToMinutes(newSlotStart) >= timeToMinutes(newSlotEnd)) {
            setCustomSlotError(t('createEvent.customMode.errorTimeOrder'));
            return;
        }

        // Check for overlaps with existing slots
        for (const slot of customTimeSlots) {
            if (checkTimeOverlap(newSlotStart, newSlotEnd, slot.startTime, slot.endTime)) {
                setCustomSlotError(t('createEvent.customMode.errorOverlap', { label: slot.label }));
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
                setError(t('createEvent.basicInfo.errorTitleRequired'));
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
            setError(t('createEvent.timeConfig.errors.dateOrder'));
            return;
        }
        if (mode === 'timeRange' && daysDiff > 13) {
            setError(t('createEvent.timeConfig.errors.dateRangeLimit'));
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
                throw new Error(data.error || t('createEvent.actions.failed'));
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
        <Box sx={{ minHeight: '100vh', backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : '#F5F5F5', py: 4 }}>
            <Box sx={{ maxWidth: 700, mx: 'auto', px: 2 }}>
                {/* Header */}
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                    {t('createEvent.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                    {t('createEvent.subtitle')}
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
                                    {t('createEvent.basicInfo.title')} <span style={{ color: '#FA5151' }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder={t('createEvent.basicInfo.titlePlaceholder')}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                                    {t('createEvent.basicInfo.description')}
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder={t('createEvent.basicInfo.descriptionPlaceholder')}
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
                                {t('createEvent.modeSelection.title')}
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
                                                    {t('createEvent.modeSelection.timeRange.title')}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {t('createEvent.modeSelection.timeRange.description')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                {t('createEvent.modeSelection.timeRange.suitable')}
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
                                                    {t('createEvent.modeSelection.fullDay.title')}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {t('createEvent.modeSelection.fullDay.description')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                {t('createEvent.modeSelection.fullDay.suitable')}
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
                                    {t('createEvent.timeConfig.dateRange')}{mode === 'timeRange' ? t('createEvent.timeConfig.maxDays') : ''}
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                            {t('createEvent.timeConfig.startDate')}
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
                                            {t('createEvent.timeConfig.endDate')}
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
                                    {t('createEvent.timeConfig.daysCount', { count: getDaysCount() })}
                                </Typography>
                            </Box>

                            {/* Time Division Mode (only for timeRange mode) */}
                            {mode === 'timeRange' && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                                        {t('createEvent.timeConfig.timeDivision')}
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
                                                            {t('createEvent.timeConfig.standardMode.title')}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {t('createEvent.timeConfig.standardMode.description')}
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
                                                            {t('createEvent.timeConfig.periodMode.title')}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {t('createEvent.timeConfig.periodMode.description')}
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
                                                            {t('createEvent.timeConfig.customMode.title')}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {t('createEvent.timeConfig.customMode.description')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </Stack>
                                    </RadioGroup>

                                    {/* Standard Mode Settings */}
                                    {timeMode === 'standard' && (
                                        <Box sx={{ mt: 3, p: 2.5, backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F7F7F7', borderRadius: 2 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                                                {t('createEvent.timeConfig.standardMode.settings')}
                                            </Typography>
                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                                    <TextField
                                                        type="time"
                                                        label={t('createEvent.timeConfig.standardMode.dayStartTime')}
                                                        value={dayStartTime}
                                                        onChange={(e) => setDayStartTime(e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        type="time"
                                                        label={t('createEvent.timeConfig.standardMode.dayEndTime')}
                                                        value={dayEndTime}
                                                        onChange={(e) => setDayEndTime(e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                    />
                                                </Box>
                                                <FormControl fullWidth>
                                                    <InputLabel>{t('createEvent.timeConfig.standardMode.slotDuration')}</InputLabel>
                                                    <Select
                                                        value={slotMinutes}
                                                        label={t('createEvent.timeConfig.standardMode.slotDuration')}
                                                        onChange={(e) => setSlotMinutes(Number(e.target.value))}
                                                    >
                                                        <MenuItem value={15}>{t('createEvent.timeConfig.standardMode.minutes', { count: 15 })}</MenuItem>
                                                        <MenuItem value={30}>{t('createEvent.timeConfig.standardMode.minutes', { count: 30 })}</MenuItem>
                                                        <MenuItem value={60}>{t('createEvent.timeConfig.standardMode.minutes', { count: 60 })}</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <FormControl fullWidth>
                                                    <InputLabel>{t('createEvent.timeConfig.standardMode.minDuration')}</InputLabel>
                                                    <Select
                                                        value={minDurationMinutes}
                                                        label={t('createEvent.timeConfig.standardMode.minDuration')}
                                                        onChange={(e) => setMinDurationMinutes(Number(e.target.value))}
                                                    >
                                                        <MenuItem value={30}>{t('createEvent.timeConfig.standardMode.minutes', { count: 30 })}</MenuItem>
                                                        <MenuItem value={60}>{t('createEvent.timeConfig.standardMode.minutes', { count: 60 })}</MenuItem>
                                                        <MenuItem value={90}>{t('createEvent.timeConfig.standardMode.minutes', { count: 90 })}</MenuItem>
                                                        <MenuItem value={120}>{t('createEvent.timeConfig.standardMode.minutes', { count: 120 })}</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Stack>

                                            {/* Time Slots Preview */}
                                            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E0E0E0' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500 }}>
                                                    {t('createEvent.timeConfig.standardMode.preview')}
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 0.5,
                                                    maxHeight: 200,
                                                    overflowY: 'auto',
                                                    p: 1,
                                                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'white',
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
                                                                        {t('createEvent.timeConfig.standardMode.moreSlots', { count: totalSlots - 20 })}
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
                                                        return t('createEvent.timeConfig.standardMode.slotsCount', { days: getDaysCount(), slots: totalSlots, total: getDaysCount() * totalSlots });
                                                    })()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Period Mode Preview */}
                                    {timeMode === 'period' && (
                                        <Box sx={{ mt: 3, p: 2.5, backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F7F7F7', borderRadius: 2 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                                                {t('createEvent.timeConfig.periodMode.preview')}
                                            </Typography>
                                            <Stack spacing={1}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
                                                    <Typography variant="body2">{t('createEvent.timeConfig.periodMode.morning')} (09:00 - 12:00)</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main' }} />
                                                    <Typography variant="body2">{t('createEvent.timeConfig.periodMode.afternoon')} (12:00 - 18:00)</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.dark' }} />
                                                    <Typography variant="body2">{t('createEvent.timeConfig.periodMode.evening')} (18:00 - 22:00)</Typography>
                                                </Box>
                                            </Stack>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                                {t('createEvent.timeConfig.standardMode.slotsCount', { days: getDaysCount(), slots: 3, total: getDaysCount() * 3 })}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Custom Mode Settings */}
                                    {timeMode === 'custom' && (
                                        <Box sx={{ mt: 3, p: 2.5, backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F7F7F7', borderRadius: 2 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                                                {t('createEvent.timeConfig.customMode.sectionTitle')}
                                            </Typography>

                                            {/* Existing slots - Preview */}
                                            {customTimeSlots.length > 0 && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500, color: 'text.secondary' }}>
                                                        {t('createEvent.timeConfig.customMode.preview')}
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
                                                                    {t('createEvent.timeConfig.customMode.delete')}
                                                                </Button>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                                                        {t('createEvent.timeConfig.standardMode.slotsCount', { days: getDaysCount(), slots: customTimeSlots.length, total: getDaysCount() * customTimeSlots.length })}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Add new slot */}
                                            <Box sx={{ p: 2, backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'white', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                                    {t('createEvent.timeConfig.customMode.addNew')}
                                                </Typography>
                                                <Stack spacing={1.5}>
                                                    <TextField
                                                        size="small"
                                                        label={t('createEvent.timeConfig.customMode.label')}
                                                        placeholder={t('createEvent.timeConfig.customMode.labelPlaceholder')}
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
                                                            label={t('createEvent.timeConfig.customMode.startTime')}
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
                                                            label={t('createEvent.timeConfig.customMode.endTime')}
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
                                                        {t('createEvent.timeConfig.customMode.addBtn')}
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
                            {t('createEvent.actions.prev')}
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={loading}
                        sx={{ minWidth: 120 }}
                    >
                        {loading ? t('createEvent.actions.creating') : activeStep === 2 ? t('createEvent.actions.create') : t('createEvent.actions.next')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
