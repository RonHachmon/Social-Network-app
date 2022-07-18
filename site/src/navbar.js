const MenuItem=[
        {
            title:'Home',
            url:'/index.html',
            name:'nav-links'
        },
        {
            title:'Messages',
            url:'/Messages.html',
            name:'nav-links'
        },
        {
            title:'About',
            url:'/about.html',
            name:'nav-links'
        },
        {
            title:'Logout',
            url:'/LoginPage.html',
            name:'nav-links'
        }


]
const AdminItem=[
    {
        title:'Admin',
        url:'/admin.html',
        name:'nav-links'
    },

]


class Navbar extends React.Component {

    constructor(props) {
      super(props);
      this.handle_click = this.handle_click.bind( this );
      this.state = {
        isClicked: false
      };
      if(this.props.id==1)
      {
        MenuItem.splice(2,0,AdminItem[0])
      }
    }

    handle_click= ()=>{
        this.setState({isClicked:!this.state.isClicked})

    }
  
    render() {
  
      return (
        <div className="NavbarItems">
            <h1 className="navbar-logo">MTA-BOOK<i class="fa-solid fa-graduation-cap"></i></h1>
            <div className ="menu-icon" onClick={this.handle_click}>
                <i className={this.state.isClicked?'fas fa-times':'fas fa-bars'}></i>
            </div>
            {this.props.id&&
            <ul className={this.state.isClicked?'nav-menu-active':'nav-menu'}>
                {MenuItem.map((item,index)=>{
                    return(
                        <li key={index}>
                            <a className={item.name} href={item.url}>
                            {item.title}
                            </a>
                        </li>

                    )
                })}

            </ul> }
        </div>
      );
  
    }
  
  }
