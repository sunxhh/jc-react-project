import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from '../../global/urls'
import PetSpecies from './species'

class SupplyChainModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.PET} to={urls.PET_SPECIES} />
        <Route exact path={urls.PET_SPECIES} component={PetSpecies} />
      </Switch>
    )
  }
}

export default SupplyChainModule
