import { notFound } from "next/navigation";
import { Container, Typography, Box, Button } from "@mui/material";
import Link from "next/link";
import BarChart from "@mui/icons-material/BarChart";
import prisma from "@/lib/prisma";
import ParticipantForm from "@/components/ParticipantForm";

interface EventPageProps {
    params: {
        eventId: string;
    };
}

async function getEvent(eventId: string) {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            responses: true,
        },
    });

    return event;
}

export default async function EventPage({ params }: EventPageProps) {
    const event = await getEvent(params.eventId);

    if (!event) {
        notFound();
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{ fontWeight: 700 }}
                    >
                        {event.title}
                    </Typography>
                    <Link href={`/e/${params.eventId}/results`} passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant="outlined"
                            startIcon={<BarChart />}
                            sx={{ borderRadius: 3 }}
                        >
                            查看结果 ({event.responses.length})
                        </Button>
                    </Link>
                </Box>
                {event.description && (
                    <Typography variant="body1" color="text.secondary">
                        {event.description}
                    </Typography>
                )}
            </Box>
            <ParticipantForm event={event} />
        </Container>
    );
}
