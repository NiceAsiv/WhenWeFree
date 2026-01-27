'use client';

import { useState } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Switch,
    Box,
    Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LanguageIcon from '@mui/icons-material/Language';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';

export default function SettingsMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { darkMode, toggleDarkMode, language, setLanguage } = useApp();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageToggle = () => {
        setLanguage(language === 'zh' ? 'en' : 'zh');
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{
                    color: 'text.primary',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
            >
                <SettingsIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        minWidth: 220,
                        borderRadius: 2,
                        mt: 1,
                    },
                }}
            >
                {/* Dark Mode Toggle */}
                <MenuItem onClick={toggleDarkMode}>
                    <ListItemIcon>
                        {darkMode ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText>{t(language, 'settings.darkMode')}</ListItemText>
                    <Switch
                        edge="end"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        onClick={(e) => e.stopPropagation()}
                    />
                </MenuItem>

                <Divider />

                {/* Language Toggle */}
                <MenuItem onClick={handleLanguageToggle}>
                    <ListItemIcon>
                        <LanguageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t(language, 'settings.language')}</ListItemText>
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            {language === 'zh' ? '中文' : 'English'}
                        </Typography>
                    </Box>
                </MenuItem>
            </Menu>
        </>
    );
}
