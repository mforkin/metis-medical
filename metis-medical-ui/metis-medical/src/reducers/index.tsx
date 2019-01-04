import { combineReducers } from 'redux'
// import * as ActionTypes from '../actions'
import results from './results'
import sidebar from './sidebar'
import specialties from './specialty'
import vignettes from './vignette'


const rootReducer = combineReducers({
    results,
    sidebar,
    specialties,
    vignettes
});

export default rootReducer;