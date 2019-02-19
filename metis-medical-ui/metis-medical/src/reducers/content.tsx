import * as _ from 'lodash';

const content = (
    state = {
        availableVignettes: [],
        feedback: {
            id: ''
        },
        selectedVignette: {
            data: {
                name: '',
                seq: -1,
                specialtyId: -1,
                stages: []
            },
            id: -1,
            userInfo: {
                currentResponse: -1,
                inProgress: '',
                iteration: 0,
                mode: 'answer',
                questionIdx: 0,
                score: 0,
                stageIdx: 0
            }
        },
        specialtyId: -1,
        userInfo: {
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
        // vignette.orig
        case 'LOAD_AVAILABLE_VIGNETTES':
            return {
                ...state,
                availableVignettes: action.data,
                selectedVignette: {
                    data: {
                        name: '',
                        specialtyId: -1,
                        stages: []
                    },
                    id: action.selectedVignetteId || state.selectedVignette.id,
                    userInfo: {
                        currentResponse: -1,
                        inProgress: (state.selectedVignette.userInfo && state.selectedVignette.userInfo.inProgress) || '',
                        iteration: 0,
                        mode: 'answer',
                        questionIdx: 0,
                        score: 0,
                        stageIdx: 0
                    }
                }
            };
            break;
        case 'VIGNETTE_SELECTED':
            return {
                ...state,
                selectedVignette: {
                    data: action.data.vignette.data,
                    id: action.data.selectedVignetteId,
                    userInfo: {
                        currentResponse: -1,
                        inProgress: state.selectedVignette.userInfo.inProgress,
                        iteration: 0,
                        mode: 'answer',
                        questionIdx: 0,
                        score: 0,
                        stageIdx: 0
                    }
                }
            };
            break;
            // CHANGED
        case 'VIGNETTE_SPEC_CHANGE':
            return {
                ...state,
                selectedVignette: {
                    data: action.data,
                    id: -1
                }
            };
            break;
            // CHANGED
        case 'VIGNETTE_SEQ_CHANGE':
            return {
                ...state,
                selectedVignette: {
                    data: action.data,
                    id: state.selectedVignette.id
                }
            };
            break;
            // CHANGED
        case 'VIGNETTE_NAME_CHANGE':
            return {
                ...state,
                selectedVignette: {
                    data: action.data,
                    id: state.selectedVignette.id
                }
            };
            break;
            // MAJOR CHANGE
        case 'VIGNETTE_USER_DATA_LOADED':
            return {
                ...state,
                selectedVignette: {
                    ...state.selectedVignette,
                    userInfo: {
                        ...state.selectedVignette.userInfo,
                        inProgress: _.get(action.data[0], 'inProgress')
                    }
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
                selectedVignette: {
                    ...state.selectedVignette,
                    data: {
                        ..._.get(state, 'selectedVignette.data'),
                        stages: action.data
                    }
                }
            };
            break;
        // sidebar.orig
        case 'LOAD_USER_INFO':
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
            // CHANGED
        case 'SIDEBAR_LAST_QUESTION_ANSWERED':
            return {
                ...state,
                selectedVignette: {
                    ...state.selectedVignette,
                    userInfo: {
                        ...state.selectedVignette.userInfo,
                        inProgress: _.get(action, 'data')
                    }
                }
            }
            break;
            // CHANGED
        case 'SIDEBAR_SPEC_CHANGE':
            return {
                ...state,
                availableVignettes: [],
                feedback: {
                    id: ''
                },
                selectedVignette: {
                    data: {
                        name: '',
                        specialtyId: -1,
                        stages: []
                    },
                    id: -1,
                    userInfo: {
                        currentResponse: -1,
                        inProgress: '',
                        iteration: 0,
                        mode: 'answer',
                        questionIdx: 0,
                        score: 0,
                        stageIdx: 0
                    }
                },
                specialtyId: action.data
            }
            break;
            // CHANGED
        case 'SIDEBAR_VIGNETTE_CHANGE':
            return {
                ...state,
                feedback: {
                    id: ''
                },
                selectedVignette: {
                    data: {
                        name: '',
                        specialtyId: -1,
                        stages: []
                    },
                    id: action.data,
                    userInfo: {
                        currentResponse: -1,
                        inProgress: '',
                        iteration: 0,
                        mode: 'answer', // or answered
                        questionIdx: 0,
                        score: 0,
                        stageIdx: 0
                    }
                }
            }
            break;
        case 'SIDEBAR_NEXT_QUESTION':
            return {
                ...state,
                feedback: {
                    id: ''
                },
                selectedVignette: {
                    ...state.selectedVignette,
                    userInfo: {
                        ...state.selectedVignette.userInfo,
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
                selectedVignette: {
                    ...state.selectedVignette,
                    userInfo: {
                        ...state.selectedVignette.userInfo,
                        mode: 'answered'
                    }
                }
            };
            break;
        case 'SIDEBAR_RESPONSE_CHANGED':
            return {
                ...state,
                selectedVignette: {
                    ...state.selectedVignette,
                    userInfo: {
                        ...state.selectedVignette.userInfo,
                        currentResponse: _.get(action, 'data.currentResponse')
                    }
                }
            };
            break;
        case 'SIDEBAR_UPDATE_ITERATION':
            return {
                ...state,
                selectedVignette: {
                    ...state.selectedVignette,
                    userInfo: {
                        ...state.selectedVignette.userInfo,
                        iteration: _.get(action, 'data.iteration')
                    }
                }
            }
        default:
            return state;
            break;
    }
};

export default content;