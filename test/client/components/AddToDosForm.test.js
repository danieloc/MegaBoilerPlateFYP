import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { assert } from 'chai';

import {AddToDosForm} from '../../../app/components/AddToDosForm';
import Messages from '../../../app/components/Messages';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const props = {
  nodeID: '1234',
  nodeName: 'NODENAME',
  messages: {error: [{msg : 'Message'}]},
  user : {email:'123@123.com'},
};

describe('AddToDosForm component', () => {
  const component = shallow(<AddToDosForm {...props}/>).shallow();

  it('contains One Legend', () => {
    expect(component.find('legend')).to.have.length(1);
  });

  it('Contains correct legend text', () => {
    expect(component.contains(<legend>NODENAME</legend>)).to.equal(true);
    expect(component.containsAllMatchingElements([<div data-foo="foo">Hello</div>])).to.equal(false);
  });

  it('Check that the error message is present', () => {
    expect(component.find(Messages).dive().find('.alert-danger')).to.have.length(1);
  });

  it('Check that the error message has the correct text present', () => {
    expect(component.find(Messages).dive().find('.alert-danger').containsAllMatchingElements([<div>Message</div>])).to.equal(true);
  });
});
