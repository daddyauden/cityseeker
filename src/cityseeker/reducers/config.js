import {CONFIG} from '../actions/actionsTypes';

const initialState = {
    draw_dashboard_display_mode: 'H',
    appLinkURL: 'https://itunes.apple.com/us/app/cityseeker/id1449550470?ls=1&mt=8',
};

export default function config(state = initialState, action) {
    switch (action.type) {
        case CONFIG.SUCCESS:
            return {
                ...state,
                ...action.data,
            };

        default:
            return state;
    }
}
