class WaitPage extends React.Component {

    constructor(props) {
            super(props);
        }  
  
          render() {
            return(
            <div className="root-container">
            <Navbar />
            <Wait/>    
            </div>
            )
            }
      
  
    }
class Wait extends React.Component {

constructor(props) {
    super(props);
}

render() {
    return 	<div className='About'>
                
            <p>User created,</p>
            <p>please wait for admin approval</p>
            <p>for assistance please contact ronhc@mta.ac.il</p>
                
            </div>
    }
}
  
  