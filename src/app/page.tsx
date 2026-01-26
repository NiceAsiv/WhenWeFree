import { Container, Box, Typography, Button, Paper, Card } from "@mui/material";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import Group from "@mui/icons-material/Group";
import Schedule from "@mui/icons-material/Schedule";
import EventAvailable from "@mui/icons-material/EventAvailable";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <Box sx={{ background: 'linear-gradient(180deg, #F1F1F1 0%, #FFFFFF 100%)', minHeight: '100vh' }}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 8,
                    }}
                >
                    {/* Hero Section */}
                    <Box sx={{ textAlign: "center", mb: 8 }}>
                        {/* Logo */}
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                            <Image
                                src="/logo/logo.png"
                                alt="When We Free Logo"
                                width={200}
                                height={200}
                                priority
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>

                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: '#2BA245',
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                            }}
                        >
                            When We Free?
                            <EventAvailable sx={{ fontSize: 56, color: '#2BA245' }} />
                        </Typography>
                        <Typography
                            variant="h4"
                            color="text.secondary"
                            gutterBottom
                            sx={{ mb: 5, maxWidth: 600, mx: 'auto' }}
                        >
                            找到大家都有空的时间，让活动安排变得简单
                        </Typography>
                        <Link href="/new" passHref style={{ textDecoration: "none" }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 8,
                                    py: 2.5,
                                    fontSize: "1.25rem",
                                    borderRadius: 30,
                                    boxShadow: '0px 4px 12px rgba(103, 80, 164, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0px 8px 24px rgba(103, 80, 164, 0.4)',
                                    },
                                }}
                            >
                                创建活动
                            </Button>
                        </Link>
                    </Box>

                    {/* Features - Large Color Blocks */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                            gap: 4,
                            width: "100%",
                            mt: 4,
                        }}
                    >
                        <Card
                            elevation={0}
                            sx={{
                                p: 4,
                                textAlign: "center",
                                backgroundColor: '#E8F5E9',
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
                                },
                            }}
                        >
                            <Box sx={{
                                backgroundColor: '#2BA245',
                                borderRadius: '50%',
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3
                            }}>
                                <CalendarMonth sx={{ fontSize: 48, color: 'white' }} />
                            </Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1D1B20' }}>
                                简单易用
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                创建活动，分享链接，参与者快速填写空闲时间
                            </Typography>
                        </Card>

                        <Card
                            elevation={0}
                            sx={{
                                p: 4,
                                textAlign: "center",
                                backgroundColor: '#C8E6C9',
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
                                },
                            }}
                        >
                            <Box sx={{
                                backgroundColor: '#1AAD19',
                                borderRadius: '50%',
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3
                            }}>
                                <Group sx={{ fontSize: 48, color: 'white' }} />
                            </Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1D1B20' }}>
                                智能推荐
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                自动计算交集，推荐最优时间段，支持热力图展示
                            </Typography>
                        </Card>

                        <Card
                            elevation={0}
                            sx={{
                                p: 4,
                                textAlign: "center",
                                backgroundColor: '#E8F5E9',
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
                                },
                            }}
                        >
                            <Box sx={{
                                backgroundColor: '#2BA245',
                                borderRadius: '50%',
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3
                            }}>
                                <Schedule sx={{ fontSize: 48, color: 'white' }} />
                            </Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1D1B20' }}>
                                时区支持
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                跨时区团队协作无忧，自动处理时区转换
                            </Typography>
                        </Card>
                    </Box>

                    {/* Use Cases */}
                    <Box sx={{ mt: 10, textAlign: "center", width: '100%' }}>
                        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                            适用场景
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                justifyContent: "center",
                            }}
                        >
                            {["团队活动", "面试安排", "朋友聚会", "学习小组", "活动策划", "项目会议"].map(
                                (useCase) => (
                                    <Paper
                                        key={useCase}
                                        elevation={0}
                                        sx={{
                                            px: 4,
                                            py: 2,
                                            borderRadius: 30,
                                            backgroundColor: 'white',
                                            border: '2px solid #E7E0EC',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: '#F6EDFF',
                                                borderColor: '#6750A4',
                                                transform: 'scale(1.05)',
                                            }
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1D1B20' }}>
                                            {useCase}
                                        </Typography>
                                    </Paper>
                                )
                            )}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
