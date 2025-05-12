import React from 'react';
import {FlatList} from 'react-native';
import concat from 'lodash/concat';
import equal from 'deep-equal';
import axios from 'axios';

import CellType from '../type/cell';
import UserOriginalFeed from '../cells/user_original_feed';
import UserCommentFeed from '../cells/user_comment_feed';
import UserLikeFeed from '../cells/user_like_feed';
import BusinessCell from '../cells/business';
import CommentCell from '../cells/comment';
import RepostCell from '../cells/repost';
import EventsCell from '../cells/events';
import UserCell from '../cells/user';
import ItemCell from '../cells/item';
import FeedCell from '../cells/feed';
import LikeCell from '../cells/like';
import JobCell from '../cells/job';

import {Common} from '../utils/lib';
import RouteConfig from '../config/route';
import ItemConfig from '../config/item';

class FlatListView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            currentPage: 0,
            pages: 0,
            refreshing: true,
            lastTime: new Date().getTime(),
        };
    }

    componentDidMount() {
        this._requestData();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.reloadToken !== undefined &&
            this.props.reloadToken !== undefined &&
            !equal(prevProps.reloadToken, this.props.reloadToken)
        ) {
            this.setState(
                {
                    data: [],
                    currentPage: 0,
                    pages: 0,
                    refreshing: true,
                    lastTime: new Date().getTime(),
                },
                () => this._requestData(),
            );
        }

        if (
            this.props.listViewToken !== undefined &&
            this.props.reloadListView !== null &&
            prevProps.reloadListView !== this.props.reloadListView
        ) {
            this.setState(
                {
                    data: [],
                    currentPage: 0,
                    pages: 0,
                    refreshing: true,
                    lastTime: new Date().getTime(),
                },
                () => {
                    this.props.reloadListView &&
                        this.props.listViewToken &&
                        this.props.reloadListView(this.props.listViewToken);

                    this._requestData();
                },
            );
        }

        if (
            this.props.listViewToken !== undefined &&
            this.props.latestListView !== null &&
            prevProps.latestListView !== this.props.latestListView
        ) {
            this._onRefresh();
        }
    }

    _onRefresh = () => {
        this.setState(
            {
                refreshing: true,
            },
            () => {
                this._requestLatest();
            },
        );
    };

    _endReached = () => {
        const {currentPage, pages} = this.state;

        if (pages === 0 || currentPage < pages) {
            this._requestData();
        }
    };

    _requestData = () => {
        const {currentPage, data} = this.state;

        const {select, where, order, size, requestHost, lat, lng} = this.props;

        const host = requestHost || RouteConfig.item.list;

        const limit = size || ItemConfig.limit;

        setTimeout(() => {
            axios
                .post(host, {
                    select: select,
                    where: where,
                    order: order,
                    lat: lat || null,
                    lng: lng || null,
                    size: limit,
                    page: currentPage + 1,
                })
                .then(res => {
                    const {status, message} = res.data;

                    if (parseInt(status) === 1) {
                        const {list, count} = message;

                        this.setState({
                            refreshing: false,
                            pages: Math.ceil(count / limit),
                            currentPage: currentPage + 1,
                            data: concat(data, list),
                        });
                    } else {
                        this.setState({
                            refreshing: false,
                        });
                    }
                })
                .catch(error => {
                    this.setState({
                        refreshing: false,
                    });
                });
        }, 300);
    };

    _requestLatest = () => {
        const {data, lastTime} = this.state;

        const {select, where, order, requestHost, lat, lng} = this.props;

        const host = requestHost || RouteConfig.item.list;

        setTimeout(() => {
            axios
                .post(host, {
                    select: select,
                    where: where.concat(['add_time > ' + lastTime]),
                    order: order,
                    lat: lat || null,
                    lng: lng || null,
                })
                .then(res => {
                    const {status, message} = res.data;

                    if (parseInt(status) === 1) {
                        const {list} = message;
                        this.setState({
                            refreshing: false,
                            lastTime: new Date().getTime(),
                            data: concat(list, data),
                        });
                    } else {
                        this.setState({
                            refreshing: false,
                        });
                    }
                })
                .catch(error => {
                    this.setState({
                        refreshing: false,
                    });
                });
        }, 300);
    };

    _keyExtractor = (item, index) => {
        return item.id + index;
    };

    _renderSeparator = () => {
        const {renderSeparator} = this.props;

        return renderSeparator ? renderSeparator() : null;
    };

    _renderEmptyList = () => {
        const {renderEmptyList} = this.props;

        return renderEmptyList ? renderEmptyList() : null;
    };

    _renderHeader = () => {
        const {renderHeader} = this.props;

        return renderHeader ? renderHeader() : null;
    };

    _renderFooter = () => {
        const {renderFooter} = this.props;

        return renderFooter ? renderFooter() : null;
    };

    _renderItem = ({item}) => {
        if (this.props.renderItem) {
            return this.props.renderItem(item);
        } else {
            const {cellType} = this.props;

            const cell_type = cellType || 'item';

            if (item.id) {
                const type = cell_type.toLowerCase();
                if (type === CellType.business) {
                    return <BusinessCell data={item} {...this.props} />;
                } else if (type === CellType.user) {
                    return <UserCell data={item} {...this.props} />;
                } else if (type === CellType.events) {
                    return <EventsCell data={item} {...this.props} />;
                } else if (type === CellType.item) {
                    return <ItemCell data={item} {...this.props} />;
                } else if (type === CellType.feed) {
                    return <FeedCell data={item} {...this.props} />;
                } else if (type === CellType.comment) {
                    return <CommentCell data={item} {...this.props} />;
                } else if (type === CellType.repost) {
                    return <RepostCell data={item} {...this.props} />;
                } else if (type === CellType.like) {
                    return <LikeCell data={item} {...this.props} />;
                } else if (type === CellType.user_original_feed) {
                    return <UserOriginalFeed data={item} {...this.props} />;
                } else if (type === CellType.user_comment_feed) {
                    return <UserCommentFeed data={item} {...this.props} />;
                } else if (type === CellType.user_like_feed) {
                    return <UserLikeFeed data={item} {...this.props} />;
                } else if (type === CellType.job) {
                    return <JobCell data={item} {...this.props} />;
                }
            } else {
                return null;
            }
        }
    };

    render() {
        const {data, refreshing} = this.state;

        return (
            <FlatList
                refreshing={refreshing}
                data={data}
                onRefresh={this._onRefresh}
                keyExtractor={this._keyExtractor}
                ListEmptyComponent={this._renderEmptyList}
                ItemSeparatorComponent={this._renderSeparator}
                ListHeaderComponent={this._renderHeader}
                ListFooterComponent={this._renderFooter}
                renderItem={this._renderItem}
                horizontal={false}
                initialScrollIndex={0}
                inverted={false}
                onEndReached={this._endReached}
                onEndReachedThreshold={0.5}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                {...this.props}
                style={[]}
            />
        );
    }
}

export default FlatListView;
