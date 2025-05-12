import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import I18n from '../../i18n';

import Common from '../../../common/utils/lib';
import Style from '../../style';

const DateSeparator = React.memo(({ts, unread, locale}) => {
    let date = null;

    if (ts) {
        if (moment(ts).isSame(moment(), 'year')) {
            date =
                Common.dayOfWeek(ts, locale, false) +
                ', ' +
                Common.dayAndMonth(ts, locale);
        } else {
            date =
                Common.dayAndMonthAndYear(ts, locale) +
                ', ' +
                Common.dayOfWeek(ts, locale, false);
        }
    }

    if (ts && unread) {
        return (
            <View style={[Style.h_center, Style.m_v_2]}>
                <Text
                    style={[
                        Style.f_size_15,
                        Style.f_color_cityseeker,
                        Style.f_bold,
                        Style.m_r_2,
                    ]}>
                    {I18n.t('unread_messages')}
                </Text>
                <Text style={[Style.f_size_13, Style.f_color_9, Style.f_bold]}>
                    {date}
                </Text>
            </View>
        );
    }

    if (ts) {
        return (
            <View style={[Style.h_center, Style.m_v_2]}>
                <Text style={[Style.f_size_13, Style.f_color_9, Style.f_bold]}>
                    {date}
                </Text>
            </View>
        );
    }
    return (
        <View style={[Style.h_center, Style.m_t_3, Style.m_b_1, Style.m_h_3]}>
            <Text
                style={[
                    Style.f_size_15,
                    Style.f_color_cityseeker,
                    Style.f_bold,
                    Style.m_r_3,
                ]}>
                {I18n.t('unread_messages')}
            </Text>
            <View style={[Style.flex, Style.bg_color_cityseeker, Style.h_1]} />
        </View>
    );
});

DateSeparator.propTypes = {
    ts: PropTypes.instanceOf(Date),
    unread: PropTypes.bool,
    locale: PropTypes.string,
};

DateSeparator.defaultProps = {
    locale: 'en',
};

export default DateSeparator;
