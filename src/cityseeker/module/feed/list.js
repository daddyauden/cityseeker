import React from 'react';
import {FlatList} from 'react-native';
import concat from 'lodash/concat';
import equal from 'deep-equal';
import axios from 'axios';

import RouteConfig from '../../config/route';
import ItemConfig from '../../config/item';

import FeedCell from '../../cells/feed';
import {Common} from '../../utils/lib';
import CellType from '../../type/cell';

class Default extends React.Component {
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

        const {
            account,
            select,
            where,
            order,
            size,
            requestHost,
            lat,
            lng,
        } = this.props;

        const host = requestHost || RouteConfig.item.list;

        const limit = size || ItemConfig.limit;

        setTimeout(() => {
            axios
                .post(host, {
                    select: select,
                    where: where.concat([
                        "business IN (select content from record where business = '" +
                            account.id +
                            "' and action ='following' and type = 'business' limit " +
                            limit +
                            ' offset ' +
                            currentPage * limit +
                            ')',
                    ]),
                    order: order,
                    lat: (lat !== undefined && lat) || null,
                    lng: (lng !== undefined && lng) || null,
                })
                .then(res => {
                    const {status, message} = res.data;

                    if (parseInt(status) === 1) {
                        const {list, count} = message;

                        this.setState({
                            refreshing: false,
                            // pages: Math.ceil(count / limit),
                            pages: parseInt(count) === 0 ? 1 : 0,
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

        const {
            account,
            select,
            where,
            order,
            requestHost,
            lat,
            lng,
        } = this.props;

        const host = requestHost || RouteConfig.item.list;

        setTimeout(() => {
            axios
                .post(host, {
                    select: select,
                    where: where.push(
                        'business in (select content from record where add_time > ' +
                            lastTime +
                            " and business = '" +
                            account.id +
                            "' and action ='following' and type = 'business')",
                    ),
                    order: order,
                    lat: (lat !== undefined && lat) || null,
                    lng: (lng !== undefined && lng) || null,
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

            if (item.id) {
                const type = cellType.toLowerCase();
                if (type === CellType.feed) {
                    return <FeedCell data={item} {...this.props} />;
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
                {...this.props}
            />
        );
    }
}

export default Default;
