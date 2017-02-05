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
            console.log('In here now');
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
        console.log(newData)
        this.state = {
            data : newData,
        }
    }

    render() {
        return (
            <div>
                <Graph width = {1350} height = {550} data = {this.state.data}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    }
};

export default connect(mapStateToProps)(Mindmap);
