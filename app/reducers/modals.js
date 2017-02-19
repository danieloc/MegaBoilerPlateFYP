/**
 * Created by Daniel on 15/01/2017.
 */
import {MODALS, } from '../constants';
const initialState = {
    activeModal: 'NONE',
    node : null,
    indexList : [0]
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
        case 'SET_NODE' :
            return Object.assign({}, state, {
                node : action.node,
                indexList : action.indexList
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