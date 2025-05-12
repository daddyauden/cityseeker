import React from 'react';
import {
    View,
    StatusBar,
    ScrollView,
    Text,
    Image,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import Moment from 'moment';
import _ from 'lodash';
import equal from 'deep-equal';

import BottomTabBar from '../../module/sidebar/bottom';

import {HIDE_STATUS, TRANSLUCENT_STATUS} from '../../utils/lib';
import {list, calendar} from '../../actions/events';
import {updateTab} from '../../actions/system';
import SearchBar from '../../components/SearchBar';
import TimeAgo from '../../components/TimeAgo';
import EventsConfig from '../../config/events';
import RouteConfig from '../../config/route';
import EventsModel from '../../model/events';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = () => {
        return {
            header: null,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            upcoming: null,
            topRated: null,
        };
    }

    componentDidMount() {
        this.props.navigation.addListener('didFocus', () => {
            this.props.dispatch(updateTab('events'));

            this._loadUpcoming();
            this._loadToprated();
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {locale, city} = this.props;

        const {loading, upcoming, topRated} = this.state;

        if (!equal(nextProps.locale, locale)) {
            return true;
        }

        if (!equal(nextProps.city, city)) {
            return true;
        }

        if (!equal(nextState.loading, loading)) {
            return true;
        }

        if (!equal(nextState.upcoming, upcoming)) {
            return true;
        }

        if (!equal(nextState.topRated, topRated)) {
            return true;
        }

        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.city !== this.props.city) {
            this._loadUpcoming();
            this._loadToprated();
        }
    }

    _goEventsInfo = id => {
        this.props.navigation.navigate('EventsInfo', {id: id});
    };

    _loadUpcoming = () => {
        const {city} = this.props;

        calendar({
            select: [
                'distinct e.id',
                'e.id as id',
                'e.category as category',
                'e.title as title',
                'e.banner as banner',
                'c.c_begin as c_begin',
                'c.c_end as c_end',
            ],
            where: [
                "e.city = '" + city + "'",
                'e.status != 0',
                'c.c_begin - ' +
                    new Date().getTime() +
                    ' between 0 and 17280000000',
            ],
            order: ['c.c_begin ASC nulls last'],
            size: EventsConfig.upcomingLimit,
        }).then(response => {
            const {status, message} = response;

            if (parseInt(status) === 1) {
                const {count, list} = message;

                this.setState({
                    upcoming: parseInt(count) > 0 ? _.uniqBy(list, 'id') : null,
                });
            }
        });
    };

    _loadToprated = () => {
        const {city} = this.props;

        list({
            select: [
                'id',
                'category',
                'title',
                'banner',
                'going',
                'likes',
                'views',
            ],
            where: [
                "city = '" + city + "'",
                'status != 0',
                // "going > 1000"
                // "business != '" + user.uuid + "'"
            ],
            order: [
                'going DESC nulls last',
                'likes DESC nulls last',
                'views DESC nulls last',
            ],
            size: EventsConfig.topRatedLimit,
        }).then(response => {
            const {status, message} = response;

            if (parseInt(status) === 1) {
                const {count, list} = message;

                this.setState({
                    topRated: parseInt(count) > 0 ? list : null,
                    loading: false,
                });
            } else {
                this.setState({
                    loading: false,
                });
            }
        });
    };

    _renderCategoryBar = () => {
        const {navigation} = this.props;

        const {choices} = EventsModel.category;

        const render =
            choices !== undefined &&
            Object.keys(choices).length > 0 &&
            Object.keys(choices).map((label, index) => {
                return (
                    <TouchableWithoutFeedback
                        key={index}
                        onPress={() =>
                            navigation.navigate('EventsCategory', {
                                categoryName: choices[label],
                            })
                        }>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_center,
                                Style.p_h_3,
                                Style.p_v_2,
                                Style.m_r_2,
                                Style.b_half,
                                Style.border_round_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_weight_600,
                                    Style.f_fa_pf,
                                ]}>
                                {I18n.t(label)}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                );
            });

        const all = (
            <View
                key={'cat-all'}
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_center,
                    Style.p_h_3,
                    Style.p_v_2,
                    Style.m_r_2,
                    Style.b_half,
                    Style.border_round_1,
                    Style.bg_color_14,
                ]}>
                <Text
                    style={[
                        Style.f_size_13,
                        Style.f_color_3,
                        Style.f_weight_600,
                        Style.f_fa_pf,
                    ]}>
                    {I18n.t('common.all')}
                </Text>
            </View>
        );

        // render.unshift(all);

        return (
            <View
                style={[
                    Style.w_p100,
                    Style.m_t_1,
                    Style.m_b_3,
                    Style.p_l_3,
                    Style.p_r_1,
                    Style.row,
                    Style.column_center,
                ]}>
                {all}
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {render}
                </ScrollView>
            </View>
        );
    };

    _renderUpcoming = () => {
        const {upcoming} = this.state;

        const render =
            upcoming !== null &&
            upcoming.map((up_coming, index) => {
                return (
                    <TouchableWithoutFeedback
                        key={index}
                        onPress={() => this._goEventsInfo(up_coming.id)}>
                        <View
                            style={[
                                Style.column,
                                Style.row_start,
                                Style.column_start,
                                Style.m_r_4,
                                {
                                    width: EventsConfig.upcomingBannerWidth,
                                },
                            ]}>
                            <Image
                                source={{
                                    uri: Common.load_image(up_coming.banner),
                                }}
                                style={[
                                    Style.border_round_1,
                                    Style.overflow_hidden,
                                    Style.w_p100,
                                    {
                                        height:
                                            EventsConfig.upcomingBannerHeight,
                                    },
                                ]}
                            />
                            {up_coming.c_begin !== undefined &&
                                Moment(up_coming.c_begin).isValid() && (
                                    <TimeAgo
                                        system={this.props.system}
                                        date={up_coming.c_begin}
                                        live={false}
                                        containerStyle={[Style.m_t_2]}
                                        textStyle={[
                                            Style.f_size_11,
                                            Style.f_color_cityseeker,
                                            Style.f_weight_500,
                                        ]}
                                        {...this.props}
                                    />
                                )}
                            <Text
                                numberOfLines={1}
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_weight_600,
                                    Style.f_fa_pf,
                                    Style.m_t_2,
                                ]}>
                                {I18n.t(
                                    'events.category.' + up_coming.category,
                                )}
                            </Text>
                            <Text
                                numberOfLines={2}
                                style={[
                                    Style.f_size_15,
                                    Style.f_color_1,
                                    Style.f_weight_600,
                                    Style.f_fa_pf,
                                    Style.m_t_1,
                                ]}>
                                {up_coming.title}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                );
            });

        return (
            <View
                style={[
                    Style.column,
                    Style.row_center,
                    Style.p_l_3,
                    Style.p_r_1,
                    Style.m_t_2,
                ]}>
                <Text
                    style={[
                        Style.f_size_16,
                        Style.f_color_1,
                        Style.f_weight_800,
                        Style.f_fa_pf,
                        Style.m_b_4,
                    ]}>
                    {I18n.t('app.nav.events.upcoming')}
                </Text>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {render}
                </ScrollView>
            </View>
        );
    };

    _renderToprated = () => {
        const {topRated} = this.state;

        const render =
            topRated !== null &&
            topRated.map((top_rate, index) => {
                return (
                    <TouchableWithoutFeedback
                        key={index}
                        onPress={() => this._goEventsInfo(top_rate.id)}>
                        <View
                            style={[
                                Style.row,
                                Style.m_b_4,
                                {
                                    height: EventsConfig.topRatedBannerHeight,
                                },
                            ]}>
                            <Image
                                source={{
                                    uri: Common.load_image(top_rate.banner),
                                }}
                                style={[
                                    Style.border_round_1,
                                    Style.overflow_hidden,
                                    Style.h_p100,
                                    {
                                        width: EventsConfig.topRatedBannerWidth,
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    Style.flex,
                                    Style.wrap,
                                    Style.column,
                                    Style.column_start,
                                    Style.row_between,
                                    Style.m_l_3,
                                ]}>
                                <View style={[Style.column, Style.row_center]}>
                                    <Text
                                        numberOfLines={2}
                                        style={[
                                            Style.f_size_13,
                                            Style.f_color_3,
                                            Style.f_weight_600,
                                            Style.f_fa_pf,
                                        ]}>
                                        {I18n.t(
                                            'events.category.' +
                                                top_rate.category,
                                        )}
                                    </Text>
                                    <Text
                                        numberOfLines={4}
                                        style={[
                                            Style.f_size_15,
                                            Style.f_color_1,
                                            Style.f_weight_600,
                                            Style.f_fa_pf,
                                            Style.m_t_2,
                                        ]}>
                                        {top_rate.title}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        Style.column,
                                        Style.row_center,
                                        Style.column_start,
                                    ]}>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                        ]}>
                                        <Text
                                            style={[
                                                Style.f_size_15,
                                                Style.f_color_1,
                                                Style.f_weight_600,
                                                Style.f_fa_pf,
                                            ]}>
                                            {Common.customNumber(
                                                top_rate.going,
                                            )}
                                        </Text>
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_color_3,
                                                Style.f_weight_500,
                                                Style.f_fa_pf,
                                                Style.m_l_1,
                                            ]}>
                                            {I18n.t('events.going')}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                        ]}>
                                        <Text
                                            style={[
                                                Style.f_size_15,
                                                Style.f_color_1,
                                                Style.f_weight_600,
                                                Style.f_fa_pf,
                                            ]}>
                                            {Common.customNumber(
                                                top_rate.likes,
                                            )}
                                        </Text>
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_color_3,
                                                Style.f_weight_500,
                                                Style.f_fa_pf,
                                                Style.m_l_1,
                                            ]}>
                                            {I18n.t('events.likes')}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                        ]}>
                                        <Text
                                            style={[
                                                Style.f_size_15,
                                                Style.f_color_1,
                                                Style.f_weight_600,
                                                Style.f_fa_pf,
                                            ]}>
                                            {Common.customNumber(
                                                top_rate.views,
                                            )}
                                        </Text>
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_color_3,
                                                Style.f_weight_500,
                                                Style.f_fa_pf,
                                                Style.m_l_1,
                                            ]}>
                                            {I18n.t('common.views')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
            });

        return (
            <View
                style={[
                    Style.column,
                    Style.row_center,
                    Style.p_h_3,
                    Style.m_t_6,
                ]}>
                <Text
                    style={[
                        Style.f_size_16,
                        Style.f_color_1,
                        Style.f_weight_800,
                        Style.f_fa_pf,
                        Style.m_b_4,
                    ]}>
                    {I18n.t('app.nav.events.top_rated')}
                </Text>
                <View style={[Style.column, Style.row_center]}>{render}</View>
            </View>
        );
    };

    render() {
        const {loading} = this.state;

        const {city} = this.props;

        return loading === true ? (
            <View style={[Style.column, Style.row_center]}>
                <ActivityIndicator />
            </View>
        ) : (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{bottom: 'never'}}>
                <StatusBar
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={TRANSLUCENT_STATUS}
                />
                <BottomTabBar
                    {...this.props}
                    showIcon={true}
                    showLabel={true}
                    routeName={'Events'}
                />
                <SearchBar
                    {...this.props}
                    requestHost={RouteConfig.events.list}
                    cellType="events"
                    select={[
                        'id',
                        'category',
                        'title',
                        'banner',
                        'going',
                        'likes',
                        'views',
                    ]}
                    where={["city = '" + city + "'", 'status != 0']}
                    order={[
                        'views DESC nulls last',
                        'likes DESC nulls last',
                        'going DESC nulls last',
                    ]}
                />
                {this._renderCategoryBar()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this._renderUpcoming()}
                    {this._renderToprated()}
                </ScrollView>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        locale: state.system.locale,
        city: state.system.area.city,
        account: state.account,
        system: state.system,
    };
}

export default connect(mapStateToProps)(Default);
