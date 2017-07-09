import React, { Component, PropTypes } from 'react'
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






	constructor(props) {
		super(props);

        this.state = {}
		//this.resizeMap = this.resizeMap.bind(this);

	}

	componentDidMount() {
		/*if (this.props.responsive) {
			window.addEventListener('resize', this.resizeMap);
		}*/
		this.drawTimeline();
	}

	componentWillReceiveProps(newProps) {

		console.log(" Timeline JSX gets props")

       // console.log(newProps)

        const { data, game_date } = newProps

        this.setState({
            ...this.state,
            data,
            game_date
        })

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
			game_date,
			...props
		} = this.props;



        console.log("timeline PROPS: === ")
		console.log(this.props)
        console.log(this.state)

		var gd = game_date;
		if (!gd) {
			gd = '20170701'
		}

		console.log(" timeline data ------ " + gd)
		if (this.state) {
            console.log(" timeline state ------ " + this.state.game_date)
        }

        var raw111 = data.dimensions['game_date'].filter(gd);

		//data.dimensions['starting_time'].filterRange([1499249714501, 1499252714501])


		//var zz = data.dimensions['starting_time'].filterRange([1499310404000, 1499408881000]);

		var tables = data.dimensions['tableName'].group().top(Infinity);
		//get the raw data (filtered)
		//console.log(data.dimensions['tableName'].top(Infinity))
		//console.log(tables);

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


		//console.log(theData)

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


        d3.select("#container").selectAll("*").remove();
        d3.select("#labels").selectAll("*").remove();
        d3.select("#details").selectAll("*").remove();

        var svg = d3.select("#container")
			//.append("svg") .attr("width", 800).attr("height", 700)
            //.attr("overflow", "scroll")

			.append("svg").attr("width", 5000).attr("height", 700)
            //.attr("viewBox", "0,0,1200,700")
			//.style("overflow", "scroll")
			//.attr("overflow", "scroll")
            .datum(theData).call(chart);


        var clickLock;
		chart.hover (function (d, index, datum) {
            d3.select("#hover").html( getText(d))
		}).click(function (d, index, datum) {
            d3.select("#details").html( getText(d) )
        })


		function getText(d) {
           var ret =  d.info + " <br> Start Time: " + new Date(d.starting_time/1).toLocaleString() + " <br> End " +
            "Time: "  + new Date(d.ending_time/1).toLocaleString()

			return ret;
		}


     /*   var display = d3.select("#details").append("text").attr("width", 500).attr("height", 100)
			.attr("id", "details")
            .attr("y", 1210)*/





	}



	render() {

		return <div  >
			<div id="labels" class="labels"

			style={ {top: 58,
                left: 262,
                position: 'absolute',
			  backgroundColor: 'white',
                opacity:1}}

			></div>


			<div id="hover" class="hover"

							style={ {top: 760,
                                left: 260,
                                position: 'absolute',
                                backgroundColor: '#fffff',
                                opacity:1}}

		></div>

			<div id="details" class="details"

				 style={ {top: 760,
                     left: 760,
                     position: 'absolute',
                     backgroundColor: '#fffff',
                     opacity:1}}

			></div>

			<div id="container" style={
                {paddingLeft: 10,
                    overflowY: 'scroll'
                }
            } ></div>


		</div>;
	}

}



Timeline.propTypes = {
    data: React.PropTypes.object,
    width: React.PropTypes.any,
    game_date: PropTypes.string
}

export default withRouter(Timeline)
