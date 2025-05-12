import React from 'react';
import {SafeAreaView} from 'react-navigation';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import StatusBar from '../../components/StatusBar';
import Sign from './sign';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = () => ({
        header: null,
    });

    constructor(props) {
        super(props);
        Orientation.lockToPortrait();
    }

    render() {
        return (
            <SafeAreaView
                forceInset={{vertical: 'never'}}
                style={[Style.flex, Style.row_end, Style.bg_transparent]}>
                <StatusBar light />
                <Video
                    source={require('../../../common/assets/images/video.mp4')}
                    style={[Style.absolute_fill]}
                    muted={true}
                    repeat={true}
                    resizeMode={'cover'}
                    rate={1.0}
                    ignoreSilentSwitch={'obey'}
                />
                <Sign displayAsModal={false} showSkipButton={true} />
            </SafeAreaView>
        );
    }
}

export default Default;
