import React from 'react';
import {View, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-navigation';
import StatusBar from '../../components/StatusBar';
import RouteConfig from '../../config/route';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('title'),
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
        };
    };

    render() {
        const {navigation} = this.props;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <StatusBar light />
                <WebView
                    style={[
                        {...StyleSheet.absoluteFillObject},
                        Style.theme_content,
                    ]}
                    source={{uri: RouteConfig.support.terms_of_use}}
                    originWhitelist={['*']}
                    useWebKit={true}
                    allowsLinkPreview={true}
                    bounces={true}
                    automaticallyAdjustContentInsets={true}
                    dataDetectorTypes="all"
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={true}
                    hideKeyboardAccessoryView={false}
                    geolocationEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    scrollEnabled={true}
                    pagingEnabled={true}
                    onLoad={syntheticEvent => {
                        const {title} = syntheticEvent.nativeEvent;
                        navigation.setParams({
                            title: title,
                        });
                    }}
                />
            </SafeAreaView>
        );
    }
}

export default Default;
