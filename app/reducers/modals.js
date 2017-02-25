/**
 * Created by Daniel on 15/01/2017.
 */
import {MODALS, } from '../constants';
const initialState = {
    activeModal: 'NONE',
    node : null,
    indexList : null,
    depth : null,
    last : false
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
        case 'SET_NODE' :
            return Object.assign({}, state, {
                node : action.node,
                indexList : action.indexList,
                last : action.last,
                depth : action.depth
            });
        case 'SET_INDEX' :
        return Object.assign({}, state, {
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