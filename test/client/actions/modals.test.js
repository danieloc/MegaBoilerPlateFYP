/**
 * Created by Daniel on 3/29/2017.
 */
import 'isomorphic-fetch'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { expect } from 'chai';
import * as actions from '../../../app/actions/modals';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Modal actions', () => {
    afterEach(() => {
        fetchMock.restore();
    });
    it('creates WALK_THROUGH_FINISHED action when walkthrough is finished', () => {
        fetchMock.mock('/account/walkthrough', 'PUT', {
            body: {
                user: 'The user with a finished walkthrough boolean',
            }
        });

        const expectedActions = [
            {
                type: 'WALK_THROUGH_FINISHED',
                user: 'The user with a finished walkthrough boolean',
            }];

        const store = mockStore({});

        return store.dispatch(actions.walkThroughFinished())
            .then(() => {
                expect(store.getActions()).to.deep.equal(expectedActions);
            });
    });
});