
class MessagePage extends React.Component 
{
	constructor(props) {
		super(props);
  let cookiesArray=document.cookie.split("; ")
  let i_id;
  let i_token;
  for(let i=0;i<cookiesArray.length;i++)
  {
    let value_name=cookiesArray[i].split("=")
    if(value_name[0]=="token")
    {
      i_token=value_name[1]
    }
    if(value_name[0]=="id")
    {
      i_id=value_name[1]
    }
  }
  this.state={token:i_token,
    id:i_id}
	}
    render() {
      return(
      <div className="root-container">
      <Navbar id={this.state.id}/>
      <MessageList  token={this.state.token}  id={this.state.id}/>    
      </div>
      )
      }
}





class CreateMessage extends React.Component 
{
	constructor(props) {
		super(props);
    this.state = {
      message:"",
      id:""
  }
    this.onMessageChange = this.onMessageChange.bind( this );
    this.onIDChange = this.onIDChange.bind( this );
    this.submit_message = this.submit_message.bind( this );
	}
  onMessageChange(e) {
    this.setState({message: e.target.value});
  }
  onIDChange(e) {
    this.setState({id: e.target.value});
  }
  async submit_message(e) { 
    const url='/api/message/'+this.state.id;
    const data={"content":this.state.message}
    const token=this.props.token
    const response=await fetch(url,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },
      body:JSON.stringify(data)
    })
         
    if ( response.status != 201 )
    {
    throw new Error( 'Error while sending message');
    }
  }

    render() {
        return 	<div className='CreatePost'>
                   <input
                 placeholder="User ID"
                 className='id-input'
                 onChange={this.onIDChange}
                 />
                  <input
                 placeholder="Enter message"
                 className='msg-input'
                 onChange={this.onMessageChange}
                 />
                <button type = "button"
                className="post-button"
                onClick={this.submit_message}>Send message</button>
                </div>
      }
}

class MessageItem extends React.Component 
{
  constructor(props) {
		super(props);
    this.state = {creator_name: " ",
    }
    this.get_creator_name();
	}

  async get_creator_name()
  {
    const url='/api/user/'+this.props.message.creator_ID
    const token=this.props.token
    const response = await fetch(url,{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
     });
  let data = await response.json();
  this.setState( {creator_name : data.name})
  }

    render() {
        return 	<div className='MessageItem'  data-id={this.props.message.id}>
                    <div className='PosterName'>
                         <span>{this.state.creator_name}</span>
                    </div>
                    <div className='PostContent'>
                        <span>{this.props.message.content}</span>
                    </div>
                </div>
      }
}



class MessageList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {messages: [],
        new_message:false
      }
      this.update_list = this.update_list.bind( this );
      this.new_post=setInterval(async()=>{
        const data=await this.fetch_messages();
        if(data.length>this.state.messages.length)
        {
          this.setState({new_message:true})
        }
      },1000*30);
    }
    
    componentDidMount() 
    {
		     this.update_list();
    }


    async fetch_messages()
	  {
      const token=this.props.token
	  	const response = await fetch('/api/message',{
            method:'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            }
        });
      if(response.status == 401)
      {
        window.location.assign("/LoginPage.html")
      }
      let data = await response.json();
      data=data.sort((a,b)=>{ 
        return new Date(b.creation_date) - new Date(a.creation_date);
      })
      return data;
	  }
 
    
    async update_list( )
    {
      const data=await this.fetch_messages();
      this.setState( {messages : data,
                      new_message:false} );
    }
  
    render() {
          return(
            <div className='CreateMessage'>
              <CreateMessage token={this.props.token} />
           <div className="MessageList">
                 {this.state.messages.slice(0,10).map( (item,index) => { return  <MessageItem  message={item} token={this.props.token}  key={index}/>  } ) }
                 </div>
                 {this.state.new_message&&
                   <button type = "button"
                   className="refresh-button"
                   onClick={this.update_list}>Update</button>}
                 </div>
                 );
    }
  }