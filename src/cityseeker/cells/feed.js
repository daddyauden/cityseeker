import React from 'react';
import {View, Text, TouchableWithoutFeedback, Alert} from 'react-native';
import UUID from 'react-native-uuid';

import {add, remove} from '../actions/record';
import {Common} from '../utils/lib';
import FeedType from '../type/feed';
import FeedCell from './feed_cell';
import I18n from '../locale';
import Style from '../style';

const SPACE = 10;

class Feed extends React.Component {
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
        const {account, system, recordOp} = this.props;
        const {lat, lng, area} = system;

        const {country, city} = area;

        if (recordOp !== undefined && recordOp) {
            recordOp(op, record);
        } else {
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
                }
            }
        }
    };

    showFeed = data => {
        const {navigation} = this.props;

        navigation.navigate({
            routeName: 'FeedInfo',
            params: {
                data: data,
            },
            key: data.id,
        });
    };

    showRepost = (feed, feedType, pickerType, mediaType) => {
        const {navigation} = this.props;

        if (this.checkLogin() === true) {
            navigation.navigate({
                routeName: 'post_feed',
                params: {
                    data: feed,
                    feedType: feedType,
                    pickerType: pickerType,
                    mediaType: mediaType,
                },
            });
        }
    };

    showWeb = url => {
        const {navigation, showWeb} = this.props;
        showWeb ? showWeb(url) : navigation.navigate('web', {url: url});
    };

    showComment = (feed, commentType, pickerType, mediaType) => {
        const {navigation} = this.props;

        if (this.checkLogin() === true) {
            navigation.navigate({
                routeName: 'post_comment',
                params: {
                    data: feed,
                    commentType: commentType,
                    pickerType: pickerType,
                    mediaType: mediaType,
                },
            });
        }
    };

    render() {
        const {data, account, system} = this.props;

        return (
            <TouchableWithoutFeedback onPress={this.showFeed.bind(this, data)}>
                {data.type === FeedType.repost && data.content ? (
                    <View style={[Style.column]}>
                        <FeedCell
                            data={data}
                            account={account}
                            system={system}
                            showRecordNum={true}
                            recordOp={this.recordOp}
                            showFeed={this.showFeed}
                            showRepost={this.showRepost}
                            showComment={this.showComment}
                        />
                        {!data.title && !data.images && (
                            <View
                                style={[
                                    Style.row,
                                    {
                                        paddingHorizontal: SPACE,
                                        paddingBottom: SPACE,
                                    },
                                ]}>
                                <Text>{I18n.t('common.reposts.comment')}</Text>
                            </View>
                        )}
                        <View style={[Style.theme_footer]}>
                            <FeedCell
                                data={data.content}
                                account={account}
                                system={system}
                                isRepost={true}
                                showRecordNum={true}
                                recordOp={this.recordOp}
                                showFeed={this.showFeed}
                                showRepost={this.showRepost}
                                showComment={this.showComment}
                            />
                        </View>
                    </View>
                ) : (
                    <View>
                        <FeedCell
                            data={data}
                            account={account}
                            system={system}
                            showRecordNum={true}
                            recordOp={this.recordOp}
                            showFeed={this.showFeed}
                            showRepost={this.showRepost}
                            showComment={this.showComment}
                        />
                    </View>
                )}
            </TouchableWithoutFeedback>
        );
    }
}

export default Feed;
