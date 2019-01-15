import * as _ from 'lodash';

const sidebar = (
    state = {
        feedback: {
            id: ''
        },
        selectedVignetteId: -1,
        specialtyId: -1,
        userInfo: {
            currentVignette: {
                currentResponse: -1,
                iteration: 0,
                mode: 'answer', // or 'answered'
                questionIdx: 0,
                score: 0,
                stageIdx: 0
            },
            user: {
                isAdmin: false,
                specialtyId: -1,
                username: ''
            }
        }
    },
    action
) => {
    switch (action.type) {
        case 'LOAD_USER_INFO':
            console.log('loadUser');
            console.log(action.data);
            return {
                ...state,
                specialtyId: _.get(action, 'data.specialtyId'),
                userInfo: {
                    ..._.get(state, 'userInfo'),
                    user: {
                        isAdmin: _.get(action, 'data.isAdmin'),
                        specialtyId: _.get(action, 'data.specialtyId'),
                        username: _.get(action, 'data.userName')
                    }
                }
            }
            break;
        case 'SIDEBAR_LAST_QUESTION_ANSWERED':
            return {
                ...state,
                userInfo: {
                    ..._.get(state, 'userInfo'),
                    currentVignette: {
                        ..._.get(state, 'userInfo.currentVignette'),
                        inProgress: _.get(action, 'data')
                    }
                }
            }
            break;
        case 'SIDEBAR_SPEC_CHANGE':
            return {
                ...state,
                specialtyId: action.data
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
                        currentResponse: [],
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
        case 'SIDEBAR_UPDATE_ITERATION':
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    currentVignette: {
                        ..._.get(state, 'userInfo.currentVignette'),
                        iteration: _.get(action, 'data.iteration')
                    }
                }
            }
        default:
            return state;
            break;
    }
}

export default sidebar