import { Box } from "@mui/material";
import EventFormStepper from "@/components/EventFormStepper";
import SettingsMenu from "@/components/SettingsMenu";

export default function NewEventPage() {
    return (
        <Box>
            <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
                <SettingsMenu />
            </Box>
            <EventFormStepper />
        </Box>
    );
}
