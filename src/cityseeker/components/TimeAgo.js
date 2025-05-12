import React from 'react';
import {View, Text} from 'react-native';

function numpf_ar(n, a) {
    return a[
        n === 0
            ? 0
            : n === 1
            ? 1
            : n === 2
            ? 2
            : n % 100 >= 3 && n % 100 <= 10
            ? 3
            : n % 100 >= 11
            ? 4
            : 5
    ];
}

function numpf_ru(n: number, f: string, s: string, t: string): string {
    // f - 1, 21, 31, ...
    // s - 2-4, 22-24, 32-34 ...
    // t - 5-20, 25-30, ...
    var n10 = n % 10;
    if (n10 === 1 && (n === 1 || n > 20)) {
        return f;
    } else if (n10 > 1 && n10 < 5 && (n > 20 || n < 10)) {
        return s;
    } else {
        return t;
    }
}

export const i18n = {
    ar: {
        prefixAgo: 'منذ',
        prefixFromNow: 'بعد',
        suffixAgo: null,
        suffixFromNow: null, // null OR "من الآن"
        second: function(value) {
            return numpf_ar(value, [
                'أقل من ثانية',
                'ثانية واحدة',
                'ثانيتين',
                '%d ثوانٍ',
                '%d ثانية',
                '%d ثانية',
            ]);
        },
        seconds: function(value) {
            return numpf_ar(value, [
                'أقل من ثانية',
                'ثانية واحدة',
                'ثانيتين',
                '%d ثوانٍ',
                '%d ثانية',
                '%d ثانية',
            ]);
        },
        minute: function(value) {
            return numpf_ar(value, [
                'أقل من دقيقة',
                'دقيقة واحدة',
                'دقيقتين',
                '%d دقائق',
                '%d دقيقة',
                'دقيقة',
            ]);
        },
        minutes: function(value) {
            return numpf_ar(value, [
                'أقل من دقيقة',
                'دقيقة واحدة',
                'دقيقتين',
                '%d دقائق',
                '%d دقيقة',
                'دقيقة',
            ]);
        },
        hour: function(value) {
            return numpf_ar(value, [
                'أقل من ساعة',
                'ساعة واحدة',
                'ساعتين',
                '%d ساعات',
                '%d ساعة',
                '%d ساعة',
            ]);
        },
        hours: function(value) {
            return numpf_ar(value, [
                'أقل من ساعة',
                'ساعة واحدة',
                'ساعتين',
                '%d ساعات',
                '%d ساعة',
                '%d ساعة',
            ]);
        },
        day: function(value) {
            return numpf_ar(value, [
                'أقل من يوم',
                'يوم واحد',
                'يومين',
                '%d أيام',
                '%d يومًا',
                '%d يوم',
            ]);
        },
        days: function(value) {
            return numpf_ar(value, [
                'أقل من يوم',
                'يوم واحد',
                'يومين',
                '%d أيام',
                '%d يومًا',
                '%d يوم',
            ]);
        },
        month: function(value) {
            return numpf_ar(value, [
                'أقل من شهر',
                'شهر واحد',
                'شهرين',
                '%d أشهر',
                '%d شهرًا',
                '%d شهر',
            ]);
        },
        months: function(value) {
            return numpf_ar(value, [
                'أقل من شهر',
                'شهر واحد',
                'شهرين',
                '%d أشهر',
                '%d شهرًا',
                '%d شهر',
            ]);
        },
        year: function(value) {
            return numpf_ar(value, [
                'أقل من عام',
                'عام واحد',
                '%d عامين',
                '%d أعوام',
                '%d عامًا',
            ]);
        },
        years: function(value) {
            return numpf_ar(value, [
                'أقل من عام',
                'عام واحد',
                'عامين',
                '%d أعوام',
                '%d عامًا',
                '%d عام',
            ]);
        },
    },
    da: {
        prefixAgo: 'for',
        prefixFromNow: 'om',
        suffixAgo: 'siden',
        suffixFromNow: '',
        seconds: 'mindre end et minut',
        minute: 'ca. et minut',
        minutes: '%d minutter',
        hour: 'ca. en time',
        hours: 'ca. %d timer',
        day: 'en dag',
        days: '%d dage',
        month: 'ca. en måned',
        months: '%d måneder',
        year: 'ca. et år',
        years: '%d år',
    },
    de: {
        prefixAgo: 'vor',
        prefixFromNow: 'in',
        suffixAgo: '',
        suffixFromNow: '',
        seconds: 'wenigen Sekunden',
        minute: 'etwa einer Minute',
        minutes: '%d Minuten',
        hour: 'etwa einer Stunde',
        hours: '%d Stunden',
        day: 'etwa einem Tag',
        days: '%d Tagen',
        month: 'etwa einem Monat',
        months: '%d Monaten',
        year: 'etwa einem Jahr',
        years: '%d Jahren',
    },
    el: {
        prefixAgo: 'πριν',
        prefixFromNow: 'σε',
        suffixAgo: '',
        suffixFromNow: '',
        seconds: 'λιγότερο από ένα λεπτό',
        minute: 'περίπου ένα λεπτό',
        minutes: '%d λεπτά',
        hour: 'περίπου μία ώρα',
        hours: 'περίπου %d ώρες',
        day: 'μία μέρα',
        days: '%d μέρες',
        month: 'περίπου ένα μήνα',
        months: '%d μήνες',
        year: 'περίπου ένα χρόνο',
        years: '%d χρόνια',
    },
    en: {
        prefixAgo: null,
        prefixFromNow: 'In',
        suffixAgo: 'Ago',
        suffixFromNow: null,
        seconds: 'Less Than A Minute',
        minute: 'About A Minute',
        minutes: '%d Minutes',
        hour: 'About An Hour',
        hours: 'About %d Hours',
        day: 'A Day',
        days: '%d Days',
        month: 'About A Month',
        months: '%d Months',
        year: 'About A Year',
        years: '%d Years',
        wordSeparator: ' ',
    },
    es: {
        prefixAgo: 'hace',
        prefixFromNow: 'dentro de',
        suffixAgo: '',
        suffixFromNow: '',
        seconds: 'menos de un minuto',
        minute: 'un minuto',
        minutes: 'unos %d minutos',
        hour: 'una hora',
        hours: '%d horas',
        day: 'un día',
        days: '%d días',
        month: 'un mes',
        months: '%d meses',
        year: 'un año',
        years: '%d años',
    },
    fa: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: 'پیش',
        suffixFromNow: 'از حال',
        seconds: 'کمتر از یک دقیقه',
        minute: 'حدود یک دقیقه',
        minutes: '%d دقیقه',
        hour: 'حدود یک ساعت',
        hours: 'حدود %d ساعت',
        day: 'یک روز',
        days: '%d روز',
        month: 'حدود یک ماه',
        months: '%d ماه',
        year: 'حدود یک سال',
        years: '%d سال',
        wordSeparator: ' ',
    },
    fi: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: 'sitten',
        suffixFromNow: 'tulevaisuudessa',
        seconds: 'alle minuutti',
        minute: 'minuutti',
        minutes: '%d minuuttia',
        hour: 'tunti',
        hours: '%d tuntia',
        day: 'päivä',
        days: '%d päivää',
        month: 'kuukausi',
        months: '%d kuukautta',
        year: 'vuosi',
        years: '%d vuotta',
    },
    fr: {
        prefixAgo: 'Il y a',
        prefixFromNow: 'Dans',
        seconds: "moins d'une minute",
        minute: 'environ une minute',
        minutes: 'environ %d minutes',
        hour: 'environ une heure',
        hours: 'environ %d heures',
        day: 'environ un jour',
        days: 'environ %d jours',
        month: 'environ un mois',
        months: 'environ %d mois',
        year: 'un an',
        years: '%d ans',
    },
    he: {
        prefixAgo: 'לפני',
        prefixFromNow: 'עוד',
        seconds: 'פחות מדקה',
        minute: 'דקה',
        minutes: '%d דקות',
        hour: 'שעה',
        hours: function(number) {
            return number === 2 ? 'שעתיים' : '%d שעות';
        },
        day: 'יום',
        days: function(number) {
            return number === 2 ? 'יומיים' : '%d ימים';
        },
        month: 'חודש',
        months: function(number) {
            return number === 2 ? 'חודשיים' : '%d חודשים';
        },
        year: 'שנה',
        years: function(number) {
            return number === 2 ? 'שנתיים' : '%d שנים';
        },
    },
    it: {
        suffixAgo: 'fa',
        suffixFromNow: 'da ora',
        seconds: 'meno di un minuto',
        minute: 'circa un minuto',
        minutes: '%d minuti',
        hour: "circa un'ora",
        hours: 'circa %d ore',
        day: 'un giorno',
        days: '%d giorni',
        month: 'circa un mese',
        months: '%d mesi',
        year: 'circa un anno',
        years: '%d anni',
    },
    ja: {
        prefixAgo: '',
        prefixFromNow: '今から',
        suffixAgo: '前',
        suffixFromNow: '後',
        seconds: '1 分未満',
        minute: '約 1 分',
        minutes: '%d 分',
        hour: '約 1 時間',
        hours: '約 %d 時間',
        day: '約 1 日',
        days: '約 %d 日',
        month: '約 1 ヶ月',
        months: '約 %d ヶ月',
        year: '約 1 年',
        years: '約 %d 年',
        wordSeparator: '',
    },
    ko: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: '전',
        suffixFromNow: '후',
        seconds: '방금',
        minute: '약 1분',
        minutes: '%d분',
        hour: '약 1시간',
        hours: '약 %d시간',
        day: '하루',
        days: '%d일',
        week: '약 1주',
        weeks: '%d주',
        month: '약 1개월',
        months: '%d개월',
        year: '약 1년',
        years: '%d년',
        wordSeparator: ' ',
    },
    pt: {
        suffixAgo: 'atrás',
        suffixFromNow: 'a partir de agora',
        seconds: 'menos de um minuto',
        minute: 'cerca de um minuto',
        minutes: '%d minutos',
        hour: 'cerca de uma hora',
        hours: 'cerca de %d horas',
        day: 'um dia',
        days: '%d dias',
        month: 'cerca de um mês',
        months: '%d meses',
        year: 'cerca de um ano',
        years: '%d anos',
    },
    ru: {
        prefixAgo: null,
        prefixFromNow: 'через',
        suffixAgo: 'назад',
        suffixFromNow: null,
        seconds: 'меньше минуты',
        minute: 'минуту',
        minutes: function(value) {
            return numpf_ru(value, '%d минута', '%d минуты', '%d минут');
        },
        hour: 'час',
        hours: function(value) {
            return numpf_ru(value, '%d час', '%d часа', '%d часов');
        },
        day: 'день',
        days: function(value) {
            return numpf_ru(value, '%d день', '%d дня', '%d дней');
        },
        month: 'месяц',
        months: function(value) {
            return numpf_ru(value, '%d месяц', '%d месяца', '%d месяцев');
        },
        year: 'год',
        years: function(value) {
            return numpf_ru(value, '%d год', '%d года', '%d лет');
        },
    },
    th: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: 'ที่แล้ว',
        suffixFromNow: 'จากตอนนี้',
        seconds: 'น้อยกว่าหนึ่งนาที',
        minute: 'ประมาณหนึ่งนาที',
        minutes: '%d นาที',
        hour: 'ประมาณหนึ่งชั่วโมง',
        hours: 'ประมาณ %d ชั่วโมง',
        day: 'หนึ่งวัน',
        days: '%d วัน',
        month: 'ประมาณหนึ่งเดือน',
        months: '%d เดือน',
        year: 'ประมาณหนึ่งปี',
        years: '%d ปี',
        wordSeparator: '',
    },
    tr: {
        suffixAgo: 'önce',
        suffixFromNow: null,
        seconds: '1 dakikadan',
        minute: '1 dakika',
        minutes: '%d dakika',
        hour: '1 saat',
        hours: '%d saat',
        day: '1 gün',
        days: '%d gün',
        month: '1 ay',
        months: '%d ay',
        year: '1 yıl',
        years: '%d yıl',
    },
    vi: {
        prefixAgo: 'cách đây',
        prefixFromNow: null,
        suffixAgo: null,
        suffixFromNow: 'trước',
        seconds: 'chưa đến 1 phút',
        minute: 'khoảng 1 phút',
        minutes: '%d phút',
        hour: 'khoảng 1 tiếng',
        hours: 'khoảng %d tiếng',
        day: '1 ngày',
        days: '%d ngày',
        month: 'khoảng 1 tháng',
        months: '%d tháng',
        year: 'khoảng 1 năm',
        years: '%d năm',
        wordSeparator: ' ',
    },
    'zh-CN': {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: '前',
        suffixFromNow: '后',
        seconds: '不到1分钟',
        minute: '大约1分钟',
        minutes: '%d分钟',
        hour: '大约1小时',
        hours: '大约%d小时',
        day: '1天',
        days: '%d天',
        week: '大约1周',
        weeks: '%d周',
        month: '大约1个月',
        months: '%d个月',
        year: '大约1年',
        years: '%d年',
        wordSeparator: '',
    },
    'zh-HK': {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: '之前',
        suffixFromNow: '之後',
        seconds: '不到1分鐘',
        minute: '大約1分鐘',
        minutes: '%d分鐘',
        hour: '大約1小時',
        hours: '%d小時',
        day: '大約1天',
        days: '%d天',
        month: '大約1個月',
        months: '%d個月',
        year: '大約1年',
        years: '%d年',
        wordSeparator: '',
    },
};

type StringOrFn = string | ((value: number, millisDelta: number) => string);

type NumberArray = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
];

export type Unit =
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'
    | 'week'
    | 'month'
    | 'year';

export type Suffix = 'ago' | 'from now';

export function defaultFormatter(
    value: number,
    unit: string,
    suffix: string,
): string {
    if (value !== 1) {
        unit += 's';
    }

    return value + ' ' + unit + ' ' + suffix;
}

export type Formatter = (
    value: number,
    unit: Unit,
    suffix: Suffix,
    epochMiliseconds: number,
    nextFormatter: () => React.Component,
    now: () => number,
) => React.Component;

export type Props = {
    live: boolean,
    component: string,
    minPeriod: number,
    maxPeriod: number,
    formatter: Formatter,
    now: () => number,
    title?: string,
    date: string | number | Date,
};

type DefaultProps = {
    live: boolean,
    component: string,
    minPeriod: number,
    maxPeriod: number,
    formatter: Formatter,
    now: () => number,
};

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

export default class TimeAgo extends React.Component<Props> {
    static displayName = 'TimeAgo';
    static defaultProps = {
        live: true,
        component: 'time',
        minPeriod: 0,
        maxPeriod: Infinity,
        formatter: defaultFormatter,
        now: () => Date.now(),
    };

    timeoutId = null;
    isStillMounted = false;

    componentDidMount() {
        this.isStillMounted = true;

        if (this.props.live) {
            this.tick(true);
        }
    }

    componentDidUpdate(lastProps: Props) {
        if (
            this.props.live !== lastProps.live ||
            this.props.date !== lastProps.date
        ) {
            if (!this.props.live && this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.tick();
        }
    }

    componentWillUnmount() {
        this.isStillMounted = false;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = undefined;
        }
    }

    tick = refresh => {
        if (!this.isStillMounted || !this.props.live) {
            return;
        }

        const then = this.dateParser(this.props.date).valueOf();

        if (!then) {
            return;
        }

        const now = this.props.now();
        const seconds = Math.round(Math.abs(now - then) / 1000);

        const unboundPeriod =
            seconds < MINUTE
                ? 1000
                : seconds < HOUR
                ? 1000 * MINUTE
                : seconds < DAY
                ? 1000 * HOUR
                : 0;

        const period = Math.min(
            Math.max(unboundPeriod, this.props.minPeriod * 1000),
            this.props.maxPeriod * 1000,
        );

        if (period) {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }

            this.timeoutId = setTimeout(this.tick, period);
        }

        if (!refresh) {
            this.forceUpdate();
        }
    };

    formatter = (strings: Object) => {
        var normalizeNumber = (numbers: ?NumberArray, value: number) => {
            return numbers && numbers.length === 10
                ? String(value)
                      .split('')
                      .map((digit: string) =>
                          digit.match(/^[0-9]$/)
                              ? ((numbers: any): NumberArray)[parseInt(digit)]
                              : digit,
                      )
                      .join('')
                : String(value);
        };

        var normalizeFn = (
            value: number,
            distanceMillis: number,
            numbers?: NumberArray,
        ) => (stringOrFn: StringOrFn) =>
            typeof stringOrFn === 'function'
                ? stringOrFn(value, distanceMillis).replace(
                      /%d/g,
                      normalizeNumber(numbers, value),
                  )
                : stringOrFn.replace(/%d/g, normalizeNumber(numbers, value));

        return function(
            value: number,
            unit: Unit,
            suffix: Suffix,
            epochMiliseconds: number,
            _nextFormmater: () => React.ComponentElement,
            now: () => number,
        ) {
            const current = now();

            if (unit === 'week' && !strings.week && !strings.weeks) {
                const days = Math.round(
                    Math.abs(epochMiliseconds - current) /
                        (1000 * 60 * 60 * 24),
                );
                value = days;
                unit = 'day';
            }

            // create a normalize function for given value
            const normalize = normalizeFn(
                value,
                current - epochMiliseconds,
                strings.numbers !== undefined && strings.numbers !== null
                    ? strings.numbers
                    : undefined,
            );

            // The eventual return value stored in an array so that the wordSeparator can be used
            let dateString: Array<string> = [];

            // handle prefixes
            if (suffix === 'ago' && strings.prefixAgo) {
                dateString.push(normalize(strings.prefixAgo));
            }

            if (suffix === 'from now' && strings.prefixFromNow) {
                dateString.push(normalize(strings.prefixFromNow));
            }

            // Handle Main number and unit
            const isPlural = value > 1;

            if (isPlural) {
                const stringFn: StringOrFn =
                    strings[unit + 's'] || strings[unit] || '%d ' + unit;
                dateString.push(normalize(stringFn));
            } else {
                const stringFn: StringOrFn =
                    strings[unit] || strings[unit + 's'] || '%d ' + unit;
                dateString.push(normalize(stringFn));
            }

            // Handle Suffixes
            if (suffix === 'ago' && strings.suffixAgo) {
                dateString.push(normalize(strings.suffixAgo));
            }

            if (suffix === 'from now' && strings.suffixFromNow) {
                dateString.push(normalize(strings.suffixFromNow));
            }

            // join the array into a string and return it
            const wordSeparator =
                typeof strings.wordSeparator === 'string'
                    ? strings.wordSeparator
                    : ' ';

            return dateString.join(wordSeparator);
        };
    };

    dateParser = date => {
        let parsed = new Date(date);

        if (!Number.isNaN(parsed.valueOf())) {
            return parsed;
        }

        let parts = String(date).match(/\d+/g);

        if (parts === null || parts.length <= 2) {
            return parsed;
        } else {
            const [firstP, secondP, ...restPs] = parts.map(x => parseInt(x));
            const correctedParts = [firstP, secondP - 1, ...restPs];
            let isoDate = new Date(Date.UTC(...correctedParts));

            return isoDate;
        }
    };

    render() {
        const {date, now, containerStyle, textStyle, system} = this.props;

        const then = this.dateParser(date).valueOf();

        if (!then) {
            return null;
        }

        const timeNow = now();

        const seconds = Math.round(Math.abs(timeNow - then) / 1000);

        const suffix = then < timeNow ? 'ago' : 'from now';

        const [value, unit] =
            seconds < MINUTE
                ? [Math.round(seconds), 'second']
                : seconds < HOUR
                ? [Math.round(seconds / MINUTE), 'minute']
                : seconds < DAY
                ? [Math.round(seconds / HOUR), 'hour']
                : seconds < WEEK
                ? [Math.round(seconds / DAY), 'day']
                : seconds < MONTH
                ? [Math.round(seconds / WEEK), 'week']
                : seconds < YEAR
                ? [Math.round(seconds / MONTH), 'month']
                : [Math.round(seconds / YEAR), 'year'];

        const nextFormatter = defaultFormatter(value, unit, suffix);

        return (
            <View style={containerStyle}>
                <Text style={textStyle}>
                    {this.formatter(i18n[system.locale || 'en'])(
                        value,
                        unit,
                        suffix,
                        then,
                        nextFormatter,
                        now,
                    )}
                </Text>
            </View>
        );
    }
}
