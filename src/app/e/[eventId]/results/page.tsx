import { notFound } from "next/navigation";
import { Container, Typography, Box } from "@mui/material";
import prisma from "@/lib/prisma";
import ResultsView from "@/components/ResultsView";

interface ResultsPageProps {
    params: {
        eventId: string;
    };
}

async function getEventWithResponses(eventId: string) {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            responses: true,
        },
    });

    return event;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
    const event = await getEventWithResponses(params.eventId);

    if (!event) {
        notFound();
    }

    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: 700 }}
                >
                    {event.title} - 结果
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    已收到 {event.responses.length} 份回复
                </Typography>
            </Box>
            <ResultsView event={event} responses={event.responses} />
        </Container>
    );
}
