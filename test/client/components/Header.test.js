/**
 * Created by Daniel on 3/29/2017.
 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import {Header} from '../../../app/components/Header';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const user = {
    user: {
        "_id": "58da8b3f7a623539ac6cf7d6",
        "name": "Daniel O'Connor",
        "email": "daniel.o.c.03@gmail.com",
        "primaryColor": "#2196f3",
        "picture": "https://graph.facebook.com/1048325875222155/picture?type=large",
    },
};
const token = {
    token : 'abc123'
};

describe('Header component with a token', () => {
    const component = shallow(<Header {...user} {...token}/>).shallow();

    it('Ensure that the Header Component has rendered', () => {
        expect(component.exists()).to.equal(true);
    });

    it('Ensure that the three links for archived, mindmap and nodes exist.', () => {
        expect(component.find('li.archived')).to.have.length(1);
        expect(component.find('li.mindmap')).to.have.length(1);
        expect(component.find('li.nodes')).to.have.length(1);
    });
});
describe('Header component without a token', () => {
    const component = shallow(<Header {...user}/>).shallow();

    it('Ensure that the Header Component has rendered', () => {
        expect(component.exists()).to.equal(true);
    });

    it('Ensure that the three links for archived, mindmap and nodes exist.', () => {
        expect(component.find('li.archived')).to.have.length(0);
        expect(component.find('li.mindmap')).to.have.length(0);
        expect(component.find('li.nodes')).to.have.length(0);
    });
});
