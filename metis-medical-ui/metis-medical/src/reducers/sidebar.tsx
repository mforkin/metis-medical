import * as _ from 'lodash';

const sidebar = (
    state = {
        feedback: {
            id: ''
        },
        selectedSpecialityId: -1,
        selectedVignetteId: -1,
        userInfo: {
            currentVignette: {
                currentResponse: -1,
                mode: 'answer', // or 'answered'
                questionIdx: 0,
                score: 0,
                stageIdx: 0
            }
        }
    },
    action
) => {
    switch (action.type) {
        case 'SIDEBAR_SPEC_CHANGE':
            return {
                ...state,
                selectedSpecialtyId: action.data
            }
            break;
        case 'SIDEBAR_VIGNETTE_CHANGE':
            return {
                ...state,
                selectedVignetteId: action.data
            }
            break;
        case 'SIDEBAR_NEXT_QUESTION':
            return {
                ...state,
                feedback: {
                    id: ''
                },
                userInfo: {
                    ...state.userInfo,
                    currentVignette: {
                        ..._.get(state, 'userInfo.currentVignette'),
                        currentResponse: -1,
                        mode: 'answer',
                        questionIdx: _.get(action, 'data.questionIdx'),
                        stageIdx: _.get(action, 'data.stageIdx')
                    }
                }
            };
            break;
        case 'SIDEBAR_QUESTION_ANSWERED':
            return {
                ...state,
                feedback: {
                    id: _.get(action, 'data')
                },
                userInfo: {
                    ...state.userInfo,
                    currentVignette: {
                        ..._.get(state, 'userInfo.currentVignette'),
                        mode: 'answered'
                    }
                }
            };
            break;
        case 'SIDEBAR_RESPONSE_CHANGED':
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    currentVignette: {
                        ..._.get(state, 'userInfo.currentVignette'),
                        currentResponse: _.get(action, 'data.currentResponse')
                    }
                }
            };
            break;
        default:
            return state;
            break;
    }
}

export default sidebar