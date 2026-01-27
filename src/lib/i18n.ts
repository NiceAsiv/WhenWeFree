export const translations = {
    zh: {
        // Common
        loading: '加载中...',
        submit: '提交',
        cancel: '取消',
        save: '保存',
        delete: '删除',
        edit: '编辑',
        share: '分享',
        copy: '复制',
        copied: '已复制',

        // Event Page
        eventPage: {
            title: '活动详情',
            viewResults: '查看结果',
            participants: '参与者',
        },

        // Participant Form
        participantForm: {
            yourInfo: '你的信息',
            name: '昵称',
            namePlaceholder: '输入你的昵称',
            email: '邮箱',
            emailPlaceholder: '输入你的邮箱',
            emailRequired: '请输入有效的邮箱地址',
            selectTime: '选择你的空闲时间',
            selectTimeHint: '点击或拖拽选择时间段，绿色表示已选中',
            selectedSlots: '已选择 {count} 个时间段',
            loadingData: '正在加载已有数据...',
            foundPrevious: '✓ 已找到你之前的选择，修改后重新提交即可',
            autoSave: '输入邮箱后自动保存，下次可以继续修改',
            submitTime: '提交我的空闲时间',
            updateTime: '更新我的空闲时间',
            submitting: '提交中...',
            saved: '已保存 "{name}" 的空闲时间！',
            updated: '已更新 "{name}" 的空闲时间！',
            viewAllResults: '→ 点击查看所有人的结果',
            nameMinLength: '请输入至少2个字符的昵称',
        },

        // Share Dialog
        shareDialog: {
            title: '分享活动链接',
            description: '将此链接分享给参与者，让他们填写空闲时间',
            eventLink: '活动链接',
            copyLink: '复制链接',
            linkCopied: '链接已复制到剪贴板！',
            qrCode: '二维码',
            scanToJoin: '扫码参与',
        },

        // Settings
        settings: {
            darkMode: '深色模式',
            language: '语言',
            chinese: '中文',
            english: 'English',
        },
    },
    en: {
        // Common
        loading: 'Loading...',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        share: 'Share',
        copy: 'Copy',
        copied: 'Copied',

        // Event Page
        eventPage: {
            title: 'Event Details',
            viewResults: 'View Results',
            participants: 'Participants',
        },

        // Participant Form
        participantForm: {
            yourInfo: 'Your Information',
            name: 'Name',
            namePlaceholder: 'Enter your name',
            email: 'Email',
            emailPlaceholder: 'Enter your email',
            emailRequired: 'Please enter a valid email address',
            selectTime: 'Select Your Available Time',
            selectTimeHint: 'Click or drag to select time slots, green indicates selected',
            selectedSlots: '{count} time slots selected',
            loadingData: 'Loading existing data...',
            foundPrevious: '✓ Found your previous selection, resubmit after modification',
            autoSave: 'Auto-save after entering email, you can modify later',
            submitTime: 'Submit My Availability',
            updateTime: 'Update My Availability',
            submitting: 'Submitting...',
            saved: 'Saved "{name}"\'s availability!',
            updated: 'Updated "{name}"\'s availability!',
            viewAllResults: '→ Click to view all results',
            nameMinLength: 'Please enter at least 2 characters',
        },

        // Share Dialog
        shareDialog: {
            title: 'Share Event Link',
            description: 'Share this link with participants to collect their availability',
            eventLink: 'Event Link',
            copyLink: 'Copy Link',
            linkCopied: 'Link copied to clipboard!',
            qrCode: 'QR Code',
            scanToJoin: 'Scan to Join',
        },

        // Settings
        settings: {
            darkMode: 'Dark Mode',
            language: 'Language',
            chinese: '中文',
            english: 'English',
        },
    },
};

export type Language = keyof typeof translations;
export type TranslationKey = typeof translations.zh;

export function getTranslation(lang: Language, key: string): string {
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}

export function t(lang: Language, key: string, params?: Record<string, string | number>): string {
    let text = getTranslation(lang, key);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            text = text.replace(`{${key}}`, String(value));
        });
    }

    return text;
}
