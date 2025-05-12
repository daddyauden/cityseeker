import Analytics from './analytics';

export const getActiveRouteName = navigationState => {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.routeName;
};

export const onNavigationStateChange = (prevState, currentState) => {
    const currentScreen = getActiveRouteName(currentState);
    const prevScreen = getActiveRouteName(prevState);

    if (prevScreen !== currentScreen) {
        Analytics.logEvent(currentScreen, currentScreen, {type: 'navigation'});
    }
};
