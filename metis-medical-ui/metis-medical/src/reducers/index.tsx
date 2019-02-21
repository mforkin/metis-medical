import { combineReducers } from 'redux'
// import * as ActionTypes from '../actions'
import content from './content'
import results from './results'
import specialties from './specialty'


const rootReducer = combineReducers({
    content,
    results,
    specialties
});

export default rootReducer;