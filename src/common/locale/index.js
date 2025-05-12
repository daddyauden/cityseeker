import {I18nManager} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import I18n from 'i18n-js';

import * as en from './locales/en';
import * as fr from './locales/fr';
import * as zh_CN from './locales/zh-CN';
import * as zh_HK from './locales/zh-HK';

export const LANGUAGES = {
    en: en,
    fr: fr,
    'zh-CN': zh_CN,
    'zh-HK': zh_HK,
};

const defaultLocale = {languageTag: 'en', isRTL: false};

const {languageTag, isRTL} =
    RNLocalize.findBestAvailableLanguage(Object.keys(LANGUAGES)) ||
    defaultLocale;

I18nManager.forceRTL(isRTL);

I18n.fallbacks = true;

I18n.defaultSeparator = '&';

I18n.translations = LANGUAGES;

I18n.locale = languageTag;

export default I18n;
