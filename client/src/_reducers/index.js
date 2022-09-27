import { combineReducers } from 'redux' // 여러가지 Reducer를 하나로 합쳐준다.
import user from './user_reducer';

const rootReducer = combineReducers({
  user
})

export default rootReducer;