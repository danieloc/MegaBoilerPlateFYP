import moment from 'moment';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';

export function login(email, password) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            token: json.token,
            user: json.user
          });
          cookie.save('token', json.token, { expires: moment().add(1, 'hour').toDate() });
          browserHistory.push('/account');
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'LOGIN_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function signup(name, email, password) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/signup', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, password: password })
    }).then((response) => {
      return response.json().then((json) => {
        if (response.ok) {
          dispatch({
            type: 'SIGNUP_SUCCESS',
            token: json.token,
            user: json.user
          });
          browserHistory.push('/');
          cookie.save('token', json.token, { expires: moment().add(1, 'hour').toDate() });
        } else {
          dispatch({
            type: 'SIGNUP_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        }
      });
    });
  };
}

export function logout() {
  cookie.remove('token');
  browserHistory.push('/login');
  return {
    type: 'LOGOUT_SUCCESS'
  };
}

export function forgotPassword(email) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/forgot', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'FORGOT_PASSWORD_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'FORGOT_PASSWORD_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function resetPassword(password, confirm, pathToken) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch(`/reset/${pathToken}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: password,
        confirm: confirm
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          browserHistory.push('/login');
          dispatch({
            type: 'RESET_PASSWORD_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'RESET_PASSWORD_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function updateProfile(state, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/account', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: state.email,
        name: state.name,
        gender: state.gender,
        location: state.location,
        website: state.website,
        primaryColor: state.color
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'UPDATE_PROFILE_SUCCESS',
            user: json.user,
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'UPDATE_PROFILE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function changePassword(password, confirm, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/account', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        password: password,
        confirm: confirm
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'CHANGE_PASSWORD_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'CHANGE_PASSWORD_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function deleteAccount(token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/account', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(logout());
          dispatch({
            type: 'DELETE_ACCOUNT_SUCCESS',
            messages: [json]
          });
        });
      }
    });
  };
}

export function submitNodeToDoForm(state, nodeID,indexList, depth, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/todos', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: state.email,
        todoTitle: state.goal,
        todoPriority:state.priority,
        nodeID : nodeID,
        indexList : indexList,
        depth : depth
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'SET_NODE',
            node: json.nodeInformation,
            indexList: indexList,
            depth: depth
          });
          dispatch({
            type: 'TODO_FORM_SUCCESS',
            messages: [{msg : "Goal Submitted"}],
            user: json.user
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'TODO_FORM_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function removeToDo(email , todoID, nodeID, indexList, depth, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/todos', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: email,
        todoID: todoID,
        nodeID: nodeID,
        indexList: indexList,
        depth : depth
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'SET_NODE',
            node: json.nodeInformation,
            indexList: indexList,
            depth: depth
          });
          dispatch({
            type: 'DELETE_GOAL_SUCCESS',
            messages: [{msg : "Goal Deleted"}],
            user: json.user
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'DELETE_GOAL_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}
export function updateToDo(email , todoID, name, priority, nodeID, indexList, depth, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/todos', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: email,
        todoID: todoID,
        todoTitle: name,
        todoPriority: priority,
        nodeID: nodeID,
        indexList: indexList,
        depth : depth
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'SET_NODE',
            node: json.nodeInformation,
            indexList: indexList,
            depth: depth
          });
          dispatch({
            type: 'UPDATE_GOAL_SUCCESS',
            messages: [{msg : "Goal updated"}],
            user: json.user
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'UPDATE_GOAL_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}



export function addNodeForm(email, name, indexList, depth, token) {
  return (dispatch) => {
    return fetch('/nodes', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: email,
        nodeTitle: name,
        indexList : indexList,
        depth : depth
      })
    }).then((response) => {
      if(response.ok) {
        return response.json().then((json) => {

          console.log("----------------ADD-RESPONSE-----------------------------------");
          console.log("User");
          console.log(json.user);
          console.log("NodeInformaiton");
          console.log(json.nodeInformation);
          console.log("IndexList");
          console.log(json.indexList);
          console.log("Last");
          console.log(json.last);
          console.log("Depth");
          console.log(json.depth);

          dispatch({
            type: 'SET_NODE',
            node: json.nodeInformation,
            indexList: json.indexList,
            last: json.last,
            depth: json.depth
          });
            dispatch({
              type: 'ADD_NODE_SUCCESS',
              messages: 'The node was added successfully',
              user: json.user
            });
        });
      }
      else {
        return response.json().then((json) => {
          dispatch({
            type: 'ADD_NODE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function deleteNodeForm(email, nodeID, indexList, depth, last, token) {
  return (dispatch) => {
    return fetch('/nodes', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: email,
        _id : nodeID,
        indexList : indexList,
        depth : depth,
        last : last
      })
    }).then((response) => {
      if(response.ok) {
        return response.json().then((json) => {
          console.log("----------------DELETE-RESPONSE-----------------------------------");
          console.log("User");
          console.log(json.user);
          console.log("NodeInformaiton");
          console.log(json.nodeInformation);
          console.log("IndexList");
          console.log(json.indexList);
          console.log("Last");
          console.log(json.last);
          var length = null;
          console.log(json.user);
          if(json.nodeInformation) {
            length = json.indexList.length;
          }
          dispatch({
            type: 'SET_NODE',
            node: json.nodeInformation,
            indexList: json.indexList,
            last: json.last,
            depth: length
          });
          dispatch({
            type: 'DELETE_NODE_SUCCESS',
            messages: 'The node was deleted successfully',
            user: json.user,
          });
        });
      }
      else {
        return response.json().then((json) => {
          dispatch({
            type: 'DELETE_NODE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}