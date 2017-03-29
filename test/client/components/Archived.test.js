/**
 * Created by Daniel on 3/29/2017.
 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { assert } from 'chai';

import {Archived} from '../../../app/components/Archived';
import {SingleArchivedToDo} from '../../../app/components/SingleArchivedToDo';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const propsWithArchivedToDos = {
    user :  {"_id":"58da8b3f7a623539ac6cf7d6",
        "name":"Daniel O'Connor",
        "email":"daniel.o.c.03@gmail.com",
        "primaryColor":"#2196f3",
        "nodes":[{"_id":"58da8b547a623539ac6cf7d7",
            "name":"Node",
            "__v":1,
            "nodes":[],
            "todos":[{
                "_id": "58dacadbf72ac312bc00dca6",
                "name": "Head",
                "priority": "Low",
                "completed": true,
            }],
    }]
    }
};

const propsWithoutArchivedToDos = {
    user :  {"_id":"58da8b3f7a623539ac6cf7d6",
        "name":"Daniel O'Connor",
        "email":"daniel.o.c.03@gmail.com",
        "primaryColor":"#2196f3",
        "nodes":[{"_id":"58da8b547a623539ac6cf7d7",
            "name":"Node",
            "__v":1,
            "nodes":[],
            "todos":[{
                "_id": "58dacadbf72ac312bc00dca6",
                "name": "Head",
                "priority": "Low",
                "completed": false,
            }],
        }]
    }
};

describe('Archived component', () => {
    const componentWithToDos = shallow(<Archived {...propsWithArchivedToDos}/>).shallow();
    const componentWithoutToDos = shallow(<Archived {...propsWithoutArchivedToDos}/>).shallow();

    it('Without ToDos - Tell user that they do not have archived todos', () => {
        expect(componentWithoutToDos.find('.archivedBack').exists()).to.equal(true);
    });

    it('With ToDos - do not tell user they have no todos', () => {
        expect(componentWithToDos.find('.archivedBack').exists()).to.equal(false);
    });

    it('Check that enters DOM for ArchivedToDo', () => {
    });
});
