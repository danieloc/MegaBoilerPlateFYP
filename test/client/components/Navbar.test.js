/**
 * Created by Daniel on 3/29/2017.
 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import {NavBar} from '../../../app/components/NavBar';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const propsForOwnedNode = {
    user: {
        "_id": "58da8b3f7a623539ac6cf7d6",
        "name": "Daniel O'Connor",
        "email": "daniel.o.c.03@gmail.com",
        "primaryColor": "#2196f3",
        "picture": "https://graph.facebook.com/1048325875222155/picture?type=large",
    },
    node : {"_id":"58da8b547a623539ac6cf7d7",
        "name":"Node",
        "owner" : {
            "email" : "daniel.o.c.03@gmail.com",
        },
        "nodes":[],
        "collaborators" : []
    },
    indexList: [0,0],
    depth : 2,
    nodes : [{"_id":"58da8b547a623539ac6cf7d7",
            "name":"Node",
            "owner" : {
                "email" : "daniel.o.c.03@gmail.com",
            },
            "nodes":[],
            "collaborators" : []
    }]
};

const propsForUnownedNode = {
    user: {
        "_id": "58da8b3f7a623539ac6cf7d6",
        "name": "Daniel O'Connor",
        "email": "daniel.o.c.03@gmail.com",
        "primaryColor": "#2196f3",
        "picture": "https://graph.facebook.com/1048325875222155/picture?type=large",
    },
    node : {"_id":"58da8b547a623539ac6cf7d7",
        "name":"Node",
        "owner" : {
            "email" : "superCoolFriend@gmail.com",
        },
        "nodes":[],
        "collaborators" : []
    },
    indexList: [0,0],
    depth : 2,
    nodes : [{"_id":"58da8b547a623539ac6cf7d7",
        "name":"Node",
        "owner" : {
            "email" : "superCoolFriend@gmail.com",
        },
        "nodes":[],
        "collaborators" : []
    }]
};

describe('Navbar component for owned node', () => {
    const component = shallow(<NavBar {...propsForOwnedNode}/>).shallow();

    it('Ensure that the Header Component has rendered', () => {
        expect(component.exists()).to.equal(true);
    });
    //One link for node, one for adding nodes
    it('Ensure that there is the correct amount of links.', () => {
        expect(component.find('li')).to.have.length(2);
    });
});


describe('Navbar component for unowned node', () => {
    const component = shallow(<NavBar {...propsForUnownedNode}/>).shallow();

    it('Ensure that the Header Component has rendered', () => {
        expect(component.exists()).to.equal(true);
    });
    //One link for node, nome for adding nodes
    it('Ensure that there is the correct amount of links.', () => {
        expect(component.find('li')).to.have.length(1);
    });
});