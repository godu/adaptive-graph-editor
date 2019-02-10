import * as React from 'react';
import { render, graphlib } from 'dagre-d3';
import { select, zoom, event } from 'd3'
import { ChapterRule, ExitNode, Slide } from './types'
import { exitNodes } from './data';

const toPairs = (obj: object) => Object.keys(obj).map(key => [key, obj[key]]);

type GraphProps = {
  chapterRule: ChapterRule,
  slides: Slide[],
  exitNodes: ExitNode[]
};

interface GraphState {
  graph: graphlib.Graph
}

export default class GraphComponent extends React.Component<GraphProps, GraphState> {
  graphRef: React.RefObject<SVGSVGElement>;
  constructor(props: GraphProps) {
    super(props);

    this.graphRef = React.createRef();
    this.state = {
      graph: new graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function () { return {}; })
    }
  }

  static getDerivedStateFromProps(props: GraphProps, state: GraphState) {
    const { slides, chapterRule, exitNodes } = props;

    let graph = new graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(function () { return {}; });

    graph.setNode('slide', { label: 'start', class: 'type-slide-start' });

    graph = slides.reduce((graph, slide) => {
      const { universalRef } = slide;
      graph.setNode('slide' + universalRef, { label: universalRef })
      return graph;
    }, graph);

    graph = chapterRule.rules.reduce((graph, rule) => {
      const { source, destination } = rule;
      graph.setEdge(source.type + source.ref, destination.type + destination.ref);
      return graph;
    }, graph);

    graph = exitNodes.reduce((graph, exitNode) => {
      const { ref, type } = exitNode;
      graph.setNode('exitNode' + ref, {
        label: ref,
        class: type === 'success' ? 'type-exitNode-success' : 'type-exitNode-failure'
      });
      return graph;
    }, graph);

    graph.nodes().forEach(function (v) {
      var node = graph.node(v);
      node.rx = node.ry = 5;
    });

    GraphComponent.detectErrors(
      graph,
      'slide',
      exitNodes.map(({ ref }) => 'exitNode' + ref)
    );

    return { graph }
  }

  static detectErrors(graph: graphlib.Graph, start: string, ends: string[]) {
    const dijkstra = graphlib.alg.dijkstra(graph, "slide", () => 1);

    const unattainableNodes = toPairs(dijkstra)
      .filter(([, { distance }]) => distance === Infinity)
      .map(([node]) => node);
    unattainableNodes.forEach(node => {
      console.warn('Unattainable node', node);
    });

    const cycles = graphlib.alg.findCycles(graph)
    cycles.forEach(cycle => {
      console.warn('Detected cycle', cycle);
    });

    const loop = (start: string, nodes: string[], alreadyVisited: string[] = []): string[] => {
      const [head, ...tail] = nodes;

      if (!head) return graph.nodes().filter(node => !alreadyVisited.includes(node))

      if (alreadyVisited.includes(head))
        return loop(start, tail, alreadyVisited);

      const parents = graph.predecessors(head);
      return loop(
        start,
        [...tail, ...parents],
        [...alreadyVisited, head]
      );
    }
    const sinkNodes = loop('slide', ends);
    sinkNodes.forEach(node => {
      console.warn('Sink node', node);
    });
  }

  componentDidMount() {
    GraphComponent.renderGraph(this.graphRef, this.state);

    const svg = select(this.graphRef.current);
    const svgGroup = svg.select("g");
    const zoomBehavior = zoom()
      .on("zoom", function () {
        svgGroup.attr("transform", event.transform);
      });
    svg.call(zoomBehavior);
  }
  componentDidUpdate() {
    GraphComponent.renderGraph(this.graphRef, this.state);
  }

  static renderGraph(graphRef: React.RefObject<SVGSVGElement>, state: GraphState) {
    const { graph } = state;

    var r = new render();
    const svg = select(graphRef.current);
    const svgGroup = svg.append("g");

    r(select("svg g"), graph);

    const graphWidth = Math.max(graph.graph().width, 0);
    const graphHeight = Math.max(graph.graph().height, 0);

    svg.attr("width", '100%')
      .attr("height", '100%')
      .attr('viewBox', '0 0 ' + graphWidth + ' ' + graphHeight)
      .attr('preserveAspectRatio', 'xMinYMin')
      .append("g")
      .attr("transform", "translate(" + graphWidth / 2 + "," + graphHeight / 2 + ")");
  }

  render() {
    return (
      <>
        <style>
          {`
          g.node > rect {
            fill: #999;
            fill-opacity: 0.5;
          }
          g.node.type-exitNode-success > rect {
            fill: #3EC483;
          }
          g.node.type-exitNode-failure > rect {
            fill: #F73F52;
          }
          g.node.type-slide-start > rect {
            fill: yellow;
          }

          // text {
          //   font-weight: 300;
          //   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          //   font-size: 14px;
          // }

          // .node rect {
          //   stroke: #999;
          //   fill: #BBB;
          //   stroke-width: 1.5px;
          // }

          .edgePath path {
            stroke: #333;
            stroke-width: 1.5px;
          }
          `}
        </style>
        <svg ref={this.graphRef} />
      </>
    )
  }
}