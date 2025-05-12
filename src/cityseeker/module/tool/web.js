import React from 'react';
import {
    View,
    StatusBar,
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
    Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';
import {HIDE_STATUS, TRANSLUCENT_STATUS} from '../../utils/lib';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerTitle: (
                <View
                    style={[
                        Style.column,
                        Style.row_center,
                        Style.column_center,
                    ]}>
                    <Image
                        source={require('../../../common/assets/images/logo.png')}
                        style={{
                            width: 60,
                            height: 20,
                        }}
                    />
                    <Text
                        numberOfLines={1}
                        style={[Style.f_size_12, Style.f_color_6]}>
                        {navigation.getParam('title')}
                    </Text>
                </View>
            ),
            title: navigation.getParam('title'),
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
            headerTransparent: false,
            headerStyle: {
                ...Style.b_b_0,
                ...Style.theme_header,
            },
            headerTitleStyle: {
                ...Style.f_size_15,
                ...Style.f_color_3,
                ...Style.f_bold,
            },
            headerTintColor: Style.f_color_cityseeker.color,
        };
    };

    render() {
        const {navigation} = this.props;

        const {url} = navigation.state.params;

        const injectedJavaScript = `true;`;

        return (
            <View style={[Style.w_100, Style.h_fill]}>
                <StatusBar
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={!TRANSLUCENT_STATUS}
                />
                <WebView
                    style={[
                        {...StyleSheet.absoluteFillObject},
                        Style.theme_content,
                    ]}
                    source={{uri: url}}
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
                    onLoadProgress={e => {}}
                    onLoad={syntheticEvent => {
                        const {title} = syntheticEvent.nativeEvent;
                        navigation.setParams({
                            title: title,
                        });
                    }}
                    injectedJavaScript={injectedJavaScript}
                />
            </View>
        );
    }
}

export default Default;
