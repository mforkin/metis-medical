import * as _ from 'lodash';

const getUserBest = (userId, data) => {
    capture = {};
    const e = "what"
    const a = data;
}

const getMostRecent = (userId, data) => {
    const a = data
    const b = userId
    console.log(a);
    console.log(b);
}

const results = (state = { results: [], latest: [], all: [], best: {}, mostRecent: {} }, action) => {
    switch (action.type) {
        case 'LOAD_ALL_RESULTS':
            const data = _.get(action, 'data')
            const userId = _.get(action, 'userId')
            return {
                ...state,
                all: data,
                best: getUserBest(userId, data),
                mostRecent: getMostRecent(userId, data)
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
