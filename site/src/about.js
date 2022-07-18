class AboutPage extends React.Component {

    constructor(props) {
            super(props);
            let cookiesArray=document.cookie.split("; ")
            let i_id;
            for(let i=0;i<cookiesArray.length;i++)
            {
            let value_name=cookiesArray[i].split("=")
                if(value_name[0]=="id")
                {
                    i_id=value_name[1]
                }
            }
            this.state={id:i_id}
        }  
  
          render() {
            return(
            <div className="root-container">
            <Navbar id={this.state.id}/>
            <About/>    
            </div>
            )
            }
      
  
    }
class About extends React.Component {

constructor(props) {
    super(props);
}

render() {
    return 	<div className='About'>
            <p>Created by Ron Hachmon</p>
            <p>id: 207229428</p>
            <p>for assistance  please contact ronhc@mta.ac.il</p>
                
            </div>
    }
}
  
  