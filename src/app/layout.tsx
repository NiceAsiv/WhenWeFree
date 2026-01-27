import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import { AppProvider } from "@/contexts/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "When We Free - 一起有空 | 找到共同空闲时间",
    description: "通过填写个人空闲时间，智能找出多人共同可用的时间段，让活动安排变得简单高效。支持时区转换、热力图展示、智能推荐。",
    icons: {
        icon: '/logo/logo.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN">
            <body className={inter.className}>
                <AppProvider>
                    <ThemeRegistry>{children}</ThemeRegistry>
                </AppProvider>
            </body>
        </html>
    );
}

