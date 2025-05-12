import React from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';

import {Q} from '@nozbe/watermelondb';

import database from '../lib/database';

import {Common} from '../utils/lib';

import Avator from '../components/Avator';

import I18n from '../locale';
import Style from '../style';

const AVATOR_WITH = 40;

class Default extends React.Component {
    get isApplied() {
        return (async () => {
            const data = this.props.data;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn && data.id !== undefined) {
                const db = database.active;
                const isApplied = await db.collections
                    .get('record')
                    .query(
                        Q.where('type', 'job'),
                        Q.where('action', 'delivery'),
                        Q.where('content', data.id.toLowerCase()),
                    )
                    .fetchCount();

                return isApplied > 0;
            }

            return false;
        })();
    }

    _goJobInfo = (id, isApplied) => {
        this.props.navigation.navigate('JobInfo', {
            id: id,
            isApplied: isApplied,
        });
    };

    render() {
        const {data, navigation} = this.props;

        const user = data.business !== undefined ? data.business : {};

        let isApplied = this.isApplied;

        return (
            <TouchableWithoutFeedback
                onPress={() => this._goJobInfo(data.id, isApplied)}>
                <View
                    style={[
                        Style.row,
                        Style.row_between,
                        Style.p_h_3,
                        Style.p_v_2,
                    ]}>
                    <View style={[Style.flex, Style.m_r_3]}>
                        <Text
                            numberOfLines={2}
                            style={[
                                Style.f_size_15,
                                Style.f_color_1,
                                Style.f_bolder,
                            ]}>
                            {data.title}
                        </Text>
                        <View
                            style={[
                                Style.wrap,
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {user.name}
                            </Text>
                            {user.type !== undefined && user.type !== null && (
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_3,
                                        Style.f_bold,
                                    ]}>
                                    {' - ' + I18n.t('type.' + user.type)}
                                </Text>
                            )}
                        </View>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            {data.views !== undefined && (
                                <View style={[Style.row, Style.column_center]}>
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_color_5,
                                            Style.f_bold,
                                        ]}>
                                        {Common.customNumber(data.views)}
                                    </Text>
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_color_5,
                                            Style.f_bold,
                                            Style.m_l_1,
                                        ]}>
                                        {I18n.t('common.views')}
                                    </Text>
                                </View>
                            )}
                            {data.delivery !== undefined && (
                                <View
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        Style.m_l_2,
                                    ]}>
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_color_5,
                                            Style.f_bold,
                                        ]}>
                                        {Common.customNumber(data.delivery)}
                                    </Text>
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_color_5,
                                            Style.f_bold,
                                            Style.m_l_1,
                                        ]}>
                                        {I18n.t('module.job.apply')}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={[Style.row_between, Style.column_end]}>
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate('BusinessInfo')}>
                            <Avator
                                user={user}
                                isLink={true}
                                size={AVATOR_WITH}
                            />
                        </TouchableWithoutFeedback>
                        {isApplied && (
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_google,
                                    Style.f_bold,
                                ]}>
                                {I18n.t('module.job.applied')}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Default;
