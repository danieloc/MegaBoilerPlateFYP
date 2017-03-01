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
        var data = [{
            "name": this.props.user.name,
            "img" : this.props.user.picture
        }];
        if(this.props.user.nodes.length > 0) {
            var nodeData = getData(this.props.user.nodes);
            data = _.concat(data, nodeData);
        }
        this.state = {
            data : data,
        };

        function getData(nodes) {
            var nodeData = null;
            nodes.forEach(function (node) {
                var singleNodeData = {
                    'name': node.name,
                    'target': [0],
                };
                if (node.nodes && node.nodes.length > 0) {
                    singleNodeData = {
                        'name': node.name,
                        'target': [0],
                        'subDocs': [{'name': node.name}]
                    };
                    var subNodes = getData(node.nodes);
                    singleNodeData.subDocs = _.concat(singleNodeData, subNodes);
                }
                if(nodeData === null) {
                    nodeData = singleNodeData;
                }
                else {
                    nodeData = _.concat(nodeData, singleNodeData);
                }
            });
            return nodeData;
        }
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
