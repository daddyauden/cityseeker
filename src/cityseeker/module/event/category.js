import React from 'react';
import {
    View,
    StatusBar,
    ScrollView,
    Text,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import equal from 'deep-equal';

import {HIDE_STATUS, TRANSLUCENT_STATUS, Common} from '../../utils/lib';
import FlatListView from '../../components/FlatListView';
import SearchBar from '../../components/SearchBar';

import {list} from '../../actions/events';

import EventsConfig from '../../config/events';
import RouteConfig from '../../config/route';

import EventsModel from '../../model/events';

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

        const {categoryName} = props.navigation.state.params;

        this.state = {
            category: categoryName,
            topRated: null,
        };
    }

    componentDidMount() {
        this._loadToprated();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!equal(nextProps.city, this.props.city)) {
            return true;
        }

        if (!equal(nextState.category, this.state.category)) {
            return true;
        }

        if (!equal(nextState.topRated, this.state.topRated)) {
            return true;
        }

        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.city !== this.props.city) {
            this._loadToprated();
        }
    }

    _goEventsInfo = id => {
        this.props.navigation.navigate('EventsInfo', {id: id});
    };

    _loadToprated = () => {
        const {city} = this.props;

        list({
            select: ['id', 'category', 'title', 'banner', 'going', 'likes'],
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
                });
            }
        });
    };

    _renderSearchBar = () => {
        const {city} = this.props;
        const {category} = this.state;

        return (
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
                where={[
                    "city = '" + city + "'",
                    'status != 0',
                    "category = '" + category + "'",
                ]}
                order={[
                    'views DESC nulls last',
                    'likes DESC nulls last',
                    'going DESC nulls last',
                ]}
            />
        );
    };

    _renderCategoryBar = () => {
        const {navigation} = this.props;

        const {category} = this.state;

        const {choices} = EventsModel.category;

        const render =
            choices !== undefined &&
            Object.keys(choices).length > 0 &&
            Object.keys(choices).map((label, index) => {
                return (
                    <TouchableWithoutFeedback
                        key={index}
                        onPress={
                            category === choices[label]
                                ? () => {}
                                : () => {
                                      this.setState({
                                          category: choices[label],
                                      });
                                  }
                        }>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_start,
                                Style.p_h_3,
                                Style.p_v_2,
                                Style.m_r_2,
                                Style.b_half,
                                Style.border_round_1,
                                category === choices[label]
                                    ? Style.bg_color_14
                                    : Style.bg_color_15,
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
            <TouchableWithoutFeedback
                key={'cat-all'}
                onPress={() => navigation.goBack()}>
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_start,
                        Style.p_h_3,
                        Style.p_v_2,
                        Style.m_r_2,
                        Style.b_half,
                        Style.border_round_1,
                        Style.bg_color_15,
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
            </TouchableWithoutFeedback>
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
                                    uri: Common.load_image(top_rate.banner),
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
                            <View
                                style={[
                                    Style.column,
                                    Style.row_center,
                                    Style.m_t_1,
                                ]}>
                                <View style={[Style.row, Style.column_center]}>
                                    <Text
                                        style={[
                                            Style.f_size_15,
                                            Style.f_color_1,
                                            Style.f_weight_600,
                                            Style.f_fa_pf,
                                        ]}>
                                        {Common.customNumber(top_rate.going)}
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
                                <View style={[Style.row, Style.column_center]}>
                                    <Text
                                        style={[
                                            Style.f_size_15,
                                            Style.f_color_1,
                                            Style.f_weight_600,
                                            Style.f_fa_pf,
                                        ]}>
                                        {Common.customNumber(top_rate.likes)}
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
                            </View>
                            <Text
                                numberOfLines={1}
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_cityseeker,
                                    Style.f_weight_600,
                                    Style.f_fa_pf,
                                    Style.m_t_1,
                                ]}>
                                {I18n.t('events.category.' + top_rate.category)}
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
                                {top_rate.title}
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
                    Style.m_t_4,
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
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {render}
                </ScrollView>
            </View>
        );
    };

    _renderTitle = () => {
        const {category} = this.state;

        return (
            <View
                style={[
                    Style.row,
                    Style.column_center,
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
                    {I18n.t('events.category.' + category)}
                </Text>
            </View>
        );
    };

    _renderCategoryList = () => {
        const {category} = this.state;

        const {city} = this.props;

        return (
            <FlatListView
                {...this.props}
                reloadToken={category}
                requestHost={RouteConfig.events.list}
                cellType="events"
                select={['id', 'category', 'title', 'banner', 'going', 'likes']}
                where={[
                    "city = '" + city + "'",
                    "category = '" + category + "'",
                    'status != 0',
                ]}
                order={[
                    'going DESC nulls last',
                    'likes DESC nulls last',
                    'views DESC nulls last',
                ]}
                size={EventsConfig.limit}
                renderSeparator={() => {
                    return null;
                }}
                renderHeader={() => {
                    return (
                        <View style={[Style.w_p100]}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {this._renderToprated()}
                                {this._renderTitle()}
                            </ScrollView>
                        </View>
                    );
                }}
            />
        );
    };

    render() {
        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{
                    bottom: 'never',
                }}>
                <StatusBar
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={TRANSLUCENT_STATUS}
                />
                {this._renderSearchBar()}
                {this._renderCategoryBar()}
                {this._renderCategoryList()}
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        city: state.system.area.city,
    };
}

export default connect(mapStateToProps)(Default);
