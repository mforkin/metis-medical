import { combineReducers } from 'redux'
// import * as ActionTypes from '../actions'
import content from './content'
import results from './results'
import sidebar from './sidebar'
import specialties from './specialty'
import vignette from './vignette'


const rootReducer = combineReducers({
    content,
    results,
    sidebar,
    specialties,
    vignette
});

export default rootReducer;