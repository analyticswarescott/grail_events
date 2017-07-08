import React from 'react';
import Datamaps from 'datamaps';
import {withRouter, Link} from 'react-router'


import * as d3 from 'd3'


const MAP_CLEARING_PROPS = [
	'height', 'scope', 'setProjection', 'width'
];

const propChangeRequiresMapClear = (oldProps, newProps) => {
	return MAP_CLEARING_PROPS.some((key) =>
		oldProps[key] !== newProps[key]
	);
};







class Timeline extends React.Component {


	doneDM(datamap, ref) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(e) {

        	console.log(" === click")

        });
    }





	static propTypes = {
		data: React.PropTypes.object,
		width: React.PropTypes.any
	};

	constructor(props) {
		super(props);
		//this.resizeMap = this.resizeMap.bind(this);

	}

	componentDidMount() {
		/*if (this.props.responsive) {
			window.addEventListener('resize', this.resizeMap);
		}*/
		this.drawTimeline();
	}

	componentWillReceiveProps(newProps) {
		/*if (propChangeRequiresMapClear(this.props, newProps)) {
			this.clear();
		}*/
	}

	componentDidUpdate() {
		this.drawTimeline();


	}

	componentWillUnmount() {
	/*	this.clear();
		if (this.props.responsive) {
			window.removeEventListener('resize', this.resizeMap);
		}*/
	}

	clear() {
		const { container } = this.refs;

		for (const child of Array.from(container.childNodes)) {
			container.removeChild(child);
		}

		//delete this.map;
	}

	drawTimeline() {
		const {
			data,
			...props
		} = this.props;


		console.log(" timeline data ------ ")


        var raw111 = data.dimensions['game_date'].filter("20170705");

		//var zz = data.dimensions['starting_time'].filterRange([1499310404000, 1499408881000]);

		var tables = data.dimensions['tableName'].group().top(Infinity);
		//get the raw data (filtered)
		console.log(data.dimensions['tableName'].top(Infinity))
		console.log(tables);

//now format the data

		var theData = [];

		tables.forEach( (d) => {

            var raw111;

            let values = ["error", "round"];
            raw111 = data.dimensions['event_type'].filterFunction(function (v) {
            	return values.indexOf(v) !== -1;
			})

            var records = data.dimensions['tableName'].filter(d.key).top(Infinity);
			theData.push( {label: d.key + "  ", times: records})
			data.dimensions['event_type'].filterAll();


         /*  raw111 = data.dimensions['event_type'].filter("round");
            records = data.dimensions['tableName'].filter(d.key).top(Infinity);
            theData.push( {label: d.key + " - Rounds ", times: records})
            data.dimensions['event_type'].filterAll();
*/

           values = ["boxpull", "tray"];
            raw111 = data.dimensions['event_type'].filterFunction(function (v) {
                return values.indexOf(v) !== -1;
            })



            records = data.dimensions['tableName'].filter(d.key).top(Infinity);
            theData.push( {label: d.key + " Pull-Tray ", times: records})
            data.dimensions['event_type'].filterAll();

		}  )


		console.log(theData)

        var testData = [
            {class: "pA", label: "person a", times: [
                {"starting_time": 1355752800000, "ending_time": 1355759900000},
                {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {class: "pB", label: "person b", times: [
                {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
            {class: "pC", label: "person c", times: [
                {"starting_time": 1355761910000, "ending_time": 1355763910000}]}
        ];


        var ttt = Object.assign({},  require("../helpers/timeline2"))

        var chart = ttt.timeline().stack();

        chart.tickFormat({
            format: function(d) { return d3.time.format("%H:%M")(d) },
            tickTime: d3.time.minutes,
            tickInterval: 15,
            tickSize: 15,
        });

        var svg = d3.select("#container").append("svg").attr("width", 3000).attr("height", 750)
            .datum(theData).call(chart);

		chart.hover (function (d, index, datum) {
            d3.select("#details").text(d.info)
		});

        var svg = d3.select("#container").append("text").attr("width", 1000).attr("height", 100)
			.attr("id", "details")
            .attr("y", 1210)
			.text("testy")




	}



	render() {

		return <div id="container" style={{paddingLeft: 10}} />;
	}

}

export default withRouter(Timeline)
