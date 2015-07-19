'use strict';

/**
 * @ngdoc directive
 * @name monteCarloApp.directive:histogram
 * @description
 * # histogram
 */
angular.module('networkAnalyzerApp')
    .directive('network', function () {
        return {
            restrict: 'EA',

            scope:    {
                highlighted:   '=',
                links: '=',
                profiles: '=',
                shownames: '='
            },

            link: function postLink(scope) {
                var width = 960;
                var height = 500;
                var link;
                var node;

                scope.$watch('highlighted', function(newVal) {
                    if (scope.profiles && scope.profiles.length > 0) {
                        if (newVal.action === 1) {
                            if (node) {
                                node.remove();
                                link.remove();
                                force.stop();
                                force.nodes([]).links([]);
                            }
                            initNetwork(scope.links, scope.profiles);
                        } else {
                            updateNetwork(scope.profiles);
                        }
                    }
                });

                var svg = d3.select('#network').append('svg')
                    .attr('width', width)
                    .attr('height', height);

                var force = d3.layout.force()
                    .size([width, height])
                    .charge(-400)
                    .linkDistance(70);

                var drag = force.drag()
                    .on("dragstart", dragstart);

                function updateNetwork(nodes) {
                    node = svg.selectAll('.node')
                        .data(nodes)
                        .attr("class", function(d) {
                            var c = '';
                            //if (d.fixed) c += 'fixed ';
                            if (d.me) {
                                c += "node me";
                            } else if (d.highlight) {
                                c += "node highlight";
                            } else {
                                c += "node";
                            }
                            return c;
                        })
                        .on("dblclick", dblclick)
                        .call(drag);
                }


                function initNetwork(links, nodes) {
                    force.nodes(nodes)
                        .links(links)
                        .on("tick", tick);

                    link = svg.selectAll('.link')
                        .data(links)
                        .enter().append('line')
                        .attr('class', 'link');

                    node = svg.selectAll('.node')
                        .data(nodes)
                        .enter().append('g')
                        .attr("class", function(d) {
                            var c = '';
                            if (d.fixed) c += 'fixed ';
                            if (d.me) {
                                c += "node me";
                            } else if (d.highlight) {
                                c += "node highlight";
                            } else {
                                c += "node";
                            }
                            return c;
                        })
                        .on("dblclick", dblclick)
                        .call(drag);

                    node.append("circle").attr("r", 6);

                    if (scope.shownames) {
                        node.append("text")
                            .attr("x", 8)
                            .attr("y", ".31em")
                            .attr("class","label-txt")
                            .text(function(d) { return d.full_name; });
                    } else {
                        node.append("title").text(function(d) { return d.full_name; });
                    }
                    force.start();
                }

                function tick() {
                    link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                }

                function dblclick(d) {
                    d3.select(this).classed("fixed", d.fixed = false);
                }

                function dragstart(d) {
                    d3.select(this).classed("fixed", d.fixed = true);
                }

            }
        };
    });
