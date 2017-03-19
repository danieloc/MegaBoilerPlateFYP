/**
 * Created by Daniel on 01/02/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import _ from 'lodash';

class Graph extends React.Component {
    constructor(props) {
        super(props);
        var data = this.props.getGraphData();
        this.state = {
            sideBar: false,
            data: data
        };
        this.mindmapOptionOne = this.mindmapOptionOne.bind(this);
    }
    componentDidUpdate() {
        var tempData = this.props.getGraphData();
        if(!_.isEqual(this.state.data, tempData)) {
            this.setState({
                data: tempData
            });
            d3.select('svg').remove();
            this.createMindmap();
        }
    }

    componentDidMount() {
        this.createMindmap();
    }
    createMindmap() {
        if (this.props.user.mindmapOption === "sprawl") {
            this.mindmapOptionOne();
        }
        if (this.props.user.mindmapOption === "tiered") {
            this.mindmapOptionTwo();
        }
    }

    mindmapOptionOne() {
        var palette = {
            "lightgray": '#819090',
            'tcBlack': '#130COE',
        };

        //displayedNodes is used as the data that is being displayed.

        var displayedNodes = this.props.data;
        var mindmapToSideBarRatio = 1;
        if(this.props.sideBar)
            mindmapToSideBarRatio = 0.75;
        var width = this.props.width*mindmapToSideBarRatio;
        var height = this.props.height;
        var circleWidth = 30;

        var force = d3.layout.force();
            var myChart = d3.select(this.refs.hook)
                .append('svg')
                .attr('width', width)
                .attr('height', height)

        d3.select(window).on("resize", resize.bind(this));
        function resize() {
            console.log("Wubalubadubdub");
            mindmapToSideBarRatio = 1;
            if(this.props.sideBar)
                mindmapToSideBarRatio = 0.75;
            width = this.props.width*mindmapToSideBarRatio;
            height = this.props.height;
            myChart.attr("width", width).attr("height", height);
            force.size([width, height]).resume();
        }
        var root = displayedNodes;
        root.fixed = true;
        root.x = width / 2;
        root.y = width / 4;

        var defs = myChart.insert("svg:defs")
            .data(["end"]);
        defs.enter().append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        update();

        hideToDos(root);


        function update() {
            var nodes = flatten(root);
            var links = d3.layout.tree().links(nodes);

            //Restart the force layout with the updated paths
            force.nodes(nodes)
                .links(links)
                .gravity(0.05)
                .charge(-1500)
                .linkDistance(100)
                .friction(0.5)
                .linkStrength(function (l, i) {
                    return 1;
                })
                .size([width, height])
                .on("tick", tick)
                .start();

            var path = myChart.selectAll("path.link")
                .data(links, function (d) {
                    return d.target.id;
                });

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
                .data(nodes, function (d) {
                    return d.id;
                });


            // Enter any new nodes.
            var nodeEnter = node.enter().append("svg:g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .on("click", click)
                .call(force.drag);

            // Append a circle
            nodeEnter.append("svg:circle")
                .attr("r", function (d) {
                    return circle_radius(d)
                })
                .style("fill", "#eee");

            nodeEnter.append("svg:image")
                .attr("xlink:href", function (d) {
                    return d.img;
                })
                .attr("x", function (d) {
                    return -25;
                })
                .attr("y", function (d) {
                    return -25;
                })
                .attr("rx", 24)
                .attr("height", 50)
                .attr("width", 50)


            var nodeText = nodeEnter.append("text")
                .attr("x", 30)
                .attr("fill", palette.tcBlack)
                .attr("font-size", 18)
                .attr("font-Family", "Arial, Helvetica, sans-serif")
                .text(function (d) {
                    return d.name;
                })

            ///////////

            // Exit any old nodes.
            node.exit().remove();


            // Re-select for update.
            path = myChart.selectAll("path.link");
            node = myChart.selectAll("g.node");

            function tick() {


                path.attr("d", function (d) {

                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                    return "M" + d.source.x + ","
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
            d.x = Math.max(circleWidth, Math.min(width - (d.imgwidth / 2 || 16), d.x));
            d.y = Math.max(circleWidth, Math.min(height - (d.imgheight / 2 || 16), d.y));
            return "translate(" + d.x + "," + d.y + ")";
        }

        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
            else if (d._children) {
                d.children = d._children;
                d._children = null;
            }
            update();
        }

        function hideToDos(root) {
            console.log("Helxxxxxlo");
            var i = 0;

            function recurseToDos(node) {
                click(node);
                if (node.children) {
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
            if (d.children) {
                return d.children.length > 0 ? 10 : 5;
            }
            else if (d._children) {
                return d._children.length > 0 ? 10 : 5;
            }
        }

        function flatten(root) {
            var nodes = [];
            var i = 0;

            function recurse(node) {
                if (node.children) {
                    node.children.forEach(recurse);
                }
                if (!node.id) {
                    node.id = ++i;
                }
                nodes.push(node)
            }

            recurse(root);
            return nodes;
        }
    }

    mindmapOptionTwo() {

        var circleWidth = 30;
        var isInner = false;
        var palette = {
            'black': '#323232',
            "white": "#fefefe",
        };

        //displayedNodes is used as the data that is being displayed.

        var displayedNodes = this.props.data;
        var width = this.props.width;
        var height = this.props.height;
        calculateEverything(this, this.props.data, displayedNodes, isInner, palette);

        function calculateEverything(Obj, nodes, displayedNodes, isInner, palette) {

            var links = [];
            console.log('Going to Calculate everything!!');
            var w = Obj.props.width,
                h = Obj.props.height;
            var gravity = 0.02;
            if(displayedNodes.length > 2) {
                gravity = displayedNodes.length/100;
            }


            //For every dataset,
            for (var i = 0; i < displayedNodes.length; i++) {
                //If the datahas a "target" value
                if (displayedNodes[i].target !== undefined) {
                    //Push it onto the links
                    for (var x = 0; x < displayedNodes[i].target.length; x++) {
                        links.push({
                            source: displayedNodes[i],
                            target: displayedNodes[displayedNodes[i].target[x]]
                        })
                    }
                }
            }

            //Append the svg image to the d3 element.
            var myChart = d3.select(Obj.refs.hook)
                .append('svg')
                .attr('width', w)
                .attr('height', h)
            //Apply d3 force
            var force = d3.layout.force()
                .nodes(displayedNodes)
                .links([])
                .gravity(gravity)
                .charge(-2000)
                .size([w, h]);

            var defs = myChart.insert("svg:defs")
                .data(["end"]);
            defs.enter().append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");


            //Add visable lines to the data links
            var link = myChart.selectAll('line')
                .data(links).enter().append('line')
                .attr('stroke', palette.white);


            var node = myChart.selectAll('circle')
                .data(displayedNodes).enter()
                .append('g')
                .call(force.drag)
                .on('dblclick', function () {
                    var nodeName = d3.select(this).text();
                    if ( isInner === false) {
                        var nodeFound = false;
                        for (i = 0; i <= displayedNodes.length && nodeFound === false; i++) {
                            if (displayedNodes[i].name === nodeName) {
                                nodeFound = true;
                                console.log(displayedNodes);
                                displayedNodes = displayedNodes[i].subDocs.valueOf();
                                myChart.remove();
                                while (links.length > 0) {
                                    links.pop();
                                }
                                d3.select('svg').remove();
                                isInner = true;
                                calculateEverything(Obj, nodes, displayedNodes, isInner, palette);
                            }
                        }
                    }
                    else {
                        if (nodeName === displayedNodes[0].name) {
                            displayedNodes = nodes.valueOf();
                            myChart.remove();
                            while (links.length > 0) {
                                links.pop();
                            }
                            d3.select('svg').remove();
                            isInner = false;
                            calculateEverything(Obj, nodes, displayedNodes, isInner, palette);
                        }
                    }

                })
                .on("mouseover", function (d, i) {
                    if (i > 0) {
                        //CIRCLE
                        d3.select(this).selectAll("circle")
                            .transition()
                            .duration(250)
                            .attr("r", circleWidth + 3)
                    }
                })

                //MOUSEOUT
                .on("mouseout", function (d, i) {
                    if (i > 0) {
                        //CIRCLE
                        d3.select(this).selectAll("circle")
                            .transition()
                            .duration(250)
                            .attr("r", circleWidth)

                    }
                });

            force.linkDistance(w / 2);


            node.append('circle')
                .attr('r', circleWidth)
                .attr('stroke', function (d, i) {
                    if (i > 0) {
                        return palette.black
                    } else {
                        return "transparent"
                    }
                })
                .attr('stroke-width', 2)
                .attr('fill', function (d, i) {
                    if (i > 0) {
                        return palette.white
                    } else {
                        return "transparent"
                    }
                })

            node.append("svg:image")
                .attr("xlink:href", function (d) {
                    return d.img;
                })
                .attr("x", function (d) {
                    return -25;
                })
                .attr("y", function (d) {
                    return -25;
                })
                .attr("rx", 24)
                .attr("height", 50)
                .attr("width", 50)

            node.append('text')
                .text(function (d) {
                    if(!d.img)
                        return d.name
                })
                .attr('font-family', 'Roboto Slab')
                .attr('fill',palette.white)
                .attr("font-size", 18)
                .attr("font-Family", "Arial, Helvetica, sans-serif")
                .attr('x', function (d, i) {
                    if (i > 0) {
                        return circleWidth + 20
                    } else {
                        return circleWidth - 15
                    }
                })
                .attr('y', function (d, i) {
                    if (i > 0) {
                        return circleWidth
                    } else {
                        return 8
                    }
                })
                .attr('text-anchor', function (d, i) {
                    if (i > 0) {
                        return 'beginning'
                    } else {
                        return 'end'
                    }
                })
                .attr('font-size', function (d, i) {
                    if (i > 0) {
                        return '2em'
                    } else {
                        return '3.4em'
                    }
                })

            force.on('tick', function (e) {
                displayedNodes[0].x = w / 2;
                displayedNodes[0].y = h / 2;
                node.attr('transform', function (d, i) {
                    return 'translate(' + d.x + ', ' + d.y + ')';
                })

                link
                    .attr('x1', function (d) {
                        return d.source.x
                    })
                    .attr('y1', function (d) {
                        return d.source.y
                    })
                    .attr('x2', function (d) {
                        return d.target.x
                    })
                    .attr('y2', function (d) {
                        return d.target.y
                    })
            })

            force.start();
        }
    }


    render() {
        const {width, height} = this.props;
        const styles = {
            border: '1px solid #323232',
            backgroundColor: this.props.user.primaryColor,
            position: 'relative',
            height: '100%',
        };
        return (
            <div style={styles}>
                <div ref='hook'/>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        width: state.viewPort.width,
        height: state.viewPort.height,
        sideBar: state.viewPort.sideBar
    }
};

export default connect(mapStateToProps)(Graph);