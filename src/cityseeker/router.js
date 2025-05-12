import React from 'react';
import PropTypes from 'prop-types';

import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Chat from '../lingchat/router';
import NotificationBadge from './notifications/inApp';
import Drawer from './module/sidebar/left';
import Module from './module';
import Style from './style';

const defaultHeader = {
    headerTransparent: false,
    headerStyle: {
        ...Style.b_b_0,
        ...Style.theme_content,
    },
    headerTitleStyle: {
        alignSelf: Style.text_center.textAlign,
        fontWeight: Style.f_weight_500.fontWeight,
        fontSize: Style.f_size_15.fontSize,
        color: Style.f_color_3.color,
    },
    headerTintColor: Style.f_color_cityseeker.color,
};

const RestaurantTab = createStackNavigator(Module.Restaurant, {
    defaultNavigationOptions: defaultHeader,
});

const RetailTab = createStackNavigator(Module.Retail, {
    defaultNavigationOptions: defaultHeader,
});

const DiscoveryTab = createStackNavigator(Module.Discovery, {
    defaultNavigationOptions: defaultHeader,
});

const HotelTab = createStackNavigator(Module.Hotel, {
    defaultNavigationOptions: defaultHeader,
});

const MoreTab = createStackNavigator(Module.More, {
    defaultNavigationOptions: defaultHeader,
});

// Inside
const TabBarStack = createBottomTabNavigator(
    {
        RestaurantTab,
        RetailTab,
        DiscoveryTab,
        HotelTab,
        MoreTab,
        Chat,
    },
    {
        lazy: true,
        defaultNavigationOptions: defaultHeader,
        tabBarOptions: {
            showLabel: false,
            showIcon: false,
            style: {
                ...Style.h_0,
            },
            safeAreaInset: {
                bottom: 'never',
                top: 'never',
            },
        },
        tabBarVisible: false,
    },
);

TabBarStack.navigationOptions = ({navigation}) => {
    let drawerLockMode = 'unlocked';
    if (navigation.state.index > 0) {
        drawerLockMode = 'locked-closed';
    }
    return {
        drawerLockMode,
    };
};

const AccountStack = createStackNavigator(
    {...Module.Account, ...Module.Block},
    {
        defaultNavigationOptions: defaultHeader,
    },
);

AccountStack.navigationOptions = ({navigation}) => {
    let drawerLockMode = 'unlocked';
    if (navigation.state.index > 0) {
        drawerLockMode = 'locked-closed';
    }
    return {
        drawerLockMode,
    };
};

const SettingStack = createStackNavigator(Module.Setting, {
    defaultNavigationOptions: defaultHeader,
});

SettingStack.navigationOptions = ({navigation}) => {
    let drawerLockMode = 'unlocked';
    if (navigation.state.index > 0) {
        drawerLockMode = 'locked-closed';
    }
    return {
        drawerLockMode,
    };
};

const DrawerStack = createDrawerNavigator(
    {
        TabBarStack,
        AccountStack,
        SettingStack,
    },
    {
        contentComponent: Drawer,
        overlayColor: Style.bg_color_0_transparent_3.backgroundColor,
        drawerPosition: 'left',
        drawerType: 'behiend',
        hideStatusBar: false,
        drawerWidth: Style.w_75.width,
    },
);

const RunningStackModal = createStackNavigator(
    {
        DrawerStack,
    },
    {
        mode: 'modal',
        headerMode: 'none',
    },
);

class RunningStack extends React.Component {
    static router = RunningStackModal.router;

    static propTypes = {
        navigation: PropTypes.object,
    };

    render() {
        const {navigation} = this.props;
        return (
            <>
                <RunningStackModal navigation={navigation} />
                <NotificationBadge navigation={navigation} />
            </>
        );
    }
}

const LaunchStack = createStackNavigator(Module.Launch, {
    defaultNavigationOptions: defaultHeader,
    mode: 'modal',
    headerMode: 'none',
});

const Default = createAppContainer(
    createSwitchNavigator(
        {
            LaunchStack,
            RunningStack,
            Loading: {
                getScreen: () => require('../loading').default,
            },
        },
        {
            initialRouteName: 'Loading',
            defaultNavigationOptions: defaultHeader,
        },
    ),
);

export default Default;
