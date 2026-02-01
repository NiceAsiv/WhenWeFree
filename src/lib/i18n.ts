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
        back: '返回',
        home: '首页',

        // Home Page
        homePage: {
            title: 'When We Free?',
            subtitle: '找到大家都有空的时间，让活动安排变得简单',
            createEvent: '创建活动',
            features: {
                simple: {
                    title: '简单易用',
                    description: '创建活动，分享链接，参与者快速填写空闲时间',
                },
                smart: {
                    title: '智能推荐',
                    description: '自动计算交集，推荐最优时间段，支持热力图展示',
                },
                timezone: {
                    title: '时区支持',
                    description: '跨时区团队协作无忧，自动处理时区转换',
                },
            },
            useCases: {
                title: '适用场景',
                teamActivity: '团队活动',
                interview: '面试安排',
                gathering: '朋友聚会',
                studyGroup: '学习小组',
                eventPlanning: '活动策划',
                meeting: '项目会议',
            },
        },

        // Event Page
        eventPage: {
            title: '活动详情',
            viewResults: '查看结果',
            shareEvent: '分享活动',
            participants: '参与者',
        },

        // Results Page
        resultsPage: {
            title: '{title} - 结果',
            responsesCount: '已收到 {count} 份回复',
            heatmap: '热力图',
            allAvailable: '全员可用',
            recommended: '推荐时间',
            heatmapTitle: '可用人数热力图',
            heatmapDescription: '颜色越深表示可用人数越多',
            allAvailableTitle: '全员共同可用时间段',
            noCommonSlots: '暂无全员共同可用的时间段',
            allParticipantsAvailable: '所有参与者都有空',
            recommendedTitle: '推荐时间段（按人数排序）',
            recommendedDescription: '显示参与人数最多的时间段',
            noRecommendedSlots: '暂无推荐时间段',
            minCount: '最少 {count} 人',
            avgCount: '平均 {count} 人可用',
            participantsList: '参与者列表',
            slotsSelected: '已选择 {count} 个时间段',
            anonymousParticipant: '匿名参与者',
            people: '人',
        },

        // Create Event Page
        createEvent: {
            title: '创建新活动',
            subtitle: '找到大家都有空的时间',
            steps: {
                basicInfo: '基本信息',
                selectMode: '选择模式',
                timeConfig: '时间配置',
            },
            basicInfo: {
                title: '活动标题',
                titlePlaceholder: '例如：周末聚餐、团队建设、电影之夜',
                description: '活动描述（可选）',
                descriptionPlaceholder: '添加活动的更多信息...',
                errorTitleRequired: '请输入活动标题',
            },
            modeSelection: {
                title: '选择活动模式',
                timeRange: {
                    title: '约时间段',
                    description: '选择具体的时间段，如 9:00-10:00、14:00-15:00',
                    suitable: '适合：团队会议、面试安排、工作协调',
                },
                fullDay: {
                    title: '约整天',
                    description: '选择完整的日期，不区分具体时间',
                    suitable: '适合：团建活动、聚餐聚会、出游计划',
                },
            },
            timeConfig: {
                dateRange: '日期范围',
                maxDays: '（最多14天）',
                startDate: '开始日期',
                endDate: '结束日期',
                daysCount: '✓ 共 {count} 天',
                timeDivision: '时间划分方式',
                standardMode: {
                    title: '标准模式',
                    description: '自定义开始/结束时间和时间间隔',
                    settings: '详细设置',
                    dayStartTime: '每天开始时间',
                    dayEndTime: '每天结束时间',
                    slotDuration: '时间粒度',
                    minDuration: '最短活动时长',
                    minutes: '{count} 分钟',
                    preview: '时间槽预览',
                    slotsCount: '共 {days} 天 × {slots} 个时段 = {total} 个选项',
                    moreSlots: '...等{count}个',
                },
                periodMode: {
                    title: '按时段划分',
                    description: '上午、下午、晚上（简单快捷）',
                    morning: '上午',
                    afternoon: '下午',
                    evening: '晚上',
                    preview: '时间段预览',
                },
                customMode: {
                    title: '自定义选项',
                    description: '自己添加时间段选项（晚餐时间段：17:00-18:00）',
                    sectionTitle: '自定义时间段',
                    preview: '已添加的时间段预览',
                    addNew: '添加新时间段',
                    label: '标签',
                    labelPlaceholder: '例如：下午 4-5',
                    startTime: '开始时间',
                    endTime: '结束时间',
                    addBtn: '添加时间段',
                    delete: '删除',
                    errorLabel: '请输入时间段标签',
                    errorTime: '请设置开始和结束时间',
                    errorTimeOrder: '开始时间必须早于结束时间',
                    errorOverlap: '时间段与「{label}」重叠，请调整时间',
                },
                errors: {
                    dateOrder: '结束日期不能早于开始日期',
                    dateRangeLimit: '约时间段模式日期范围最多14天',
                },
            },
            actions: {
                prev: '上一步',
                next: '下一步',
                create: '创建活动',
                creating: '创建中...',
                failed: '创建失败',
            },
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
            foundPrevious: '已找到你之前的选择，修改后重新提交即可',
            autoSave: '输入邮箱后自动保存，下次可以继续修改',
            submitTime: '提交我的空闲时间',
            updateTime: '更新我的空闲时间',
            submitting: '提交中...',
            saved: '已保存 "{name}" 的空闲时间！',
            updated: '已更新 "{name}" 的空闲时间！',
            viewAllResults: '→ 点击查看所有人的结果',
            nameMinLength: '请输入至少2个字符的昵称',
            timezoneSettings: '时区设置',
            selectTimezone: '选择你查看时间的时区',
            currentTimezone: '当前显示时区',
            timezoneNotice: '你正在以 <strong>{timezone}</strong> 查看时间。你选择的时间会自动转换为活动时区保存。',
            fullDay: '全天',
            morning: '上午 9-12',
            afternoon: '下午 12-18',
            evening: '晚上 18-22',
            errorSelectSlots: '请至少选择一个时间段',
            errorNameMinLength: '请输入至少2个字符的昵称',
            errorInvalidEmail: '请输入有效的邮箱地址',
            errorSubmitFailed: '提交失败',
            errorSubmitRetry: '提交失败，请重试',
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

        // Auth
        auth: {
            login: '登录',
            logout: '退出登录',
            register: '注册',
            signIn: '登录',
            signUp: '注册',
            email: '邮箱',
            password: '密码',
            confirmPassword: '确认密码',
            forgotPassword: '忘记密码？',
            noAccount: '没有账号？',
            hasAccount: '已有账号？',
            googleSignIn: '使用 Google 登录',
            emailSignIn: '使用邮箱登录',
            orDivider: '或',
            signInTitle: '登录账号',
            signUpTitle: '创建账号',
            welcome: '欢迎回来',
            createAccount: '创建新账号',
            emailPlaceholder: '输入你的邮箱',
            passwordPlaceholder: '输入密码',
            confirmPasswordPlaceholder: '再次输入密码',
            signInWithEmail: '邮箱登录',
            signUpWithEmail: '邮箱注册',
            errors: {
                emailRequired: '请输入邮箱',
                emailInvalid: '请输入有效的邮箱地址',
                passwordRequired: '请输入密码',
                passwordTooShort: '密码至少需要 6 个字符',
                passwordNotMatch: '两次输入的密码不一致',
            },
        },

        // Dashboard
        dashboard: {
            title: '我的活动',
            myEvents: '我创建的活动',
            noEvents: '你还没有创建任何活动',
            createFirst: '创建第一个活动',
            eventCount: '{count} 个活动',
            participants: '参与者',
            responses: '{count} 人回复',
            viewResults: '查看结果',
            edit: '编辑',
            delete: '删除',
            deleteConfirm: '确定要删除这个活动吗？',
            deleteSuccess: '活动已删除',
            createdAt: '创建于',
        },

        // Not Found
        notFound: {
            title: '页面不存在',
            description: '抱歉，您访问的页面不存在或已被删除。',
            hint: '请检查网址是否正确，或返回首页。',
            backToHome: '返回首页',
        },

        // Errors
        errors: {
            loadEventsFailed: '加载活动失败，请刷新页面重试',
            deleteEventFailed: '删除活动失败，请重试',
            googleLoginFailed: 'Google 登录失败，请重试',
            googleLoginNetwork: 'Google 登录失败，请检查网络连接',
            googleLoginNotAvailable: 'Google 登录功能暂未开放',
            googleLoginNotLoaded: 'Google 登录服务未加载，请刷新页面重试',
            googleLoginInitFailed: 'Google 登录初始化失败，请刷新页面重试',
            loginFailed: '登录失败，请重试',
            loginNetwork: '登录失败，请检查网络连接',
            registerFailed: '注册失败，请重试',
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
        back: 'Back',
        home: 'Home',

        // Home Page
        homePage: {
            title: 'When We Free?',
            subtitle: 'Find time for everyone easily',
            createEvent: 'Create Event',
            features: {
                simple: {
                    title: 'Simple & Easy',
                    description: 'Create event, share link, participants fill availability quickly',
                },
                smart: {
                    title: 'Smart Recommendation',
                    description: 'Auto-calculate intersection, recommend best slots, heatmap support',
                },
                timezone: {
                    title: 'Timezone Support',
                    description: 'Seamless cross-timezone collaboration, auto timezone conversion',
                },
            },
            useCases: {
                title: 'Use Cases',
                teamActivity: 'Team Activity',
                interview: 'Interview',
                gathering: 'Friends Gathering',
                studyGroup: 'Study Group',
                eventPlanning: 'Event Planning',
                meeting: 'Project Meeting',
            },
        },

        // Event Page
        eventPage: {
            title: 'Event Details',
            viewResults: 'View Results',
            shareEvent: 'Share Event',
            participants: 'Participants',
        },

        // Results Page
        resultsPage: {
            title: '{title} - Results',
            responsesCount: '{count} responses received',
            heatmap: 'Heatmap',
            allAvailable: 'All Available',
            recommended: 'Recommended',
            heatmapTitle: 'Availability Heatmap',
            heatmapDescription: 'Darker color indicates more people available',
            allAvailableTitle: 'Common Available Slots',
            noCommonSlots: 'No common slots found',
            allParticipantsAvailable: 'All participants available',
            recommendedTitle: 'Recommended Slots (by count)',
            recommendedDescription: 'Slots with most participants',
            noRecommendedSlots: 'No recommended slots found',
            minCount: 'Min {count}',
            avgCount: 'Avg {count} available',
            participantsList: 'Participants List',
            slotsSelected: '{count} slots selected',
            anonymousParticipant: 'Anonymous',
            people: 'people',
        },

        // Create Event Page
        createEvent: {
            title: 'Create New Event',
            subtitle: 'Find time for everyone easily',
            steps: {
                basicInfo: 'Basic Info',
                selectMode: 'Select Mode',
                timeConfig: 'Time Config',
            },
            basicInfo: {
                title: 'Event Title',
                titlePlaceholder: 'e.g., Weekend Dinner, Team Building, Movie Night',
                description: 'Description (Optional)',
                descriptionPlaceholder: 'Add more details about the event...',
                errorTitleRequired: 'Please enter event title',
            },
            modeSelection: {
                title: 'Select Event Mode',
                timeRange: {
                    title: 'Time Range',
                    description: 'Select specific time slots, e.g., 9:00-10:00, 14:00-15:00',
                    suitable: 'Best for: Team meetings, Interviews, Work coordination',
                },
                fullDay: {
                    title: 'Full Day',
                    description: 'Select complete dates, no specific time',
                    suitable: 'Best for: Team building, Gatherings, Trips',
                },
            },
            timeConfig: {
                dateRange: 'Date Range',
                maxDays: '(Max 14 days)',
                startDate: 'Start Date',
                endDate: 'End Date',
                daysCount: '✓ Total {count} days',
                timeDivision: 'Time Division',
                standardMode: {
                    title: 'Standard Mode',
                    description: 'Custom start/end time and interval',
                    settings: 'Detailed Settings',
                    dayStartTime: 'Day Start Time',
                    dayEndTime: 'Day End Time',
                    slotDuration: 'Time Slot Duration',
                    minDuration: 'Min Duration',
                    minutes: '{count} Minutes',
                    preview: 'Slots Preview',
                    slotsCount: 'Total {days} days × {slots} slots = {total} options',
                    moreSlots: '...and {count} more',
                },
                periodMode: {
                    title: 'By Period',
                    description: 'Morning, Afternoon, Evening (Simple & Quick)',
                    morning: 'Morning',
                    afternoon: 'Afternoon',
                    evening: 'Evening',
                    preview: 'Period Preview',
                },
                customMode: {
                    title: 'Custom Options',
                    description: 'Add your own time slots (e.g., Dinner: 17:00-18:00)',
                    sectionTitle: 'Custom Time Slots',
                    preview: 'Added Slots Preview',
                    addNew: 'Add New Slot',
                    label: 'Label',
                    labelPlaceholder: 'e.g., Afternoon 4-5',
                    startTime: 'Start Time',
                    endTime: 'End Time',
                    addBtn: 'Add Slot',
                    delete: 'Delete',
                    errorLabel: 'Please enter slot label',
                    errorTime: 'Please set start and end time',
                    errorTimeOrder: 'Start time must be before end time',
                    errorOverlap: 'Overlap with "{label}", please adjust',
                },
                errors: {
                    dateOrder: 'End date cannot be earlier than start date',
                    dateRangeLimit: 'Time range mode allows max 14 days',
                },
            },
            actions: {
                prev: 'Back',
                next: 'Next',
                create: 'Create Event',
                creating: 'Creating...',
                failed: 'Creation Failed',
            },
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
            timezoneSettings: 'Timezone Settings',
            selectTimezone: 'Select your viewing timezone',
            currentTimezone: 'Current timezone',
            timezoneNotice: 'You are viewing in <strong>{timezone}</strong>. Your selections will be converted to the event timezone.',
            fullDay: 'Full Day',
            morning: 'Morning 9-12',
            afternoon: 'Afternoon 12-18',
            evening: 'Evening 18-22',
            errorSelectSlots: 'Please select at least one time slot',
            errorNameMinLength: 'Please enter at least 2 characters for name',
            errorInvalidEmail: 'Please enter a valid email address',
            errorSubmitFailed: 'Submission failed',
            errorSubmitRetry: 'Submission failed, please try again',
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

        // Auth
        auth: {
            login: 'Login',
            logout: 'Logout',
            register: 'Register',
            signIn: 'Sign In',
            signUp: 'Sign Up',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            forgotPassword: 'Forgot Password?',
            noAccount: 'No account?',
            hasAccount: 'Have an account?',
            googleSignIn: 'Sign in with Google',
            emailSignIn: 'Sign in with Email',
            orDivider: 'or',
            signInTitle: 'Sign In',
            signUpTitle: 'Create Account',
            welcome: 'Welcome Back',
            createAccount: 'Create New Account',
            emailPlaceholder: 'Enter your email',
            passwordPlaceholder: 'Enter password',
            confirmPasswordPlaceholder: 'Confirm password',
            signInWithEmail: 'Sign In with Email',
            signUpWithEmail: 'Sign Up with Email',
            errors: {
                emailRequired: 'Email is required',
                emailInvalid: 'Please enter a valid email',
                passwordRequired: 'Password is required',
                passwordTooShort: 'Password must be at least 6 characters',
                passwordNotMatch: 'Passwords do not match',
            },
        },

        // Dashboard
        dashboard: {
            title: 'My Events',
            myEvents: 'Events I Created',
            noEvents: 'You haven\'t created any events yet',
            createFirst: 'Create your first event',
            eventCount: '{count} events',
            participants: 'Participants',
            responses: '{count} responses',
            viewResults: 'View Results',
            edit: 'Edit',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete this event?',
            deleteSuccess: 'Event deleted',
            createdAt: 'Created at',
        },

        // Not Found
        notFound: {
            title: 'Page Not Found',
            description: 'Sorry, the page you visited does not exist or has been removed.',
            hint: 'Please check the URL or return to the homepage.',
            backToHome: 'Back to Home',
        },

        // Errors
        errors: {
            loadEventsFailed: 'Failed to load events, please refresh the page',
            deleteEventFailed: 'Failed to delete event, please try again',
            googleLoginFailed: 'Google login failed, please try again',
            googleLoginNetwork: 'Google login failed, please check your network connection',
            googleLoginNotAvailable: 'Google login is not available yet',
            googleLoginNotLoaded: 'Google login service not loaded, please refresh the page',
            googleLoginInitFailed: 'Failed to initialize Google login, please refresh the page',
            loginFailed: 'Login failed, please try again',
            loginNetwork: 'Login failed, please check your network connection',
            registerFailed: 'Registration failed, please try again',
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
