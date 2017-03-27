/**
 * Created by Daniel on 15/01/2017.
 */
import {MODALS, } from '../constants';
const initialState = {
    activeModal: 'NONE',
    walkThroughModalState: 0,
    node : null,
    indexList : null,
    depth : null,
    last : false,
    collaboratorList : [],
};

export default function modals(state = initialState, action) {
    switch (action.type) {
        case 'NODE_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.NODE_MODAL,
                depth : action.depth
            });
        case 'DELETE_NODE_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.DELETE_NODE_MODAL,
            });
        case 'SHARE_NODE_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.SHARE_NODE_MODAL,
            });
        case 'LEAVE_NODE_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.LEAVE_NODE_MODAL,
            });
        case 'INVITATION_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.INVITATION_MODAL,
            });
        case 'SET_NODE' :
            if(action.last !== null) {
                return Object.assign({}, state, {
                    node: action.node,
                    indexList: action.indexList,
                    last: action.last,
                    depth: action.depth
                });
            }
            else {
                return Object.assign({}, state, {
                    node: action.node,
                    indexList: action.indexList,
                    depth: action.depth
                });
            }
        case 'SET_INDEX' :
        return Object.assign({}, state, {
            indexList : action.indexList
        });
        case 'HIDE_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.NONE,
                parentName : null
            });
        case 'WALK_THROUGH_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.WALK_THROUGH_MODAL,
                walkThroughModalState: 1,
            });
        case 'SET_COLLABORATORS' :
            return Object.assign({}, state, {
                collaboratorList: action.collaboratorList
            });
        case 'WALK_THROUGH_STATE' :
            return Object.assign({}, state, {
                walkThroughModalState: action.state
            });
        default:
            return state;
    }
}