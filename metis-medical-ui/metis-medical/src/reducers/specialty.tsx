import * as _ from 'lodash';


const specialties = (state = { specialties: {}, editorSpecialties: {}, newSpec: '' }, action) => {
    switch (action.type) {
        case 'LOAD_SPECIALTIES':
            return {
                ...state,
                editorSpecialties: _.get(action, 'data'),
                newSpec: '',
                specialties: _.get(action, 'data')
            };
            break;
        case 'LOAD_EDITOR_SPECIALTIES':
            const data = {
                ...state,
                editorSpecialties: {
                    ..._.get(state, 'editorSpecialties')
                }
            };
            _.set(data, 'editorSpecialties.' + _.get(action, 'data.key'), _.get(action, 'data.value'));
            return data;
        case 'LOAD_EDITOR_SPEC':
            return {
                ...state,
                newSpec: _.get(action, 'data')
            };
        default:
            return state;
            break;
    };
};

export default specialties;

