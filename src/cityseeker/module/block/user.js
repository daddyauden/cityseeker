import React from 'react';
import {View, Text, Alert, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import UUID from 'react-native-uuid';
import {connect} from 'react-redux';
import {Q} from '@nozbe/watermelondb';
import FlatListView from '../../components/FlatListView';
import StatusBar from '../../components/StatusBar';
import {add, remove} from '../../actions/record';
import RouteConfig from '../../config/route';
import Divide from '../../components/Divide';
import Avator from '../../components/Avator';
import database from '../../lib/database';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('app.nav.blocked_list'),
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <View
                        style={[
                            Style.p_l_3,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            style={[Style.f_size_22, Style.f_color_4]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
            headerTransparent: false,
            headerStyle: {
                elevation: 0,
                backgroundColor: Style.theme_content.backgroundColor,
            },
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            scrollEnabled: true,
            blockedUser: [],
            loading: true,
        };
    }

    async componentDidMount() {
        this.blockedUser = await database.active.collections
            .get('record')
            .query(Q.where('type', 'business'), Q.where('action', 'block'))
            .fetch();

        if (this.blockedUser.length > 0) {
            this._updateBlockedUser();
        }
    }

    _updateBlockedUser = () => {
        let data = this.blockedUser.map(
            user => "'" + user.content.toUpperCase() + "'",
        );

        this.setState({
            blockedUser: data,
            loading: false,
        });
    };

    checkLogin = () => {
        const {account} = this.props;

        if (account.isLoggedIn === false) {
            Common.showToast({
                message: (
                    <Text style={[Style.f_size_13, Style.f_weight_500]}>
                        {I18n.t('common.nosignin')}
                    </Text>
                ),
                style: {
                    ...Style.bg_color_cityseeker,
                },
                op: {
                    onHidden: () => {
                        Alert.alert(I18n.t('common.nosignin'), '', [
                            {
                                text: I18n.t('Cancel'),
                                style: 'cancel',
                            },
                            {
                                text: I18n.t('common.signin'),
                                style: 'destructive',
                                onPress: () =>
                                    this.props.navigation.navigate('Signin'),
                            },
                        ]);
                    },
                },
            });

            return false;
        } else {
            return true;
        }
    };

    recordOp = (op, record) => {
        const {account, system} = this.props;
        const {lat, lng, area} = system;

        const {country, city} = area;

        if (this.checkLogin() === true) {
            if (op === 'add') {
                const data = {
                    id: UUID.v4()
                        .toUpperCase()
                        .replace(/-/g, ''),
                    business: account.id,
                    lat: lat,
                    lng: lng,
                    country: country,
                    city: city,
                    ...record,
                };

                this.props.dispatch(add(data));
            } else if (op === 'remove') {
                const data = {
                    business: account.id,
                    ...record,
                };

                this.props.dispatch(remove(data));

                setTimeout(() => {
                    Common.showToast({
                        message: (
                            <MaterialCommunityIcons
                                name="check"
                                style={[Style.f_size_30, Style.f_color_15]}
                            />
                        ),
                        style: {
                            ...Style.bg_color_green,
                        },
                        op: {
                            onHidden: () => this.forceUpdate(),
                        },
                    });
                }, 300);
            }
        }
    };

    render() {
        const {blockedUser, loading, scrollEnabled} = this.state;

        return (
            !loading && (
                <SafeAreaView
                    style={[Style.flex, Style.theme_content]}
                    forceInset={{vertical: 'never'}}>
                    <StatusBar light />
                    <FlatListView
                        reloadToken={blockedUser}
                        requestHost={RouteConfig.business.list}
                        select={[
                            'id',
                            'uid',
                            'name',
                            'condition',
                            'username',
                            'avator',
                            'add_time',
                        ]}
                        where={['id IN(' + blockedUser.join(',') + ')']}
                        order={['add_time asc nulls last']}
                        size={300}
                        renderItem={({item}) => {
                            return (
                                <Swipeout
                                    buttonWidth={130}
                                    autoClose={true}
                                    backgroundColor={
                                        Style.bg_color_15.backgroundColor
                                    }
                                    onOpen={() => {
                                        this.setState({scrollEnabled: false});
                                    }}
                                    onClose={() => {
                                        this.setState({scrollEnabled: true});
                                    }}
                                    right={[
                                        {
                                            backgroundColor:
                                                Style.bg_color_gray
                                                    .backgroundColor,
                                            component: (
                                                <TouchableWithoutFeedback
                                                    onPress={this.recordOp.bind(
                                                        this,
                                                        'remove',
                                                        {
                                                            type: 'business',
                                                            action: 'block',
                                                            content: item.id,
                                                        },
                                                    )}>
                                                    <View
                                                        style={[
                                                            Style.v_center,
                                                        ]}>
                                                        <Text
                                                            style={[
                                                                Style.f_size_12,
                                                                Style.f_color_3,
                                                                Style.f_regular,
                                                            ]}>
                                                            {I18n.t(
                                                                'common.unblock',
                                                            )}
                                                        </Text>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            ),
                                        },
                                    ]}
                                    sensitivity={2}>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            Style.bg_color_15,
                                            Style.border_round_4,
                                            Style.p_2,
                                        ]}>
                                        <Avator
                                            user={item}
                                            isLink={false}
                                            size={40}
                                        />
                                        {item.name && (
                                            <Text
                                                style={[
                                                    Style.f_size_13,
                                                    Style.f_color_3,
                                                    Style.f_bold,
                                                    Style.m_l_2,
                                                ]}>
                                                {item.name}
                                            </Text>
                                        )}
                                    </View>
                                </Swipeout>
                            );
                        }}
                        renderSeparator={() => {
                            return (
                                <Divide
                                    style={{
                                        ...Style.h_2,
                                        ...Style.bg_color_gray,
                                    }}
                                />
                            );
                        }}
                        scrollEnabled={scrollEnabled}
                    />
                </SafeAreaView>
            )
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
