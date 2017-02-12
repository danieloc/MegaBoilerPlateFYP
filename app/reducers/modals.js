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
    childIndex : null
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
                nodeName: action.nodeName,
                parentID: action.parentID,
                childID: action.childID
            });
        case 'SET_PARENT_NODE' :
            console.log(action.parentID);
            return Object.assign({}, state, {
                parentIndex : action.parentIndex,
                parentID : action.parentID,
                childIndex : null,
                childID: null
            });

        case 'SET_CHILD_NODE' :
            console.log(action.childID);
            return Object.assign({}, state, {
                childIndex : action.childIndex,
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