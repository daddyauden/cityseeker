// import {NavigationActions} from 'react-navigation';
//
// let _navigator;
//
// function setTopLevelNavigator(navigatorRef) {
//     _navigator = navigatorRef;
// }
//
// function navigate(routeName, params) {
//     _navigator.dispatch(
//         NavigationActions.navigate({
//             routeName,
//             params,
//         }),
//     );
// }
//
// export default {
//     navigate,
//     setTopLevelNavigator,
// };

import Navigation from '../../cityseeker/lib/navigation';

export default {
    navigate: Navigation.navigate,
    setTopLevelNavigator: Navigation.setTopLevelNavigator,
};
