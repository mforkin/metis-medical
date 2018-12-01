import { combineReducers } from 'redux'
// import * as ActionTypes from '../actions'
import specialties from './specialty'
import vignettes from './vignette'


const rootReducer = combineReducers({
    specialties,
    vignettes
});

export default rootReducer;