import 'isomorphic-fetch'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { expect } from 'chai';
import * as actions from '../../../app/actions/todos';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Node actions', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it('creates SET_NODE and DELETE_TODO_SUCCESS action when todo is removed', () => {
        fetchMock.mock('/todos', 'DELETE', {
            body: {
                user: 'This is the user information.',
                nodeInformation: 'This is the current Node information',
                indexList: [0],
                last: true,
                depth: 1,
            }
        });

        const expectedActions = [
            {
                type: 'CLEAR_MESSAGES'
            },
            {
                type: 'SET_NODE',
                node: 'This is the current Node information',
                indexList: undefined,
                depth: undefined,
            },
            {
                type: 'DELETE_TODO_SUCCESS',
                messages: [{msg : "ToDo Deleted"}],
                user: 'This is the user information.'
            }];

        const store = mockStore({});

        return store.dispatch(actions.removeToDo())
            .then(() => {
                expect(store.getActions()).to.deep.equal(expectedActions);
            });
    });
});