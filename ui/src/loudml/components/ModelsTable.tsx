import React, {PureComponent} from 'react'
import {Link} from 'react-router'

import ModelsRow from 'src/loudml/components/ModelsRow'
import { Model, Job } from 'src/loudml/types/model';
import { Dashboard, TimeRange } from 'src/types';

interface Props {
    source: {id: string}
    models: Model[]
    jobs: Job[]
    onClone: (name: string) => void
    onDelete: (name: string) => void
    onStart: (name: string) => void
    onStop: (name: string) => void
    onTrain: (name: string, timeRange: TimeRange) => void
    onStopTrain: (name: string) => void
    onForecast: (name: string, timeRange: TimeRange) => void
    onStopForecast: (name: string) => void
    onViewDashboard: (dashboard: Dashboard) => void
    onNewDashboard: (model: Model) => void
    onAddToDashboard: (model: Model, dashboard: Dashboard) => void
    dashboards: Dashboard[]
}

class ModelsTable extends PureComponent<Props, {}> {

    public render() {
        const {models} = this.props
        return (
            <div>
                {models.length
                    ? this.renderTable()
                    : this.renderTableEmpty() }
            </div>
        )
    }

    private renderTable() {
        const {
            source,
            models,
            jobs,
            onClone,
            onDelete,
            onStart,
            onStop,
            onTrain,
            onStopTrain,
            onForecast,
            onStopForecast,
            onViewDashboard,
            onNewDashboard,
            onAddToDashboard,
            dashboards,
        } = this.props
    
        return (
            <table className="table v-center margin-bottom-zero table-highlight">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th/>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {models.map(model => {
                        return (
                            <ModelsRow key={model.settings.name}
                                model={model}
                                jobs={jobs.filter(job => job.name === model.settings.name)}
                                source={source}
                                onClone={onClone}
                                onDelete={onDelete}
                                onStart={onStart}
                                onStop={onStop}
                                onTrain={onTrain}
                                onStopTrain={onStopTrain}
                                onForecast={onForecast}
                                onStopForecast={onStopForecast}
                                onViewDashboard={onViewDashboard}
                                onNewDashboard={onNewDashboard}
                                onAddToDashboard={onAddToDashboard}
                                dashboards={dashboards}
                            />
                        )
                    }, this)}
                </tbody>
            </table>
        )
    }

    private renderTableEmpty() {
        const {source: {id}} = this.props
        return (
            <div className="generic-empty-state">
                <h4 className="no-user-select">
                    Looks like you don't have any models<br /><br />
                    Create your own model, or use the model builder to create a model from an existing data schema template
                </h4>
                <br />
                <h6 className="no-user-select">
                    <Link
                        style={{marginLeft: '10px'}}
                        to={`/sources/${id}/loudml/models/new`}
                        className="btn btn-primary btn-sm"
                    >
                        <span className="icon plus" />
                        Create model manually
                    </Link>
                    <Link
                        style={{marginLeft: '10px'}}
                        to={`/sources/${id}/loudml/models/template`}
                        className="btn btn-primary btn-sm"
                    >
                        Use model builder
                    </Link>
                </h6>
            </div>
        )
    }

    get title () {
        const {models} = this.props

        return `${models.length} Model${models.length>1 ? 's': ''}`
    }

}

export default ModelsTable
