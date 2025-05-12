import React from 'react';
import PropTypes from 'prop-types';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';

import Style from '../common/style';

import Sidebar from './views/SidebarView';

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

// Outside
const OutsideStack = createStackNavigator(
    {
        OnboardingView: {
            getScreen: () => require('./views/OnboardingView').default,
            header: null,
        },
        NewServerView: {
            getScreen: () => require('./views/NewServerView').default,
        },
        LoginSignupView: {
            getScreen: () => require('./views/LoginSignupView').default,
        },
        LoginView: {
            getScreen: () => require('./views/LoginView').default,
        },
        ForgotPasswordView: {
            getScreen: () => require('./views/ForgotPasswordView').default,
        },
        RegisterView: {
            getScreen: () => require('./views/RegisterView').default,
        },
        LegalView: {
            getScreen: () => require('./views/LegalView').default,
        },
    },
    {
        defaultNavigationOptions: defaultHeader,
    },
);

const AuthenticationWebViewStack = createStackNavigator(
    {
        AuthenticationWebView: {
            getScreen: () => require('./views/AuthenticationWebView').default,
        },
    },
    {
        defaultNavigationOptions: defaultHeader,
    },
);

const OutsideStackModal = createStackNavigator(
    {
        OutsideStack,
        AuthenticationWebViewStack,
    },
    {
        mode: 'modal',
        headerMode: 'none',
    },
);

const RoomRoutes = {
    RoomView: {
        getScreen: () => require('./views/RoomView').default,
    },
    ThreadMessagesView: {
        getScreen: () => require('./views/ThreadMessagesView').default,
    },
    MarkdownTableView: {
        getScreen: () => require('./views/MarkdownTableView').default,
    },
    ReadReceiptsView: {
        getScreen: () => require('./views/ReadReceiptView').default,
    },
};

// Inside
const ChatsStack = createStackNavigator(
    {
        RoomsListView: {
            getScreen: () => require('./views/RoomsListView').default,
        },
        RoomActionsView: {
            getScreen: () => require('./views/RoomActionsView').default,
        },
        RoomInfoView: {
            getScreen: () => require('./views/RoomInfoView').default,
        },
        RoomInfoEditView: {
            getScreen: () => require('./views/RoomInfoEditView').default,
        },
        RoomMembersView: {
            getScreen: () => require('./views/RoomMembersView').default,
        },
        SearchMessagesView: {
            getScreen: () => require('./views/SearchMessagesView').default,
        },
        SelectedUsersView: {
            getScreen: () => require('./views/SelectedUsersView').default,
        },
        MessagesView: {
            getScreen: () => require('./views/MessagesView').default,
        },
        AutoTranslateView: {
            getScreen: () => require('./views/AutoTranslateView').default,
        },
        DirectoryView: {
            getScreen: () => require('./views/DirectoryView').default,
        },
        NotificationPrefView: {
            getScreen: () =>
                require('./views/NotificationPreferencesView').default,
        },
        ...RoomRoutes,
    },
    {
        defaultNavigationOptions: defaultHeader,
    },
);

ChatsStack.navigationOptions = ({navigation}) => {
    let drawerLockMode = 'unlocked';
    if (navigation.state.index > 0) {
        drawerLockMode = 'locked-closed';
    }
    return {
        drawerLockMode,
    };
};

const ProfileStack = createStackNavigator(
    {
        ProfileView: {
            getScreen: () => require('./views/ProfileView').default,
        },
    },
    {
        defaultNavigationOptions: defaultHeader,
    },
);

ProfileStack.navigationOptions = ({navigation}) => {
    let drawerLockMode = 'unlocked';
    if (navigation.state.index > 0) {
        drawerLockMode = 'locked-closed';
    }
    return {
        drawerLockMode,
    };
};

const SettingsStack = createStackNavigator(
    {
        SettingsView: {
            getScreen: () => require('./views/SettingsView').default,
        },
        LanguageView: {
            getScreen: () => require('./views/LanguageView').default,
        },
    },
    {
        defaultNavigationOptions: defaultHeader,
    },
);

SettingsStack.navigationOptions = ({navigation}) => {
    let drawerLockMode = 'unlocked';
    if (navigation.state.index > 0) {
        drawerLockMode = 'locked-closed';
    }
    return {
        drawerLockMode,
    };
};

const AdminPanelStack = createStackNavigator(
    {
        AdminPanelView: {
            getScreen: () => require('./views/AdminPanelView').default,
        },
    },
    {
        defaultNavigationOptions: defaultHeader,
    },
);

const ChatsDrawer = createDrawerNavigator(
    {
        ChatsStack,
        ProfileStack,
        SettingsStack,
        AdminPanelStack,
    },
    {
        contentComponent: Sidebar,
        overlayColor: '#00000090',
    },
);

const NewMessageStack = createStackNavigator(
    {
        NewMessageView: {
            getScreen: () => require('./views/NewMessageView').default,
        },
        SelectedUsersViewCreateChannel: {
            getScreen: () => require('./views/SelectedUsersView').default,
        },
        CreateChannelView: {
            getScreen: () => require('./views/CreateChannelView').default,
        },
    },
    {
        defaultNavigationOptions: defaultHeader,
    },
);

const InsideStackModal = createStackNavigator(
    {
        // Main: ChatsDrawer,
        Main: ChatsStack,
        NewMessageStack,
        JitsiMeetView: {
            getScreen: () => require('./views/JitsiMeetView').default,
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
    },
);

const SetUsernameStack = createStackNavigator({
    SetUsernameView: {
        getScreen: () => require('./views/SetUsernameView').default,
    },
});

class CustomInsideStack extends React.Component {
    static router = InsideStackModal.router;

    static propTypes = {
        navigation: PropTypes.object,
    };

    render() {
        const {navigation} = this.props;
        return (
            <>
                <InsideStackModal navigation={navigation} />
            </>
        );
    }
}

const App = createAppContainer(
    createSwitchNavigator(
        {
            // OutsideStack: OutsideStackModal,
            OutsideStack: CustomInsideStack,
            InsideStack: CustomInsideStack,
            // AuthLoading: {
            //     getScreen: () => require('./views/AuthLoadingView').default,
            // },
            // SetUsernameStack
        },
        {
            // initialRouteName: 'AuthLoading',
        },
    ),
);

export default App;
