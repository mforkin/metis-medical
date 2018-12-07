import * as _ from 'lodash';

// Specialty Actions

export const LOAD_SPECIALTIES = (specialties) => {
    return {
        data: specialties,
        type: 'LOAD_SPECIALTIES'
    };
};

export const LOAD_EDITOR_SPECIALTIES = (specialty, v) => {
    return {
        data: {key: specialty, value: v},
        type: 'LOAD_EDITOR_SPECIALTIES'
    };
};

export const LOAD_EDITOR_SPEC = (spec) => {
    return {
        data: spec,
        type: 'LOAD_EDITOR_SPEC'
    };
};

export const loadSpecialties = () => {
    return (dispatch) => {
        console.log('doing request');
        return fetch("/api/specialty", {
            headers: {
                "accepts": "application/json"
            }
        })
            .then((resp) => resp.json())
            .then((data) => {
                dispatch(LOAD_SPECIALTIES(data));
            })
    }
};

// Vignette Actions

export const createOrUpdateVignette = (vignette, selectedId) => {
    return (dispatch) => {
        return fetch("/api/vignette/", {
            body: JSON.stringify({...vignette}),
            method: selectedId === -1 ? 'post' : 'put'
        })
            .then(response => response.json())
            .then((data) => {
                dispatch(loadAvailableVignettes(_.get(vignette, 'data.specialtyId'), data.id));
            });
    }
}

export const VIGNETTE_SELECTED = (specId, availableVignettes, e) => {
    const vId = parseInt(e, 10);
    let dataObj = {};

    if (vId === -1) {
        dataObj = {
            selectedVignetteId: vId,
            vignette: {
                data: {
                    name: '',
                    specialtyId: specId,
                    stages: []
                }
            }
        };
    } else {
        dataObj = {
            selectedVignetteId: vId,
            vignette: _.find(availableVignettes, (v) => {
                return v.id === vId;
            })
        };
    }
    return {
        data: dataObj,
        type: 'VIGNETTE_SELECTED'
    }
};

export const LOAD_AVAILABLE_VIGNETTES = (d, selectId) => {
    return {
        data: d,
        selectedVignetteId: selectId,
        type: 'LOAD_AVAILABLE_VIGNETTES'
    };
};

export const loadAvailableVignettes = (e, selectId) => {
    return (dispatch) => {
        fetch("/api/vignette/specialty/" + e)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                dispatch(LOAD_AVAILABLE_VIGNETTES(data, selectId));
                if (selectId) {
                    dispatch(VIGNETTE_SELECTED(undefined, data, selectId));
                }
            })
    }
};

export const VIGNETTE_SPEC_CHANGE = (vignetteData, selectedVignetteId, e) => {
    const dataObj = {
        ...vignetteData,
        specialtyId: parseInt(e.target.value, 10)
    }
    if (selectedVignetteId !== -1) {
        _.set(dataObj, 'name', "");
        _.set(dataObj, 'stages', []);
    }
    return {
        data: dataObj,
        type: 'VIGNETTE_SPEC_CHANGE'
    };
};

export const VIGNETTE_NAME_CHANGE = (vignetteData, e) => {
    return {
        data: {
            ...vignetteData,
            name: e.target.value
        },
        type: 'VIGNETTE_NAME_CHANGE'
    };
};


export const VIGNETTE_QUESTION_ADD = (stages, stageIdx) => {
    return {
        data: stages.map((d, i) => {
            let ret = d;
            if (stageIdx === i) {
                ret = {
                    ...d,
                    data: {
                        ...d.data,
                        question: d.data.question.concat([{
                            data: {
                                answers: [],
                                seq: -1,
                                text: ""
                            }
                        }])
                    }
                };
            }
            return ret;
        }),
        type: 'VIGNETTE_QUESTION_ADD'
    }

};

export const VIGNETTE_QUESTION_SEQ_CHANGE = (stages, stageIdx, qIdx, e) => {
    return {
        data: stages.map((d, i) => {
            let ret = d;
            if (stageIdx === i) {
                ret = {
                    ...d,
                    data: {
                        ...d.data,
                        question: d.data.question.map((q, qi) => {
                            let qRet = q;
                            if (qi === qIdx) {
                                qRet = {
                                    ...q,
                                    data: {
                                        ...q.data,
                                        seq: parseInt(e.target.value, 10)
                                    }
                                }
                            }
                            return qRet
                        })
                    }
                };
            }
            return ret;
        }),
        type: 'VIGNETTE_QUESTION_SEQ_CHANGE'
    };
};

export const VIGNETTE_QUESTION_NAME_CHANGE = (stages, stageIdx, qIdx, e) => {
    return {
        data: stages.map((d, i) => {
            let ret = d;
            if (stageIdx === i) {
                ret = {
                    ...d,
                    data: {
                        ...d.data,
                        question: d.data.question.map((q, qi) => {
                            let qRet = q;
                            if (qi === qIdx) {
                                qRet = {
                                    ...q,
                                    data: {
                                        ...q.data,
                                        text: e.target.value
                                    }
                                }
                            }
                            return qRet
                        })
                    }
                };
            }
            return ret;
        }),
        type: 'VIGNETTE_QUESTION_NAME_CHANGE'
    };
};


export const VIGNETTE_ANSWER_ADD = (stages, stageIdx, questionIdx) => {
    return {
        data: stages.map((d, i) => {
            let ret = d;
            if (i === stageIdx) {
                ret = {
                    ...d,
                    data: {
                        ...d.data,
                        question: d.data.question.map((q, iq) => {
                            let qRet = q;
                            if (iq === questionIdx) {
                                qRet = {
                                    ...q,
                                    data: {
                                        ...q.data,
                                        answers: q.data.answers.concat([{
                                            data: {
                                                correctResponse: "",
                                                incorrectResponse: "",
                                                isCorrect: false,
                                                selectedText: "",
                                                seq: -1,
                                                text: ""
                                            }
                                        }])
                                    }
                                }
                            }
                            return qRet;
                        })
                    }
                }
            }
            return ret;
        }),
        type: 'VIGNETTE_ANSWER_ADD'
    };
};

export const VIGNETTE_ANSWER_PROP_CHANGE = (stages, propName, stageIdx, qIdx, aIdx, e) => {
    return {
        data: stages.map((d, i) => {
            let ret = d;
            if (i === stageIdx) {
                ret = {
                    ...d,
                    data: {
                        ...d.data,
                        question: d.data.question.map((q, qi) => {
                            let qRet = q;
                            if (qi === qIdx) {
                                qRet = {
                                    ...q,
                                    data: {
                                        ...q.data,
                                        answers: q.data.answers.map((a, ai) => {
                                            let aRet = a;
                                            if (ai === aIdx) {
                                                const newProp = {}
                                                let newVal = propName === 'isCorrect' ? e.target.checked : e.target.value
                                                if (propName === 'seq') {
                                                    newVal = parseInt(newVal, 10);
                                                }
                                                _.set(newProp, 'data.' + propName, newVal);

                                                aRet = _.merge({}, a, newProp)
                                            }
                                            return aRet;
                                        })
                                    }
                                }
                            }
                            return qRet;
                        })
                    }
                }
            }
            return ret;
        }),
        type: 'VIGNETTE_ANSWER_PROP_CHANGE'
    };
};


export const VIGNETTE_STAGE_ADD = (stages) => {
    return {
        data: stages.concat([{
            data: {
                name: '',
                question: [],
                seq: -1
            }
        }]),
        type: 'VIGNETTE_STAGE_ADD'
    };
};

export const VIGNETTE_STAGE_SEQ_CHANGE = (stages, stageIdx, e) => {
    return {
        data: stages.map((d, i) => {
            let ret = d;
            if (i === stageIdx) {
                ret = {
                    ...d,
                    data: {
                        ...d.data,
                        seq: parseInt(e.target.value, 10)
                    }
                }
            }

            return ret;
        }),
        type: 'VIGNETTE_STAGE_SEQ_CHANGE'
    };
};

export const VIGNETTE_STAGE_NAME_CHANGE = (stages, stageIdx, e) => {
    return {
        data: stages.map((d, i) => {
            let ret = d;
            if (i === stageIdx) {
                ret = {
                    ...d,
                    data: {
                        ...d.data,
                        name: e.target.value
                    }
                }
            }

            return ret;
        }),
        type: 'VIGNETTE_STAGE_NAME_CHANGE'
    };
};

// Sidebar
export const SIDEBAR_SPEC_CHANGE = (e) => {
    return {
        data: parseInt(e.target.value, 10),
        type: 'SIDEBAR_SPEC_CHANGE'
    };
};

export const SIDEBAR_VIGNETTE_CHANGE = (e) => {
    return {
        data: parseInt(e.target.value, 10),
        type: 'SIDEBAR_VIGNETTE_CHANGE'
    };
};

