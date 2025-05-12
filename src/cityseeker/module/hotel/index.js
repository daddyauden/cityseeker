import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import equal from 'deep-equal';
import BottomTabBar from '../sidebar/bottom';
import FlatListView from '../../components/FlatListView';
import StatusBar from '../../components/StatusBar';
import SearchBtn from '../../components/SearchBtn';
import CityBtn from '../../components/CityBtn';
import Divide from '../../components/Divide';
import {updateTab} from '../../actions/system';
import RouteConfig from '../../config/route';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = () => {
        return {
            header: null,
        };
    };

    constructor(props) {
        super(props);

        props.navigation.addListener('didFocus', () => {
            props.dispatch(updateTab('Hotel'));
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {locale, city, lat} = this.props;

        if (!equal(nextProps.locale, locale)) {
            return true;
        }

        if (!equal(nextProps.city, city)) {
            return true;
        }

        if (!equal(nextProps.lat, lat)) {
            return true;
        }

        return false;
    }

    _renderHeaderBar = () => {
        const {city, lat, lng} = this.props;

        return (
            <View
                style={[
                    Style.h_center,
                    Style.row_between,
                    Style.p_h_3,
                    Style.p_b_2,
                ]}>
                <CityBtn {...this.props} />
                <SearchBtn
                    {...this.props}
                    requestHost={RouteConfig.search.business}
                    cellType="business"
                    select={[
                        'id',
                        'uid',
                        'condition',
                        'name',
                        'cover',
                        'type',
                        'tag',
                        'views',
                        'ratings',
                        'likes',
                        'follower',
                        'avator',
                    ]}
                    where={[
                        'condition = 1',
                        "city = '" + city + "'",
                        "type = 'hotel'",
                        'status = 1',
                    ]}
                    order={
                        lat
                            ? ['distance asc', 'views desc', 'add_time asc']
                            : ['views desc', 'add_time asc']
                    }
                    lat={lat}
                    lng={lng}
                    style={[
                        Style.bg_color_gray,
                        {
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                        },
                    ]}
                />
            </View>
        );
    };

    render() {
        const {city, lat, lng} = this.props;

        return (
            <SafeAreaView
                forceInset={{bottom: 'always'}}
                style={[Style.flex, Style.theme_content, Style.p_b_10]}>
                <StatusBar light />
                <BottomTabBar
                    {...this.props}
                    showIcon={true}
                    showLabel={true}
                    routeName={'Hotel'}
                />
                {this._renderHeaderBar()}
                <FlatListView
                    {...this.props}
                    reloadToken={[city, lat]}
                    requestHost={RouteConfig.business.list}
                    cellType="business"
                    select={[
                        'id',
                        'uid',
                        'condition',
                        'name',
                        'cover',
                        'type',
                        'tag',
                        'views',
                        'ratings',
                        'likes',
                        'follower',
                        'avator',
                    ]}
                    where={[
                        'condition = 1',
                        "city = '" + city + "'",
                        "type = 'hotel'",
                        'status = 1',
                    ]}
                    order={
                        lat
                            ? ['distance asc', 'views desc', 'add_time asc']
                            : ['views desc', 'add_time asc']
                    }
                    lat={lat}
                    lng={lng}
                    renderSeparator={() => {
                        return (
                            <Divide
                                style={{
                                    ...Style.h_4,
                                    ...Style.bg_color_15,
                                }}
                            />
                        );
                    }}
                />
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        locale: state.system.locale,
        city: state.system.area.city,
        lat: state.system.lat,
        lng: state.system.lng,
    };
}

export default connect(mapStateToProps)(Default);
