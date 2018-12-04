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