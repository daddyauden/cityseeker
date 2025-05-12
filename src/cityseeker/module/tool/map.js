import React from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {withNavigation} from 'react-navigation';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import {Common, HIDE_STATUS, TRANSLUCENT_STATUS} from '../../utils/lib';
import LoadingIndicator from '../../components/LoadingIndicator';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <View style={[Style.p_l_3, Style.h_center]}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            style={[Style.f_size_22, Style.f_color_4]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            new_lat: null,
            new_lng: null,
        };
    }

    componentDidMount() {
        this._getCurrentLocation();
    }

    _getCurrentLocation = async () => {
        const {lat, lng} = this.props.system;

        if (lat === null && lng === null) {
            const {coords} = await Common.getCurrentPosition();

            if (coords !== undefined) {
                this.setState({
                    new_lat: coords.latitude,
                    new_lng: coords.longitude,
                });
            }
        }
    };

    render() {
        const {data} = this.props.navigation.state.params;

        const {lat, lng} = this.props.system;

        const {new_lat, new_lng} = this.state;

        const lat2 = lat || new_lat;
        const lng2 = lng || new_lng;

        if (lat2 === null) {
            return (
                <View style={[Style.flex, Style.v_center]}>
                    <LoadingIndicator />
                </View>
            );
        } else {
            let address = data.address;

            if (data.city) {
                address += ' ' + I18n.t('data.city');
            }

            if (data.state) {
                address += ',' + I18n.t('data.state');
            }

            if (data.country) {
                address += ',' + I18n.t('data.country');
            }

            if (data.zip) {
                address += ' ' + data.zip;
            }

            const url =
                'https://www.google.com/maps/dir/' +
                lat2 +
                ',' +
                lng2 +
                '/' +
                address;

            const injectedJavaScript = `
      document.body.style.backgroundColor = '#F8F8F8';
      true;
    `;

            return (
                <SafeAreaView style={[Style.flex, Style.theme_header]}>
                    <StatusBar
                        hidden={HIDE_STATUS}
                        barStyle="dark-content"
                        translucent={TRANSLUCENT_STATUS}
                    />
                    <WebView
                        style={[
                            {...StyleSheet.absoluteFillObject},
                            Style.theme_content,
                        ]}
                        source={{uri: url}}
                        useWebKit={true}
                        originWhitelist={['*']}
                        hideKeyboardAccessoryView={false}
                        geolocationEnabled={true}
                        scrollEnabled={true}
                        injectedJavaScript={injectedJavaScript}
                    />
                </SafeAreaView>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        account: state.account,
        system: state.system,
    };
}

export default connect(mapStateToProps)(withNavigation(Default));
