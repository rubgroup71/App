import React from 'react'
import {Table} from 'semantic-ui-react'
import {withRouter} from 'react-router-dom'
function TableComponent (props) {
      
      const {location}=props
      
    if (location.pathname==='/builditem') {
      const {stage,data,negative}=props
      var name = stage.Name.toLowerCase()
      return (
      
        <Table.Row textAlign='center' negative={negative[stage.QID]}>
            <Table.Cell>{stage.QID}</Table.Cell>
            <Table.Cell>{stage.Name}</Table.Cell>
            <Table.Cell>{data[name]}</Table.Cell>
        </Table.Row>
  
)
    } else {
      
      const {stage,name,value}=props.data
      return (
      
        <Table.Row textAlign='center'>
            <Table.Cell>{stage}</Table.Cell>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>{value}</Table.Cell>
        </Table.Row>
  
)
    }
    
      
  }



export default withRouter(TableComponent)
