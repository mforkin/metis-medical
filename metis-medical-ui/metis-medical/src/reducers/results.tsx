import * as _ from 'lodash';


const results = (state = { results: [] }, action) => {
    switch (action.type) {
        case 'LOAD_RESULTS':
            return {
                ...state,
                results: _.get(action, 'data'),
            };
            break;
        default:
            return state;
            break;
    };
};

export default results;
