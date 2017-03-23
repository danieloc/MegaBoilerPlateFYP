const initialState = {
  token: null,
  user: {}
};

export default function auth(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, initialState, state, { hydrated: true });
  }
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
    case 'OAUTH_SUCCESS':
      return Object.assign({}, state, {
        token: action.token,
        user: action.user
      });
    case 'UPDATE_PROFILE_SUCCESS':
      return Object.assign({}, state, {
        user: action.user});
    case 'TODO_FORM_SUCCESS':
      return Object.assign({}, state, {
        user: action.user});
    case 'DELETE_GOAL_SUCCESS':
      return Object.assign({}, state, {
        user: action.user
      });
    case 'UPDATE_GOAL_SUCCESS':
      return Object.assign({}, state, {
        user: action.user
      });
    case 'ADD_NODE_SUCCESS':
      return Object.assign({}, state, {
        user: action.user
      });
    case 'DELETE_NODE_SUCCESS':
      return Object.assign({}, state, {
        user: action.user
      });
    case 'TODO_UNARCHIVED' :
      return Object.assign({}, state, {
        user: action.user
      });
    case 'LOGOUT_SUCCESS':
      return initialState;
    case 'WALK_THROUGH_FINISHED' :
      return Object.assign({}, state, {
        user: action.user
      });
    case 'ACCEPT_NODE_SUCCESS' :
      return Object.assign({}, state, {
        user: action.user
      });
    default:
      return state;
  }
}
