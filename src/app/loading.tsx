import { Container, Box, CircularProgress, Typography } from "@mui/material";

export default function Loading() {
    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: 3,
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: 'primary.main',
                    }}
                />
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        fontWeight: 500,
                    }}
                >
                    加载中...
                </Typography>
            </Box>
        </Container>
    );
}
