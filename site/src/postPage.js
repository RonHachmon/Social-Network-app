
class HomePage extends React.Component 
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
      <PostList  token={this.state.token}  id={this.state.id}/>    
      </div>
      )
      }
}





class CreatePost extends React.Component 
{
	constructor(props) {
		super(props);
    this.state = {
      post:""
  }
    this.onPostChange = this.onPostChange.bind( this );
    this.submit_post = this.submit_post.bind( this );
	}
  onPostChange(e) {
    this.setState({post: e.target.value});
  }
  async submit_post(e) { 
    const url='/api/post';
    const data={"content":this.state.post}
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
    throw new Error( 'Error while posting');
    }
    this.props.update_list();   
  }

    render() {
        return 	<div className='PostInput'>
                  <input className='msg-input'
                 placeholder="Share your thoughts"
                 onChange={this.onPostChange}
                 />
                <button type = "button"
                className="post-button"
                onClick={this.submit_post}>Post</button>
                </div>
      }
}

class PostItem extends React.Component 
{
	constructor(props) {
		super(props);
    this.state = {creator_name: " ",
    }
    this.get_creator_name();
	}

  async get_creator_name()
  {
    const url='/api/user/'+this.props.post.creator_ID
    const token=this.props.token
    const response = await fetch(url,{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
     });
  let data = await response.json();
  await this.setState( {creator_name : data.name})
  }

    render() {
        return 	<div className='PostItem'  data-id={this.props.post.id}>
                    <div className='PosterName'>
                         <span>{this.state.creator_name+':'}</span>
                    </div>
                    <div className='PostContent'>
                        <span>{this.props.post.content}</span>
                    </div>
                </div>
      }
}



class PostList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {posts: [],
        new_post:false
      }
      this.update_list = this.update_list.bind( this );
      this.new_post=setInterval(async()=>{
        const data=await this.fetch_post();
        if(data.length>this.state.posts.length)
        {
          this.setState({new_post:true})
        }
      },1000*30);
    }
    
    componentDidMount() 
    {
		     this.update_list();
    }


    async fetch_post()
	  {
      const token=this.props.token
	  	const response = await fetch('/api/post',{
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
      if(response.status == 403)
      {
        window.location.assign("/wait.html")
      }
      let data = await response.json();
      data=data.sort((a,b)=>{ 
        return new Date(b.creation_date) - new Date(a.creation_date);
      })

      //push your post front
      const idx=data.findIndex( post =>  post.creator_ID == this.props.id )
      if(idx!=-1||idx!=0)
      {
        data.unshift(data[idx])
        data.splice( idx+1, 1 )
      }

      return data;
	  }
 
    
    async update_list( )
    {
      const data=await this.fetch_post();
      this.setState( {posts : data,
                      new_post:false} );
    }
  
    render() {
          return(
            <div className='CreatePost'>
              <CreatePost update_list={this.update_list} token={this.props.token} /> 
           <div className="PostList">
                 {this.state.posts.slice(0,10).map( (item,index) => { return  <PostItem  post={item} token={this.props.token}  key={index}/>  } ) }
                 </div>
                 {this.state.new_post&&
                   <button type = "button"
                   className="refresh-button"
                   onClick={this.update_list}>Update</button>}
                 </div>
                 );
    }
  }