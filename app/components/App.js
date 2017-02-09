import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Modal from './Modals/Modal';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        {this.props.children}
        <Modal/>
        <Footer/>
      </div>
    );
  }
}

export default App;
