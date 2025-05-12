import React from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    Dimensions,
    SafeAreaView,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import concat from 'lodash/concat';
import axios from 'axios/index';
import Cell, {sliderWidth, itemWidth} from '../../cells/secondhand';
import SecondhandConfig from '../../config/secondhand';
import PostButton from '../../components/PostButton';
import SearchBar from '../../components/SearchBar';
import Statusbar from '../../components/StatusBar';
import RouteConfig from '../../config/route';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

const SPACE = 10;

const COLUMN = 2;

const WIDTH = Dimensions.get('window').width;

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('app.tab.secondhand'),
            headerLeft: navigation.getParam('headerLeft'),
            headerRight: navigation.getParam('headerRight'),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            refreshing: true,
            data: [],
            currentPage: 0,
            pages: 0,
            selectIndex: null,
            actionSheet: null,
            viewMode: 'list',
            activeItemIndex: 0,
            lastTime: new Date().getTime(),
        };
    }

    componentDidMount() {
        this._requestData();
    }

    _onRefresh = () => {
        this.setState(
            {
                loading: false,
                refreshing: true,
            },
            () => {
                this._requestLatest();
            },
        );
    };

    _requestData = () => {
        const {currentPage, data} = this.state;
        const {city} = this.props.system.area;

        const select = [
            'id',
            'name',
            'description',
            'banner',
            'price',
            'add_time',
            'category',
            'type',
            'contact',
            'tel',
        ];

        const where = [
            "type = 'secondhand'",
            "city = '" + city + "'",
            'status = 1',
        ];

        const order = ['add_time DESC nulls last'];

        setTimeout(() => {
            axios
                .post(RouteConfig.item.list, {
                    select: select,
                    where: where,
                    order: order,
                    size: SecondhandConfig.limit,
                    page: currentPage + 1,
                })
                .then(res => {
                    const {list, count} = res.data;

                    this.setState({
                        loading: false,
                        refreshing: false,
                        data: concat(data, list),
                        currentPage: currentPage + 1,
                        pages: Math.ceil(count / SecondhandConfig.limit),
                    });
                })
                .catch(error => {
                    this.setState({
                        loading: false,
                        refreshing: false,
                    });
                });
        }, 1000);
    };

    _requestLatest = () => {
        const {data, lastTime} = this.state;

        const {city} = this.props.system.area;

        let where = [
            "type = 'secondhand'",
            'add_time > ' + lastTime,
            "city = '" + city + "'",
            'status = 1',
        ];

        const select = [
            'id',
            'name',
            'description',
            'banner',
            'price',
            'add_time',
            'category',
            'type',
            'contact',
            'tel',
        ];

        const order = ['add_time DESC nulls last'];

        setTimeout(() => {
            axios
                .post(RouteConfig.item.list, {
                    select: select,
                    where: where,
                    order: order,
                })
                .then(res => {
                    const {list} = res.data;

                    this.setState({
                        lastTime: new Date().getTime(),
                        loading: false,
                        refreshing: false,
                        data: concat(list, data),
                    });
                })
                .catch(error => {
                    this.setState({
                        loading: false,
                        refreshing: false,
                    });
                });
        }, 1000);
    };

    renderItem({item}) {
        return <Cell data={item} {...this.props} />;
    }

    _keyExtractor = (item, index) => index;

    _renderSeparator = () => {
        return null;
    };

    _renderEmptyList(containerHeight) {
        if (containerHeight === 0) {
            return null;
        }

        return (
            <View style={[Style.p_h_4, Style.p_v_3, Style.bg_color_15]}>
                <Text>Nothing!</Text>
            </View>
        );
    }

    _renderHeader() {
        return (
            <View style={[Style.p_2]}>
                <SearchBar {...this.props} />
            </View>
        );
    }

    _renderFooter() {
        return (
            <View style={[Style.p_h_4, Style.p_v_3, Style.bg_color_14]}>
                <Text>Footer</Text>
            </View>
        );
    }

    _renderItem({item, index}) {
        const {navigation, system} = this.props;
        const {trans, params} = system;

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    navigation.setParams({
                        headerLeft: (
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    navigation.setParams({
                                        headerLeft: null,
                                    });
                                    this.setState({
                                        viewMode: 'list',
                                    });
                                }}>
                                <View
                                    style={[
                                        Style.p_l_3,
                                        Style.row_center,
                                        Style.column_center,
                                    ]}>
                                    <MaterialCommunityIcons
                                        name="close"
                                        style={[
                                            Style.f_size_22,
                                            Style.f_color_4,
                                        ]}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        ),
                    });
                    this.setState({
                        activeItemIndex: index,
                        viewMode: 'carousel',
                    });
                }}>
                <View
                    style={{
                        flex: 1,
                        width: (WIDTH - SPACE) / COLUMN,
                        paddingHorizontal: SPACE / 2,
                        marginBottom: 20,
                    }}>
                    <View
                        style={[
                            Style.row,
                            Style.row_between,
                            Style.p_2,
                            Style.b,
                            Style.border_t_round_2,
                        ]}>
                        <View
                            style={[
                                Style.wrap,
                                Style.w_p50,
                                Style.column_start,
                            ]}>
                            <Text numberOfLines={1} style={Style.f_color_3}>
                                {item.name}
                            </Text>
                        </View>
                        <View
                            style={[Style.wrap, Style.w_p50, Style.column_end]}>
                            <Text numberOfLines={1} style={Style.f_color_3}>
                                {Common.price(
                                    item.price,
                                    trans[params.currency],
                                )}
                            </Text>
                        </View>
                    </View>
                    {item.banner ? (
                        <FastImage
                            source={{
                                uri: Common.load_image(item.banner),
                                priority: FastImage.priority.normal,
                            }}
                            style={{
                                width: '100%',
                                height: 230,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                            }}
                        />
                    ) : (
                        <Image
                            source={require('../../../common/assets/images/placeholder.png')}
                            style={{
                                width: '100%',
                                height: 230,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                            }}
                        />
                    )}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _endReached = () => {
        if (
            this.state.pages === 0 ||
            this.state.currentPage < this.state.pages
        ) {
            this._requestData();
        }
    };

    render() {
        return this.state.viewMode === 'list' ? (
            <SafeAreaView style={[Style.flex, Style.theme_content]}>
                <Statusbar light />
                <View style={[Style.p_h_2, Style.theme_header]}>
                    <SearchBar {...this.props} />
                </View>
                <View style={[Style.flex, Style.p_v_2]}>
                    <FlatList
                        numColumns={2}
                        data={this.state.data}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem.bind(this)}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        horizontal={false}
                        initialScrollIndex={
                            Math.floor(this.state.activeItemIndex / 2) - 1
                        }
                        inverted={false}
                        onEndReached={this._endReached}
                        onEndReachedThreshold={1}
                    />
                </View>
                <PostButton post_type="secondhand" {...this.props} />
            </SafeAreaView>
        ) : (
            <View style={Style.flex}>
                <View style={Style.flex}>
                    <Carousel
                        firstItem={this.state.activeItemIndex}
                        loop={false}
                        horizontal={true}
                        activeSlideAlignment="center"
                        data={this.state.data}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        inactiveSlideScale={0.8}
                        inactiveSlideOpacity={0.7}
                        inactiveSlideShift={30}
                        containerCustomStyle={{overflow: 'visible'}}
                        contentContainerCustomStyle={[
                            Style.column_center,
                            Style.bg_color_15,
                        ]}
                        activeAnimationType={'timing'}
                        layout="default"
                        refreshing={this.state.refreshing}
                        activeSlideOffset={SecondhandConfig.limit / 2}
                        lockScrollWhileSnapping={true}
                        swipeThreshold={SecondhandConfig.limit}
                        scrollEnabled={true}
                        useScrollView={false}
                        renderItem={this.renderItem.bind(this)}
                        onSnapToItem={index => {
                            this.setState({activeItemIndex: index});
                        }}
                        onEndReached={this._endReached}
                        onEndReachedThreshold={1}
                    />
                </View>
                <PostButton post_type="secondhand" {...this.props} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        account: state.account,
        system: state.system,
    };
}

export default connect(mapStateToProps)(Default);
