import { Container, Typography } from "@mui/material";

export default function ConfirmedPage() {
    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                时间已确认
            </Typography>
            <Typography variant="body1" color="text.secondary">
                确认页功能待实现
            </Typography>
        </Container>
    );
}
