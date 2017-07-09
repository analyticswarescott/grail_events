import React, { Component, PropTypes } from 'react'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Select from '../components/Select'
import ChartWidget from '../components/ChartWidget'
import MapWidget from '../components/MapWidget'

import Timeline from '../components/timeline'


import {groupReducer, chartReducer} from '../helpers/comparison'
import { withRouter } from 'react-router'
import {lightBlueA400, lightGreenA400, deepOrangeA400} from 'material-ui/styles/colors'



const groupAll = 'All'
const defaultDimension = 'game_date'
const defaultValue1 = { measure: 'occurs', group : 'game_date', options: [], filter: '20170701' }
const defaultValue2 = { measure: 'occurs', group : 'game_date', options: [], filter: '20170701' }

const getOptions = (dimension) => {
    const group = dimension.group()
    const value = group.all().map(r => r.key)

    group.dispose()

    return value
}

const hasValues =() => {
    return true
}

const axisStyle = {
  axis: {stroke: "#242632"},
  axisLabel: {fontSize: 16, padding: 20, fill: 'red'},
  grid: {stroke: "#242632"},
  ticks: {stroke: "grey"},
  tickLabels: {fontSize: 11, padding: 5, color: '#fff'}
}




class Overview2 extends Component {
    constructor(props) {
        super(props)

        this.dimGroup = null
        this.allGroup = null

        this.state = {
            dimension : null,
            value1    : { measure: null, group: null, options: [], filter: null },
            value2    : { measure: null, group: null, options: [], filter: null },
            game_date: null
        }
    }

    componentWillMount() {
        this.allGroup = this.props.data.dimensions._all.group()
        this.componentWillReceiveProps(this.props)
    }

    componentWillUnmount() {
        this.allGroup.dispose()
    }



    componentWillReceiveProps(props) {
        const { data, params, location, game_date} = props



        const dimension = (params.dimension) ? params.dimension : defaultDimension

        if (dimension !== this.state.dimension) {
            if (this.dimGroup) {
                this.dimGroup.dispose()
            }
            this.dimGroup = data.dimensions[dimension].group()
        }

        let { value1, value2 } = location.query

        value1 = (value1) ? JSON.parse(value1) : defaultValue1
        value2 = (value2) ? JSON.parse(value2) : defaultValue2

        if (value1.group && value1.group === groupAll) {
            value1.group = null
            value1.filter = null
        }

        if (value2.group && value2.group === groupAll) {
            value2.group = null
            value2.filter = null
        }
        value1.options = (value1.group)
            ? (value1.group !== this.state.value1.group)
                ? getOptions(data.dimensions[value1.group])
                : this.state.value1.options
            : []


        value2.options = (value2.group)
            ? (value2.group !== this.state.value2.group)
                ? getOptions(data.dimensions[value2.group])
                : this.state.value2.options
            : []


         this.dateOptions= getOptions(data.dimensions[defaultDimension]);

        var gd;
       if(!game_date) {
            gd = this.dateOptions[0];
        }
        else {gd = game_date}

        this.setState({
            ...this.state,
            game_date: gd,
            value1,
            value2
        }

        )
    }

    onDimensionChange     = (e, i, v) => this.update({ ...this.state, dimension: v })
    onValue1MeasureChange = (e, i, v) => this.update({ ...this.state, value1: { ...this.state.value1, measure: v } })
    onValue1GroupChange   = (e, i, v) => this.update({ ...this.state, value1: { ...this.state.value1, group:   v } })
    onValue1FilterChange  = (e, i, v) => this.update({ ...this.state, value1: { ...this.state.value1, filter:  v } })
    onValue2MeasureChange = (e, i, v) => this.update({ ...this.state, value2: { ...this.state.value2, measure: v } })
    onValue2GroupChange   = (e, i, v) => this.update({ ...this.state, value2: { ...this.state.value2, group:   v } })
    onValue2FilterChange  = (e, i, v) => this.update({ ...this.state, value2: { ...this.state.value2, filter:  v } })

    update = (day) => {
        const { location, router } = this.props
        console.log("updating with game date========")
        console.log(day)


/*
           router.push({
               pathname : "/overview",
                ...this.props,
                game_date: day
            })*/


        this.setState({
            ...this.state,
            game_date: day,
        });

       // this.render();

    }

    onClickHandler = (e, i, v) => {
        const filter = i.data[v].key
        const { filters, filterHandler } = this.props.filter
        const { dimension }  = this.state

        if (!Array.isArray(filters[dimension] || null)) {
            filters[dimension] = []
        }

        if (!Array.isArray(filters[dimension][0] || null)) {
            filters[dimension][0] = []
        }

        const index = filters[dimension][0].indexOf(filter)

        if (index > -1) {
            filters[dimension][0].splice(index, 1)
        } else {
            filters[dimension][0].push(filter)
        }

        filterHandler(dimension, filters[dimension])
    }


    onGameDayChange = (e,i,v) => {
        console.log(" onGameDayChange fired ")
        if (v === this.state.game_date) {
            console.log(" Day SAME from " + this.state.game_date + " to " + v)

        }
        else {
            console.log(e)
            console.log(i)
            console.log(v)
            console.log(" Day changed from " + this.state.game_date + " to " + v)
            this.update(v)
        }



    }


    render() {
        const { data, params, filter } = this.props
        const { dimension, value1, value2, game_date } = this.state



        console.log(" ********************* rendering *****************")
        console.log(this.state)
        console.log(this.props)

        return (


        <div className={"comparison"}>
            <Toolbar className="toolbar">
                <ToolbarGroup >
                 <Select
                        value={game_date}
                        label={"game date"}
                        handler={this.onGameDayChange}
                        options={this.dateOptions} />

                </ToolbarGroup>
            </Toolbar>


            <Timeline
             data={this.props.data}
             game_date={game_date}
            />



            </div>
        )
    }
}

Overview2.propTypes = {
    game_date:  PropTypes.string,
    data : PropTypes.shape({
        dimensions: PropTypes.object.isRequired,
        measures  : PropTypes.array.isRequired
    })/*.isRequired (breaks because of react-router)*/,
    filter: PropTypes.shape({
        filters: PropTypes.object.isRequired,
        filterHandler: PropTypes.func.isRequired
    })/*.isRequired*/,
    params: PropTypes.object.isRequired,
    location: PropTypes.shape({
        query: PropTypes.object.isRequired
    }).isRequired,
    router: PropTypes.object.isRequired
}

export default withRouter(Overview2)
