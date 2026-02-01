/**
 * 时区数据和工具函数
 * 格式: (GMT+XX:XX) 时区名称 - 城市
 */

export interface TimezoneOption {
    value: string; // IANA 时区标识符
    label: string; // 显示文本，格式：(GMT+08:00) 中国标准时间 - 北京
    offset: string; // GMT偏移量，如 "+08:00"
    name: string; // 时区名称，如 "中国标准时间"
    city: string; // 城市名称，如 "北京"
}

export const TIMEZONES: TimezoneOption[] = [
    // 亚洲时区
    { value: 'Asia/Shanghai', offset: '+08:00', name: '中国标准时间', city: '北京', label: '(GMT+08:00) 中国标准时间 - 北京' },
    { value: 'Asia/Hong_Kong', offset: '+08:00', name: '香港时间', city: '香港', label: '(GMT+08:00) 香港时间 - 香港' },
    { value: 'Asia/Taipei', offset: '+08:00', name: '台北时间', city: '台北', label: '(GMT+08:00) 台北时间 - 台北' },
    { value: 'Asia/Tokyo', offset: '+09:00', name: '日本标准时间', city: '东京', label: '(GMT+09:00) 日本标准时间 - 东京' },
    { value: 'Asia/Seoul', offset: '+09:00', name: '韩国标准时间', city: '首尔', label: '(GMT+09:00) 韩国标准时间 - 首尔' },
    { value: 'Asia/Singapore', offset: '+08:00', name: '新加坡时间', city: '新加坡', label: '(GMT+08:00) 新加坡时间 - 新加坡' },
    { value: 'Asia/Bangkok', offset: '+07:00', name: '印度支那时间', city: '曼谷', label: '(GMT+07:00) 印度支那时间 - 曼谷' },
    { value: 'Asia/Dubai', offset: '+04:00', name: '海湾标准时间', city: '迪拜', label: '(GMT+04:00) 海湾标准时间 - 迪拜' },
    { value: 'Asia/Kolkata', offset: '+05:30', name: '印度标准时间', city: '加尔各答', label: '(GMT+05:30) 印度标准时间 - 加尔各答' },
    
    // 欧洲时区
    { value: 'Europe/London', offset: '+00:00', name: '格林威治标准时间', city: '伦敦', label: '(GMT+00:00) 格林威治标准时间 - 伦敦' },
    { value: 'Europe/Paris', offset: '+01:00', name: '中欧时间', city: '巴黎', label: '(GMT+01:00) 中欧时间 - 巴黎' },
    { value: 'Europe/Berlin', offset: '+01:00', name: '中欧时间', city: '柏林', label: '(GMT+01:00) 中欧时间 - 柏林' },
    { value: 'Europe/Rome', offset: '+01:00', name: '中欧时间', city: '罗马', label: '(GMT+01:00) 中欧时间 - 罗马' },
    { value: 'Europe/Moscow', offset: '+03:00', name: '莫斯科标准时间', city: '莫斯科', label: '(GMT+03:00) 莫斯科标准时间 - 莫斯科' },
    
    // 美洲时区
    { value: 'America/New_York', offset: '-05:00', name: '美国东部时间', city: '纽约', label: '(GMT-05:00) 美国东部时间 - 纽约' },
    { value: 'America/Chicago', offset: '-06:00', name: '美国中部时间', city: '芝加哥', label: '(GMT-06:00) 美国中部时间 - 芝加哥' },
    { value: 'America/Denver', offset: '-07:00', name: '美国山地时间', city: '丹佛', label: '(GMT-07:00) 美国山地时间 - 丹佛' },
    { value: 'America/Los_Angeles', offset: '-08:00', name: '美国太平洋时间', city: '洛杉矶', label: '(GMT-08:00) 美国太平洋时间 - 洛杉矶' },
    { value: 'America/Anchorage', offset: '-09:00', name: '阿拉斯加时间', city: '安克雷奇', label: '(GMT-09:00) 阿拉斯加时间 - 安克雷奇' },
    { value: 'America/Toronto', offset: '-05:00', name: '加拿大东部时间', city: '多伦多', label: '(GMT-05:00) 加拿大东部时间 - 多伦多' },
    { value: 'America/Vancouver', offset: '-08:00', name: '加拿大太平洋时间', city: '温哥华', label: '(GMT-08:00) 加拿大太平洋时间 - 温哥华' },
    { value: 'America/Sao_Paulo', offset: '-03:00', name: '巴西利亚时间', city: '圣保罗', label: '(GMT-03:00) 巴西利亚时间 - 圣保罗' },
    
    // 大洋洲时区
    { value: 'Australia/Sydney', offset: '+11:00', name: '澳大利亚东部时间', city: '悉尼', label: '(GMT+11:00) 澳大利亚东部时间 - 悉尼' },
    { value: 'Australia/Melbourne', offset: '+11:00', name: '澳大利亚东部时间', city: '墨尔本', label: '(GMT+11:00) 澳大利亚东部时间 - 墨尔本' },
    { value: 'Australia/Perth', offset: '+08:00', name: '澳大利亚西部时间', city: '珀斯', label: '(GMT+08:00) 澳大利亚西部时间 - 珀斯' },
    { value: 'Pacific/Auckland', offset: '+13:00', name: '新西兰标准时间', city: '奥克兰', label: '(GMT+13:00) 新西兰标准时间 - 奥克兰' },
    
    // 其他
    { value: 'UTC', offset: '+00:00', name: '协调世界时', city: 'UTC', label: '(GMT+00:00) 协调世界时 - UTC' },
];

/**
 * 根据IANA时区标识符获取格式化的时区显示文本
 */
export function getTimezoneLabel(timezone: string): string {
    const tz = TIMEZONES.find(t => t.value === timezone);
    return tz ? tz.label : timezone;
}

/**
 * 根据IANA时区标识符获取时区选项对象
 */
export function getTimezoneOption(timezone: string): TimezoneOption | undefined {
    return TIMEZONES.find(t => t.value === timezone);
}

/**
 * 获取用户当前的时区
 */
export function getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * 获取当前时区对应的TimezoneOption，如果不在列表中则返回默认的Asia/Shanghai
 */
export function getCurrentTimezoneOption(): TimezoneOption {
    const userTz = getUserTimezone();
    const option = getTimezoneOption(userTz);
    
    // 如果找到了，返回该选项
    if (option) {
        return option;
    }
    
    // 如果没找到，返回默认的北京时间
    return TIMEZONES[0]; // Asia/Shanghai
}
