/**
 * Created by Daniel on 01/02/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

class Graph extends React.Component {


    componentDidMount() {
        this.createMindmap();
    }
    createMindmap() {
        if(this.props.user.mindmapOption === "sprawl") {
            this.mindmapOptionOne();
        }
        if(this.props.user.mindmapOption === "tiered") {
            this.mindmapOptionTwo();
        }
    }

    mindmapOptionOne() {
        var circleWidth = 30;

        var palette = {
            "lightgray" : '#819090',
            'tcBlack' : '#130COE',
        };

        //displayedNodes is used as the data that is being displayed.

        var displayedNodes = this.props.data;
        var width = this.props.width;
        var height = this.props.height;
        var circleWidth = 30;
        var myChart;

        var force = d3.layout.force();

        myChart = d3.select(this.refs.hook)
            .append('svg')
            .attr('width', width)
            .attr('height', height)


        console.log("Displayed Nodes");
        console.log(displayedNodes);
        var root = displayedNodes;
        root.fixed = true;
        root.x = width/2;
        root.y = width/4;

        var defs = myChart.insert("svg:defs")
            .data(["end"]);
        defs.enter().append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        console.log("Root");
        console.log(root);
        update();

        hideToDos(root);


        function update() {
            var nodes = flatten(root);
            console.log("NERDS");
            console.log(nodes);
            var links = d3.layout.tree().links(nodes);
            console.log("links");
            console.log(links);

            //Restart the force layout with the updated paths
            force.nodes(nodes)
                .links(links)
                .gravity(0.05)
                .charge(-1500)
                .linkDistance(100)
                .friction(0.5)
                .linkStrength(function(l, i) {return 1; })
                .size([width, height])
                .on("tick", tick)
                .start();

            var path = myChart.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });

            path.enter().insert("svg:path")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke-width", "2px")
                // .attr("marker-end", "url(#end)")
                .style("stroke", "#eee");


            // Exit any old paths.
            path.exit().remove();

            //Update the nodes....
            var node = myChart.selectAll("g.node")
                .data(nodes, function(d) { return d.id; });


            // Enter any new nodes.
            var nodeEnter = node.enter().append("svg:g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                .on("click", click)
                .call(force.drag);

            // Append a circle
            nodeEnter.append("svg:circle")
                .attr("r", function(d) { return circle_radius(d) })
                .style("fill", "#eee");

            var images = nodeEnter.append("svg:image")
                .attr("xlink:href",  function(d) { return d.img;})
                .attr("x", function(d) { return -25;})
                .attr("y", function(d) { return -25;})
                .attr("rx", 24)
                .attr("height", 50)
                .attr("width", 50)


            var nodeText = nodeEnter.append("text")
                .attr("x", 30)
                .attr("fill", palette.tcBlack)
                .attr("font-size", 18)
                .attr("font-Family", "Arial, Helvetica, sans-serif")
                .text(function(d) { return d.name; })

            ///////////

            // make the image grow a little on mouse over and add the text details on click
            var setEvents = images

                .on( 'mouseenter', function() {
                    // select element in current context
                    d3.select( this )
                        .transition()
                        .attr("x", function(d) { return -60;})
                        .attr("y", function(d) { return -60;})
                        .attr("height", 100)
                        .attr("width", 100);
                })
                // set back
                .on( 'mouseleave', function() {
                    d3.select( this )
                        .transition()
                        .attr("x", function(d) { return -25;})
                        .attr("y", function(d) { return -25;})
                        .attr("height", 50)
                        .attr("width", 50);
                });

            // Exit any old nodes.
            node.exit().remove();


            // Re-select for update.
            path = myChart.selectAll("path.link");
            node = myChart.selectAll("g.node");

            function tick() {


                path.attr("d", function(d) {

                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                    return   "M" + d.source.x + ","
                        + d.source.y
                        + "A" + dr + ","
                        + dr + " 0 0,1 "
                        + d.target.x + ","
                        + d.target.y;
                });
                node.attr("transform", nodeTransform);

            }
        }

        function nodeTransform(d) {
            d.x = Math.max(circleWidth, Math.min(width - (d.imgwidth/2 || 16), d.x));
            d.y = Math.max(circleWidth, Math.min(height - (d.imgheight/2 || 16), d.y));
            return "translate(" + d.x + "," + d.y +")";
        }
        function click(d) {
            if(d.children) {
                d._children = d.children;
                d.children = null;
            }
            else if(d._children) {
                d.children = d._children;
                d._children = null;
            }
            update();
        }

        function hideToDos(root) {
            console.log("Helxxxxxlo");
            var i =0;
            function recurseToDos(node) {
                click(node);
                if(node.children) {
                    console.log("Hello");
                    node.children.forEach(click)
                }
                else {
                    i++;
                }
            }
            root.children.forEach(recurseToDos);
        }
        function circle_radius(d) {
            if(d.children) {
                return d.children.length > 0 ? 10 : 5;
            }
            else if (d._children) {
                return d._children.length > 0 ? 10 : 5;
            }
        }

        function flatten(root) {
            console.log(root);
            var nodes = [];
            var i =0;
            function recurse(node) {
                if(node.children) {
                    node.children.forEach(recurse);
                }
                if(!node.id) {
                    node.id = ++i;
                }
                nodes.push(node)
            }
            recurse(root);
            return nodes;
        }
    }

    mindmapOptionTwo() {
        
    }



    render() {
        const {width, height} = this.props;
        const styles = {
            border : '1px solid #323232',
            backgroundColor: this.props.user.primaryColor,
            position: 'relative',
            overflow: 'auto',
            height: '100%',
        };
        return (
            <div style = {styles}>
                <div ref='hook' />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    }
};

export default connect(mapStateToProps)(Graph);