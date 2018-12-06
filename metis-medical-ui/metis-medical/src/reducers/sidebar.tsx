const sidebar = (
    state = {
        selectedSpecialityId: -1,
        selectedVignetteId: -1
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
        default:
            return state;
            break;
    }
}

export default sidebar