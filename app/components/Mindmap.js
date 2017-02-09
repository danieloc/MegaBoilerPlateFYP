/**
 * Created by Daniel on 12/30/2016.
 */
import React from 'react';
import { connect } from 'react-redux';
import Graph from './Graph';
import _ from 'lodash';

class Mindmap extends React.Component {

    constructor(props) {
        super(props);
        var newData = [{
            "name": this.props.user.name
        }];
        for (var i = 0; i < this.props.user.nodes.length; i++) {
            var nodeData = {
                'name': this.props.user.nodes[i].name,
                'target' : [0],
                'subDocs': [{
                    'name': this.props.user.nodes[i].name
                }]};
            for (var t = 0; t < this.props.user.nodes[i].subnodes.length; t++) {
                var subNodes = {
                    'name' : this.props.user.nodes[i].subnodes[t].name,
                    'target': [0],
                };
                nodeData.subDocs = _.concat(nodeData.subDocs, subNodes);
            }
            newData =_.concat(newData, nodeData);
        }
        this.state = {
            data : newData,
        }
        console.log(this.props.width);
        console.log(this.props.height);
    }
    render() {
        return (
            <div style = {{flex: 1,  position:'relative', height: '100%', margin: 0, display: 'flex', flexDirection: 'column',
                backgroundColor: '#1a1aff'}}>
                <Graph width = {this.props.width} height = {this.props.height} flex = {1} data = {this.state.data} style = {{flex:1}}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        width: state.viewPort.width,
        height: state.viewPort.height,
    }
};

export default connect(mapStateToProps)(Mindmap);
