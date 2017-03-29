/**
 * Created by Daniel on 3/29/2017.
 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow , mount} from 'enzyme';
import { expect } from 'chai';

import {Collaborators} from '../../../app/components/Collaborators';

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

const collaborators = {
    collaboratorList : [{
        "email" : "myGoodFriend@gmail.com",
        "name" : "Peter Dinklage",
        "picture" : "https://graph.facebook.com/1048325875222155/picture?type=large"
    }]
};

describe('Collaborator component', () => {
    const component = shallow(<Collaborators {...props} {...nodeWithCollabs} {...collaborators}/>).shallow();

    it('Ensure that the component Collaborators has rendered', () => {
        expect(component.exists()).to.equal(true);
    });

    it('Ensure that the correct amount of collaborators are shown.', () => {
        expect(component.find('.col-sm-1')).to.have.length(1);
    });
});
