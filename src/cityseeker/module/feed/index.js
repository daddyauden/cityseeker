import React from 'react';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import {Q} from '@nozbe/watermelondb';

import BottomTabBar from '../sidebar/bottom';

import FlatListView from '../../components/FlatListView';
import StatusBar from '../../components/StatusBar';
import Divide from '../../components/Divide';
import database from '../../lib/database';
import {updateTab} from '../../actions/system';
import RouteConfig from '../../config/route';
import FeedConfig from '../../config/feed';
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
            blockedUser: [],
        };

        this.blockedUser = (async () => {
            return await database.active.collections
                .get('record')
                .query(Q.where('type', 'business'), Q.where('action', 'block'))
                .fetch();
        })();
    }

    componentDidMount() {
        this.props.navigation.addListener('didFocus', () => {
            this.props.dispatch(updateTab('feed'));

            if (this.blockedUser.length > 0) {
                this._updateBlockedUser();
            }
        });

        if (this.blockedUser.length > 0) {
            this._updateBlockedUser();
        }
    }

    _updateBlockedUser = () => {
        const {account} = this.props;

        let data = this.blockedUser.map(
            user => "'" + user.content.toUpperCase() + "'",
        );

        account.isLoggedIn && data.push("'" + account.id + "'");

        this.setState({
            blockedUser: data,
        });
    };

    render() {
        const {city} = this.props.system.area;

        const {blockedUser} = this.state;

        let allWhere = ["city = '" + city + "'", 'status != 0'];

        if (blockedUser.length > 0) {
            allWhere.push('business NOT IN(' + blockedUser.join(',') + ')');
        }

        return (
            <SafeAreaView
                forceInset={{bottom: 'never'}}
                style={[
                    Style.flex,
                    Style.theme_content,
                    {
                        paddingBottom: 65,
                    },
                ]}>
                <StatusBar light />
                <BottomTabBar
                    {...this.props}
                    showIcon={true}
                    showLabel={true}
                    routeName={'Feed'}
                />
                <FlatListView
                    {...this.props}
                    reloadToken={[city, allWhere]}
                    cellType="feed"
                    requestHost={RouteConfig.feed.list}
                    select={[
                        'id',
                        'business',
                        'type',
                        'title',
                        'content',
                        'images',
                        'reposts',
                        'likes',
                        'comments',
                        'views',
                        'add_time',
                        'nearby',
                    ]}
                    where={allWhere}
                    order={['add_time DESC nulls last']}
                    size={FeedConfig.limit}
                    renderSeparator={() => {
                        return (
                            <Divide
                                style={{
                                    ...Style.p_b_2,
                                    ...Style.h_0,
                                    ...Style.bg_color_14,
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
        account: state.account,
        system: state.system,
    };
}

export default connect(mapStateToProps)(Default);
