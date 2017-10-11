import React, {Component, PropTypes} from 'react'
import _ from 'lodash'

import LayoutCellMenu from 'shared/components/LayoutCellMenu'
import LayoutCellHeader from 'shared/components/LayoutCellHeader'
import {fetchTimeSeriesAsync} from 'shared/actions/timeSeries'
import {removeUnselectedTemplateValues} from 'src/dashboards/constants'

class LayoutCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDeleting: false,
    }
  }

  closeMenu = () => {
    this.setState({
      isDeleting: false,
    })
  }

  handleDeleteClick = () => {
    this.setState({isDeleting: true})
  }

  handleDeleteCell = cell => () => {
    this.props.onDeleteCell(cell)
  }

  handleSummonOverlay = cell => () => {
    this.props.onSummonOverlayTechnologies(cell)
  }

  handleDataDownload = cell => async () => {
    console.log(cell.name)
    const qs = this.props.queries
    const templates = this.props.templates
    const resolution = 740

    if (!qs.length) {
      console.log('empty!') // TODO
    }

    const timeSeriesPromises = qs.map(query => {
      const {host, database, rp} = query
      const templatesWithResolution = templates.map(temp => {
        if (temp.tempVar === ':interval:') {
          if (resolution) {
            return {...temp, resolution}
          }
          return {...temp, resolution: 1000}
        }
        return {...temp}
      })
      return fetchTimeSeriesAsync({
        source: host,
        db: database,
        rp,
        query,
        tempVars: removeUnselectedTemplateValues(templatesWithResolution),
        resolution,
      })
    })
    Promise.all(timeSeriesPromises).then(timeSeries => {
      console.log('zomG successfull')
      const newSeries = timeSeries.map(response => ({response}))
      console.log(newSeries)
    })
  }

  render() {
    const {cell, children, isEditable} = this.props

    const {isDeleting} = this.state
    const queries = _.get(cell, ['queries'], [])

    return (
      <div className="dash-graph">
        <LayoutCellMenu
          cell={cell}
          isDeleting={isDeleting}
          isEditable={isEditable}
          onDelete={this.handleDeleteCell}
          onEdit={this.handleSummonOverlay}
          handleClickOutside={this.closeMenu}
          onDeleteClick={this.handleDeleteClick}
          onDataDownload={this.handleDataDownload}
        />
        <LayoutCellHeader
          queries={queries}
          cellName={cell.name}
          isEditable={isEditable}
        />
        <div className="dash-graph--container">
          {queries.length
            ? children
            : <div className="graph-empty">
                <button
                  className="no-query--button btn btn-md btn-primary"
                  onClick={this.handleSummonOverlay(cell)}
                >
                  <span className="icon plus" /> Add Graph
                </button>
              </div>}
        </div>
      </div>
    )
  }
}

const {arrayOf, bool, func, node, number, shape, string} = PropTypes

LayoutCell.propTypes = {
  cell: shape({
    name: string.isRequired,
    isEditing: bool,
    x: number.isRequired,
    y: number.isRequired,
    queries: arrayOf(shape()),
  }).isRequired,
  children: node.isRequired,
  onDeleteCell: func,
  onSummonOverlayTechnologies: func,
  isEditable: bool,
  onCancelEditCell: func,
}

export default LayoutCell
