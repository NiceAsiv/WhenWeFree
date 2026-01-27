'use client';

import { useApp } from '@/contexts/AppContext';
import { t as translate } from '@/lib/i18n';

export function useTranslation() {
    const { language } = useApp();

    const t = (key: string, params?: Record<string, string | number>): string => {
        return translate(language, key, params);
    };

    return { t, language };
}
