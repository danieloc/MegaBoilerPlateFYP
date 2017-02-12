/**
 * Created by Daniel on 15/01/2017.
 */
import {MODALS, } from '../constants';
const initialState = {
    activeModal: 'NONE',
    parentName : null,
    nodeName : null,
    parentID : null,
    childID : null,
    parentIndex : 0,
    childIndex : null,
    lastParent : false,
    lastChild : false,
};

export default function modals(state = initialState, action) {
    switch (action.type) {
        case 'NODE_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.NODE_MODAL,
                parentName: action.parentName
            });
        case 'DELETE_NODE_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.DELETE_NODE_MODAL,
                nodeName: action.nodeName
            });
        case 'SET_PARENT_NODE' :
            return Object.assign({}, state, {
                parentIndex : action.parentIndex,
                parentID : action.parentID,
                lastParent: action.lastParent,
                childIndex : null,
                childID: null
            });

        case 'DELETE_NODE_SUCCESS':
            var updatedParentIndex = state.parentIndex;
            var updatedChildIndex = state.childIndex;
            if(action.childID === null) {
                if (state.lastParent) {
                    updatedParentIndex -= 1
                }
            }
            else {
                if (state.lastChild) {
                    updatedChildIndex -= 1
                }
            }
            return Object.assign({}, state, {
                parentIndex : updatedParentIndex,
                childIndex : updatedChildIndex,
            });

        case 'SET_CHILD_NODE' :
            console.log(action.childID);
            return Object.assign({}, state, {
                childIndex : action.childIndex,
                lastChild : action.lastChild,
                childID : action.childID
            });
        case 'HIDE_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.NONE,
                parentName : null
            });
        default:
            return state;
    }
}