
import React, { Component } from 'react'
import {Button,Progress, Grid, Header, Segment, Table} from 'semantic-ui-react'
import { connect } from 'react-redux'
import {createItem,createitemguest} from '../../store/actions/dataActions'
import swal from '@sweetalert/with-react'
import {withRouter,Redirect} from 'react-router-dom'
// import Parts from '../../data/parts'
import Axios from 'axios';
import firebase from 'firebase/app'
import TableComponent from '../TableComponent';


class BuildItemForm extends Component {
  state={
      data:{},
      add:{
        ItemSerial:'',
        ItemName:'',
        IsStandard:true,
        Type:'',
        Email:this.props.auth.email
      },
      progress:0,
      pagename:"Build New Item",
      
      value:'',
      cancel:false,
      negative:[],
      first:false,
      tree:[],
      orderbutton:true,
      partdata:{},
      questions:[],
      invalid:[],
      categories:[],
      start:false,
      Type:{}
  }

componentDidMount(){

    
    Axios.get('http://proj.ruppin.ac.il/bgroup71/prod/api/Categories')
    .then(res=>this.setState({categories:res.data}))
    .catch(()=>{
        swal('','something worng, try again','error');
        this.props.history.goBack()}
        )
    // Add invalid to firebase
    // Parts.map(part=>{
        
    //     var options = part.options.map(x=>x.value)
        // options.forEach((opt,i) => {
    //         db.collection('Ainvalid'+part.id).doc(opt).set({
    //             module:"",  
    //             body:"",
    //             port:"",
    //             function:"",
    //             orifice:"",
    //             seals:"",
    //             override:"",
    //             voltage:"",
    //             power:"",
    //             connector:""
    //         })
    //     });
        
    // })
    
    // swal({
    //     content:(
    //     <div>
    //         <h1>How to build a item</h1>
    //         <p>green is good the else is bad, good luck</p>
    //         <p>lets go!!</p>
    //     </div>)
    // })
    
}
componentDidUpdate(prevProps, prevState) {
      
    if(prevProps.success !== this.props.success){
        this.props.history.push('/items')
      }
  }
handleSubmit=(e)=>{
    e.preventDefault()
    var itemdetails=[]
    var i=1
     // change the database of items
    for (const key in this.state.data) {
        itemdetails.push({stage:i.toString(),name:key,value:this.state.data[key]})
        i++
    } 
    swal({
        title:this.state.add.ItemSerial,
        text:'Give name to the item',    
        content:'input'
    })
    .then((value)=>{
        
        this.setState({add:{...this.state.add,ItemName:value,Type:this.state.Type.Type}})
        if (this.props.guest) {
           this.props.createitemguest(this.state.add) 
        }
        else this.props.createItem(this.state.add,itemdetails)
        this.setState({orderbutton:false})
        this.startOver()
        
        
    })

}
startOver=()=>{
    
    this.setState({
        progress:0,
        start:false,
        data:{},
        add:{...this.state.add,ItemSerial:'',IsStandard:true,Type:''},
        negative:[],
        first:false
    });
    
    
}
handleClick=(e)=>{
 
    const {name}=e.target
    if (name==='order') {
        this.props.history.push('/createorder/0')
    }
    else if(name==='Add'){
        this.handleSubmit(e)
    }
    else if (this.state.start) {
          
        swal({
            content:(
                <div>
                    <h3>Start Over?</h3>
                    <Button size='mini' content='No' onClick={()=>{swal.close()}}></Button>
                    <Button size='mini' content='Yes' onClick={()=>{
                        this.startOver()
                        swal.close();}}>
                    </Button>
                </div>
            ),
            button:{visible:false},
            closeOnClickOutside: false,
        })
        .then(()=>{
            this.setState({cancel:false});
            this.makeQuestions()
        })
        
        
    } 
    else {this.makeQuestions()}          
}
isInvalid=(id,value)=>{
    
    // eslint-disable-next-line eqeqeq
    var stage = this.state.invalid.find(s=>s.stage==id)
    
    // eslint-disable-next-line eqeqeq
    var val = stage.value.find(x=>Object.getOwnPropertyNames(x)==value)
    
    if (id===1) {
        
    } else {
        
    for (const name in val[value]) {
        
        if (val[value][name]==='') {
            
        }
        else if (RegExp(val[value][name]).test(this.state.data[name])) {
            
            return true
        }
    }
    }
    
    
    
}
isStandard=(id,value)=>{
   if (this.isInvalid(id,value)) {
       return
   }
    
   if (this.state.add.IsStandard) {
    if (id===1) {
        return 'green'
    }
    else {
        // eslint-disable-next-line eqeqeq
        var tmp = this.state.tree.filter(p=>p.id==id)
        var tmp2 = tmp.find(p=>p.parent.test(this.state.value))
      if(tmp2.length===0){
        return 'yellow'
      }
        else if (tmp2.value.test(value)) {  
            return 'green'
        }
        else return 'yellow'
   }
   
    }
    else {
        if (!this.state.first) {
            var negative=this.state.negative.slice()
            negative[id-1]=true
            this.setState({negative})
            
            this.setState({first:true})
        }
        
        return 'yellow'
    } 
}
getAllData=async ()=>{
    const{Type}=this.state
    
    const db =firebase.firestore()
    var tree=[]
    var invalid=[]
    await Axios.get('http://proj.ruppin.ac.il/bgroup71/prod/api/Question?type='+Type.Type)
    .then(res=>this.setState({questions:res.data}))
    .catch(()=>{
        swal('','something worng, try again','error');
        this.startOver()
    })

    for (let i = 1; i <= Type.Stages; i++) {
       
        let invtmp=[]
     await db.collection(Type.Type+'invalid'+i.toString()).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {    
                invtmp.push({[doc.id]:doc.data()}); 
            });
        })
        
        .then(()=>invalid.push({stage:i,value:invtmp}))
        .then(()=>{
            
            invtmp=[]
        })
        .catch(()=>{
            swal('','something worng, try again','error');
            this.startOver()
        })
        
    }
    
    this.setState({invalid})
   
    await db.collection(Type.Type+"tmp").orderBy('id', 'asc').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {    
            tree.push({id:doc.data().id,parent:new RegExp(doc.data().parent,'i'),value:new RegExp(doc.data().value,'i')});
        });

    })
    .catch(()=>{
        swal('','something worng, try again','error');
        this.startOver()
    })
    this.setState({tree})

    await Axios.get('http://proj.ruppin.ac.il/bgroup71/prod/api/AllItem?type='+Type.Type+'&stages='+Type.Stages)
    .then(res=>this.setState({partdata:res.data}))
    .catch(()=>{
        swal('','something worng, try again','error');
        this.startOver()
    })
      
    
    this.makeQuestions()
}
makeQuestions=()=>{
    const {partdata,questions,progress,categories,start} =this.state
    this.setState({cancel:false})
    var part = partdata[progress+1]
    var question = questions.find(q=>q.QID===progress+1)
    
    var buttons
    if (!start) {
        buttons=categories.map((c,i)=>
            <Grid.Column key={i}
            style={{width:'30%'}}>
            <Button 
                size='mini'
                fluid
                content={c.Type}
                value={c.Type} 
                color='green'
                onClick={(event,data)=>{
                    var Type =categories.find(t=>t.Type===data.value)
                    this.setState({Type})
                                                                
                    swal.close()
       
            }}/>
            
            </Grid.Column>
            
            )
    } else {
        buttons =part.map((opt,i)=>
            <Grid.Column key={i}
            style={{width:'30%'}}>
            <Button 
                size='mini'
                fluid
                content={opt.Description}
                value={opt.ID} 
                color={this.isStandard(progress+1,opt.ID)}
                disabled={this.isInvalid(progress+1,opt.ID)}
                onClick={(event,data)=>{
                    this.setState({data:{...this.state.data,[question.Name.toLowerCase()]:data.value}})
                    this.setState(prev=>{return{add:{...this.state.add,ItemSerial:prev.add.ItemSerial+data.value,IsStandard:data.color==='yellow'?false:true}}})
                    
                    this.setState({value:data.value})
                                                                
                    swal.close()
                    
                       
            }}/>
            
            </Grid.Column>
            
            )
    }
    
    if (!start) {
        swal({
        
            content:(
            <div>
                <h1>Type</h1>
                <p>Choose Type</p>
                <Grid columns='3' centered>
                    {buttons}
                </Grid>
                
                <br/>
                <br/>
                <Button 
                    negative
                    floated='right'
                    value='cancel'
                    size='mini'
                    content='Cancel'
                    onClick={()=>{swal.close(); this.setState({cancel:true})}}></Button>
                <br/>
            </div>
            ),
            button:{visible:false},
            closeOnClickOutside: false,

        })
        .then(async ()=>{ 
            if (this.state.cancel) {
                
            }
            else {
                this.setState({start:true})
                
                    this.getAllData()
                
                }
  
    })
    
    } else {
        swal({
        
            content:(
            <div>
                <h1>{question.Name}</h1>
                <p>{question.Question}</p>
                <Grid columns='3' centered>
                    {buttons}
                </Grid>
                
                <br/>
                <br/>
                <Button 
                    negative
                    floated='right'
                    value='cancel'
                    size='mini'
                    content='Cancel'
                    onClick={()=>{swal.close(); this.setState({cancel:true})}}></Button>
                <br/>
            </div>
            ),
            button:{visible:false},
            closeOnClickOutside: false,
            
            
          
        })
        .then(()=>{
            
            if (this.state.cancel) {
                
            }
            else if (this.state.progress<this.state.Type.Stages)
                {
                    this.setState({progress:this.state.progress+1})
                    
                    if (this.state.progress<this.state.Type.Stages)
                    {
                        
                        this.makeQuestions()
                    }
                }
         
        
    }) 
    } 

    
    }
buttonChange=()=>{
    
    if (this.state.progress==this.state.Type.Stages) {
        return 'Add'
    }
    else if (this.state.start) {
        return 'Continue'
    }
    else return 'Start'
}
    render() {
    
    const {auth,guest}=this.props
    
    if (auth.isEmpty) {
        if (!guest) {
            return <Redirect to='/login'/>
        } 
    }
    return (
            
        <>
            <Header textAlign='center'>{this.state.pagename}</Header>
            <Segment style={{display:this.state.progress>0?'block':'none'}} compact>
              <Progress
                        style={{marginTop:'5%'}}
                        value={this.state.progress} 
                        total={this.state.Type.Stages}
                        progress='ratio'
                        active
                        success={this.state.progress==this.state.Type.Stages?true:false}
                        warning={this.state.add.IsStandard?false:true}
                        >
                </Progress>
            </Segment>
            <Segment textAlign='center'>
                <Button 
                    
                    name={this.buttonChange()}
                    onClick={this.handleClick}
                    content={this.buttonChange()}  
                    >
                </Button>
                <Button 
                    style={{display:this.props.guest?'':'none'}}
                    
                    color='blue'
                    size='medium'
                    name='order'
                    onClick={this.handleClick}
                    disabled={this.state.orderbutton}
                    content='Order'
                    >
                </Button>
                <Button 
                    color='grey'
                    size='medium'
                    onClick={()=>{this.props.guest?this.props.history.push('/login'):this.props.history.push('/acount')}}
                    content='Cancel'
                    >
                </Button>
                
            </Segment>
            
            <Table celled unstackable compact fixed striped style={{display:this.state.start?'':'none'}}>
            
                <Table.Body>
                
                    {this.state.questions.map((stage,i)=>{
                        return <TableComponent key={i} stage={stage} data={this.state.data} negative={this.state.negative}/>
                    })}
                
                </Table.Body>
                
            </Table>
            
        </>
    )
  }
}
const mapStateToProps = (state) => {
  
    return{
      auth:state.firebase.auth,
      guest:state.auth.guest,
      success:state.data.success
    //   data:state.firestore.ordered

    }
     
  }
const mapDispatchToProps = (dispatch) =>{
    return{
        createItem:(item,data)=>dispatch(createItem(item,data)),
        
        createitemguest:(item)=>dispatch(createitemguest(item))
    }
  }
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(BuildItemForm))