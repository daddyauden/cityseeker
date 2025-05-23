import {NavigationActions} from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params, key = '') {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName: routeName,
            params: params,
        }),
    );
}

export default {
    navigate,
    setTopLevelNavigator,
};
