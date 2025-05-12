import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    StatusBar,
    Button,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import {SafeAreaView} from 'react-navigation';
import MapView, {
    Polyline,
    Marker,
    // PROVIDER_GOOGLE
} from 'react-native-maps';
import {connect} from 'react-redux';
import concat from 'lodash/concat';

import {
    HIDE_STATUS,
    TRANSLUCENT_STATUS,
    WIDTH,
    HEIGHT,
    IS_IOS,
} from '../../utils/lib';
import Log from '../../utils/log';
import Style from '../../style';

const ASPECT_RATIO = WIDTH / HEIGHT;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const obj = {
    coords: [
        {
            latitude: 45.4966332,
            longitude: -73.570342,
        },
        {
            latitude: 45.496733,
            longitude: -73.570363,
        },
        {
            latitude: 45.496819,
            longitude: -73.570524,
        },
        {
            latitude: 45.496902,
            longitude: -73.570712,
        },
        {
            latitude: 45.496989,
            longitude: -73.570878,
        },
        {
            latitude: 45.497079,
            longitude: -73.571076,
        },
        {
            latitude: 45.497133,
            longitude: -73.571199,
        },
        {
            latitude: 45.49717,
            longitude: -73.571263,
        },
        {
            latitude: 45.497257,
            longitude: -73.57145,
        },
        {
            latitude: 45.497316,
            longitude: -73.571573,
        },
        {
            latitude: 45.497403,
            longitude: -73.571745,
        },
        {
            latitude: 45.497499,
            longitude: -73.571636,
        },
        {
            latitude: 45.497594,
            longitude: -73.571545,
        },
        {
            latitude: 45.497723,
            longitude: -73.571415,
        },
        {
            latitude: 45.497863,
            longitude: -73.571279,
        },
        {
            latitude: 45.49804,
            longitude: -73.571114,
        },
        {
            latitude: 45.498089,
            longitude: -73.571073,
        },
        {
            latitude: 45.498141,
            longitude: -73.571155,
        },
        {
            latitude: 45.498175,
            longitude: -73.571237,
        },
        {
            latitude: 45.498233,
            longitude: -73.571295,
        },
        {
            latitude: 45.498301,
            longitude: -73.571511,
        },
        {
            latitude: 45.498424,
            longitude: -73.571779,
        },
    ],
    num: 0,
    incre: function() {
        obj.num++;
    },
};

class Default extends Component {
    static navigationOptions = () => {
        return {
            header: null,
        };
    };

    watchId = null;

    constructor(props) {
        super(props);

        const {lat, lng} = props;

        const latitude = Number(lat).toFixed(IS_IOS ? 7 : 7);
        const longitude = Number(lng).toFixed(IS_IOS ? 7 : 7);
        const latitudeDelta = LATITUDE_DELTA;
        const longitudeDelta = LONGITUDE_DELTA;

        this.state = {
            updatesEnabled: false,
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
            region: {
                latitude,
                longitude,
                latitudeDelta,
                longitudeDelta,
            },
            polyline: [{latitude, longitude}],
        };
    }

    removeLocationUpdates = () => {
        if (this.watchId !== null) {
            Geolocation.clearWatch(this.watchId);
            // clearInterval(this.watchId);
            this.setState({updatesEnabled: false});
        }
    };

    getLocationUpdates = async () => {
        const {latitudeDelta, longitudeDelta} = this.state;

        this.setState({updatesEnabled: true}, () => {
            this.watchId = Geolocation.watchPosition(
                position => {
                    let region = {
                        latitude: position.coords.latitude.toFixed(
                            IS_IOS ? 7 : 7,
                        ),
                        longitude: position.coords.longitude.toFixed(
                            IS_IOS ? 7 : 7,
                        ),
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta,
                    };

                    this.onRegionChange(region);

                    this._map.animateToRegion(region, 1000);
                },
                e => {
                    Log(e);
                },
                {
                    enableHighAccuracy: true,
                    distanceFilter: 0,
                    interval: 1000,
                    fastestInterval: 1000,
                },
            );

            // this.watchId = setInterval(() => {
            //     console.info(obj.num);
            //
            //     let region = {
            //         latitude: obj.coords[obj.num].latitude.toFixed(
            //             IS_IOS ? 7 : 7,
            //         ),
            //         longitude: obj.coords[obj.num].longitude.toFixed(
            //             IS_IOS ? 7 : 7,
            //         ),
            //         latitudeDelta: latitudeDelta,
            //         longitudeDelta: longitudeDelta,
            //     };
            //
            //     this.onRegionChange(region);
            //
            //     this._map.animateToRegion(region, 990);
            //
            //     obj.incre();
            //
            // }, 1000);
        });
    };

    onRegionChange(region) {
        const {latitude, longitude, polyline} = this.state;

        this.setState({
            region,
            latitude: region.latitude || latitude,
            longitude: region.longitude || longitude,
            polyline: concat(polyline, {
                latitude: region.latitude || latitude,
                longitude: region.longitude || longitude,
            }),
        });
    }

    onPressZoomIn() {
        const {latitude, longitude, latitudeDelta, longitudeDelta} = this.state;

        const region = {
            latitude,
            longitude,
            latitudeDelta: latitudeDelta * 5,
            longitudeDelta: longitudeDelta * 5,
        };

        this.setState(
            {
                region,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
            },
            () => {
                this._map.animateToRegion(region, 100);
            },
        );
    }

    onPressZoomOut() {
        const {latitude, longitude, latitudeDelta, longitudeDelta} = this.state;

        const region = {
            latitude,
            longitude,
            latitudeDelta: latitudeDelta / 5,
            longitudeDelta: longitudeDelta / 5,
        };

        this.setState(
            {
                region,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
            },
            () => {
                this._map.animateToRegion(region, 100);
            },
        );
    }

    render() {
        const {region, polyline, updatesEnabled} = this.state;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <StatusBar
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={TRANSLUCENT_STATUS}
                />
                <View style={[Style.flex]}>
                    <MapView
                        // provider={PROVIDER_GOOGLE}
                        zoomEnabled={true}
                        style={[Style.flex]}
                        region={region}
                        ref={component => {
                            this._map = component;
                        }}>
                        <Marker coordinate={region}>
                            <Image
                                source={require('../../../common/assets/images/scooter.png')}
                                style={{height: 40, width: 40}}
                            />
                        </Marker>
                        <Polyline
                            miterLimit={1000}
                            lineCap={'square'}
                            LineJoinType={'miter'}
                            geodesic={true}
                            coordinates={polyline}
                            strokeColor={Style.bg_color_cityseeker.backgroundColor}
                            strokeWidth={2}
                            lineDashPhase={1000}
                        />
                    </MapView>
                </View>
                <View
                    style={[
                        Style.bottom_horizontal,
                        Style.column,
                        Style.column_center,
                        Style.row_center,
                        Style.p_b_4,
                    ]}>
                    <View
                        style={[
                            Style.row,
                            Style.row_around,
                            Style.column_center,
                        ]}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.onPressZoomIn();
                            }}>
                            <MaterialCommunityIcons
                                name="minus-circle"
                                style={[Style.f_size_30, Style.f_color_3]}
                            />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.onPressZoomOut();
                            }}>
                            <MaterialCommunityIcons
                                name="plus-circle"
                                style={[Style.f_size_30, Style.f_color_3]}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                    <View
                        style={[
                            Style.row,
                            Style.row_around,
                            Style.column_center,
                        ]}>
                        <Button
                            title="Start Observing"
                            onPress={this.getLocationUpdates}
                            disabled={updatesEnabled}
                        />
                        <Button
                            title="Stop Observing"
                            onPress={this.removeLocationUpdates}
                            disabled={!updatesEnabled}
                        />
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}>
                            <View
                                style={[
                                    Style.p_l_3,
                                    Style.row_center,
                                    Style.column_center,
                                ]}>
                                <MaterialCommunityIcons
                                    name="arrow-up-circle"
                                    style={[Style.f_size_30, Style.f_color_3]}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <Text>
                        {region.latitude}, {region.longitude}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        lat: state.system.lat,
        lng: state.system.lng,
    };
};

export default connect(mapStateToProps)(Default);
