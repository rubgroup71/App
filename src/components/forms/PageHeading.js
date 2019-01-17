import React, { Component } from 'react'
import logo from '../images/baccara.jpg'
import {withRouter} from 'react-router-dom'
import {Responsive, Sidebar,Button,Progress,Menu,Card,Icon,Label, Table,Form,Input, Grid, Header, Image, Message, Segment, Checkbox, GridColumn, Container,Pagination } from 'semantic-ui-react'
class PageHeading extends Component {
  render() {
    return (
        <Container text>
        <Image src={logo} size='small' centered></Image>
        <Header inverted size='large' style={{marginTop:8,paddingBottom:8}}>{this.props.name}</Header>
       
      </Container>
    )
  }
}
export default withRouter(PageHeading)