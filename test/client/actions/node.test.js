import 'isomorphic-fetch'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { expect } from 'chai';
import * as actions from '../../../app/actions/nodes';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Node actions', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('creates SET_NODE and ADD_NODE_SUCCESS action when form is submitted', () => {
    fetchMock.mock('/nodes', 'POST', {
      body: { user: 'This is the user information.',
              nodeInformation: 'This is the current Node information',
              indexList : [0],
              last : true,
              depth : 1
      }
    });

    const expectedActions = [
      { type: 'SET_NODE',
        node: 'This is the current Node information',
        indexList: [0],
        last: true,
        depth: 1
      },
      { type: 'ADD_NODE_SUCCESS',
        messages: 'The node was added successfully',
        user:  'This is the user information.'
      }];

    const store = mockStore({});

    return store.dispatch(actions.addNodeForm())
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('creates SET_NODE and DELETE_NODE_SUCCESS action when node is deleted', () => {
    fetchMock.mock('/nodes', 'DELETE', {
      body: {
        user: 'This is the user information.',
        nodeInformation: 'This is the current Node information',
        indexList : [0],
        last : true,
        depth : 1
      }
    });

    const expectedActions = [
      { type: 'SET_NODE',
        node: 'This is the current Node information',
        indexList: [0],
        last: true,
        depth: 1
      },
      { type: 'DELETE_NODE_SUCCESS',
        messages: 'The node was deleted successfully',
        user:  'This is the user information.'
      }];

    const store = mockStore({});

    return store.dispatch(actions.deleteNodeForm())
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions);
        });
  });

  it('creates SET_NODE and LEAVE_NODE_SUCCESS action when node is left by a collaborator', () => {
    fetchMock.mock('/nodes/leave', 'put', {
      body: {
        user: 'This is the user information.',
        nodeInformation: 'This is the current Node information',
        indexList : [0],
        last : true,
        depth : 1
      }
    });

    const expectedActions = [
      { type: 'SET_NODE',
        node: 'This is the current Node information',
        indexList: [0],
        last: true,
        depth: 1
      },
      { type: 'LEAVE_NODE_SUCCESS',
        messages: 'The node was left successfully',
        user:  'This is the user information.'
      }];

    const store = mockStore({});

    return store.dispatch(actions.leaveNodeForm())
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions);
        });
  });

  it('creates SET_NODE and SHARE_NODE_SUCCESS action when node is shared by the owner', () => {
    fetchMock.mock('/nodes/share', 'put', {});

    const expectedActions = [
      {
        type: 'SHARE_NODE_SUCCESS',
        messages: [{msg: "The node was shared successfully"}],
      }]

    const store = mockStore({});

    return store.dispatch(actions.shareNodeForm())
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions);
        });
  });

  it('creates ACCEPT_NODE_SUCCESS action when node is accepted by a collaborator', () => {
    fetchMock.mock('/nodes/accept', 'put', {
      body : {
        user : 'The new user Data'
      }
    });

    const expectedActions = [
      {
        type: 'ACCEPT_NODE_SUCCESS',
        messages: 'The node was deleted successfully',
        user: 'The new user Data',
      }];

    const store = mockStore({});

    return store.dispatch(actions.acceptInvitation())
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions);
        });
  });

});
