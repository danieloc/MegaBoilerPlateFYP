/**
 * Created by Daniel on 3/29/2017.
 */
/**
 * Created by Daniel on 3/29/2017.
 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import {Nodes} from '../../../app/components/Nodes';
import {NavBar} from '../../../app/components/NavBar';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const props = {
    user: {
        "_id": "58da8b3f7a623539ac6cf7d6",
        "name": "Daniel O'Connor",
        "email": "daniel.o.c.03@gmail.com",
        "primaryColor": "#2196f3",
        "picture": "https://graph.facebook.com/1048325875222155/picture?type=large",
        "nodes": [{
            "_id": "58da8b547a623539ac6cf7d7",
            "name": "Node",
            "__v": 1,
            "nodes": [],
            "todos": [{
                "_id": "58dacadbf72ac312bc00dca6",
                "name": "Head",
                "priority": "Low",
                "completed": true,
            }],
        }]
    },
    indexList : [0],
    depth: 1,
};
const nodeWithCollabs = {
    node : {"_id":"58da8b547a623539ac6cf7d7",
        "name":"Node",
        "owner" : {
            "email" : "myGoodFriend@gmail.com",
            "name" : "Peter Dinklage",
            "picture" : "https://graph.facebook.com/1048325875222155/picture?type=large"
        },
        "nodes":[],
        "collaborators" : [{
            "_id" : "1234",
            "accepted" : true,
            "picture" : "https://gravatar.com/avatar/254a5acaee4728118528cd09424a44d8?s=200&d=retro",
            "email" : "abcd@abcd.com",
            "name" : "abcd"
        }]
    }
};
const nodeWithoutCollabs = {
    node : {"_id":"58da8b547a623539ac6cf7d7",
        "name":"Node",
        "owner" : {
            "email" : "daniel.o.c.03@gmail.com",
            "name" : "Daniel O'Connor",
            "picture" : "https://graph.facebook.com/1048325875222155/picture?type=large"
        },
        "nodes":[],
        "collaborators" : []
    }
};

describe('Nodes component with Collaborator', () => {
    const component = shallow(<Nodes {...props} {...nodeWithCollabs} />).shallow();

    it('Ensure that the component Nodes has rendered', () => {
        expect(component.exists()).to.equal(true);
    });

    it('Ensure that leave button is available.', () => {
        expect(component.find('.btn-danger').text()).to.equal('Leave Node');
    });
});

describe('Nodes component with no Collaborators', () => {
    const component = shallow(<Nodes {...props} {...nodeWithoutCollabs} />).shallow();

    it('Ensure that the component Nodes has rendered', () => {
        expect(component.exists()).to.equal(true);
    });

    it('Ensure that the Delete button and the share button are available.', () => {
        expect(component.find('.btn-danger').text()).to.equal('Delete Node');
        expect(component.find('.btn-primary').text()).to.equal('Share Node');
    });
});
