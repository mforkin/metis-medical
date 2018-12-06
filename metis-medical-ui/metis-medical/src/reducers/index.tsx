import { combineReducers } from 'redux'
// import * as ActionTypes from '../actions'
import sidebar from './sidebar'
import specialties from './specialty'
import vignettes from './vignette'


const rootReducer = combineReducers({
    sidebar,
    specialties,
    vignettes
});

export default rootReducer;