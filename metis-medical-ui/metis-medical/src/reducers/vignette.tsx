import * as _ from 'lodash';

const vignettes = (
    state = {
        availableVignettes: [],
        selectedVignetteId: -1,
        vignette: {
            data: {
                name: '',
                specialtyId: -1,
                stages: []
            }
        }
    },
    action
) => {
    switch (action.type) {
        case 'LOAD_AVAILABLE_VIGNETTES':
            return {
                ...state,
                availableVignettes: action.data,
                selectedVignetteId: action.selectedVignetteId || state.selectedVignetteId
            };
            break;
        case 'VIGNETTE_SELECTED':
            return {
                ...state,
                selectedVignetteId: action.data.selectedVignetteId,
                vignette: action.data.vignette
            };
            break;
        case 'VIGNETTE_SPEC_CHANGE':
            return {
                ...state,
                selectedVignetteId: -1,
                vignette: {
                    ..._.get(state, 'vignette'),
                    data: action.data
                }
            };
            break;
        case 'VIGNETTE_NAME_CHANGE':
            return {
                ...state,
                vignette: {
                    ..._.get(state, 'vignette'),
                    data: action.data
                }
            };
            break;
        case 'VIGNETTE_STAGE_ADD':
        case 'VIGNETTE_QUESTION_ADD':
        case 'VIGNETTE_ANSWER_ADD':
        case 'VIGNETTE_STAGE_NAME_CHANGE':
        case 'VIGNETTE_STAGE_SEQ_CHANGE':
        case 'VIGNETTE_ANSWER_PROP_CHANGE':
        case 'VIGNETTE_QUESTION_NAME_CHANGE':
        case 'VIGNETTE_QUESTION_MULTI_CHANGE':
        case 'VIGNETTE_QUESTION_TYPE_CHANGE':
        case 'VIGNETTE_QUESTION_SEQ_CHANGE':
            return {
                ...state,
                vignette: {
                    ..._.get(state, 'vignette'),
                    data: {
                        ..._.get(state, 'vignette.data'),
                        stages: action.data
                    }
                }
            };
            break;
        default:
            return state;
            break;
    }
};

export default vignettes;

