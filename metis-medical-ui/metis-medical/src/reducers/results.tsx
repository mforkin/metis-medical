import * as _ from 'lodash';


const results = (state = { results: [], latest: [], all: [] }, action) => {
    switch (action.type) {
        case 'LOAD_ALL_RESULTS':
            return {
                ...state,
                all: _.get(action, 'data'),
            };
            break;
        case 'LOAD_RESULTS':
            return {
                ...state,
                results: _.get(action, 'data'),
            };
            break;
        case 'LATEST_USER_RESULTS':
            return {
                ...state,
                latest: _.get(action, 'data')
            }
        default:
            return state;
            break;
    };
};

export default results;
