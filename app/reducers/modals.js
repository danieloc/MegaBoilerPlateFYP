/**
 * Created by Daniel on 15/01/2017.
 */
import {MODALS, } from '../constants';
const initialState = {
    activeModal: 'NONE'
};

export default function modals(state = initialState, action) {
    switch (action.type) {
        case 'NODE_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.NODE_MODAL
            });
        case 'HIDE_MODAL' :
            return Object.assign({}, state, {
                activeModal: MODALS.NONE
            });
        default:
            return state;
    }
}