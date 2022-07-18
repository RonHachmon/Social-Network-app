const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const User=require("../objects/user.js");
const auth=require("../middleware/auth")

const router = new express.Router();

async function  create_user( req, res )
{
	try
	{
		if(!req.body.name ||!req.body.email||!req.body.password)
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send("please fill all fields")
			return;	
		}
		const new_user=await User.create_user(req.body.name,req.body.email,req.body.password);
		res.status( StatusCodes.CREATED );
		res.send({"id":new_user.id,"email":new_user.email,"name":new_user.name,"token":new_user.token});
	}
	catch(e)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send(e.message)
	}
}
async function  log_user( req, res )
{
	try
	{
        const log_user= await User.auth_user(req.body.email,req.body.password)
		res.send(log_user);
	}
	catch(e)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send(e.message)
	}
}
 function list_users( req, res )
{
	const userID=req.userID;
	if(userID==1)
	{
		res.send(User.get_all_users());
	}
	else
	{
		res.status( StatusCodes.FORBIDDEN );
		res.send("Unallowed action")
	}
	
}
 function delete_user( req, res )
{
	const id =  parseInt( req.params.id );
	const userID=req.userID;
	if ( id <= 0)
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "Bad id given")
		return;
	}

	if ( id == 1)
	{
		res.status( StatusCodes.FORBIDDEN ); 
		res.send( "Can't delete root user")
		return;		
	}
	if(id==userID||userID==1)
	{
		try
		{
			User.remove_user_by_ID(id)
			res.send(  JSON.stringify( {}) ); 
		}
		catch(e)
		{
			res.status( StatusCodes.NOT_FOUND );
			res.send(e.message);
		}

	}
	else
	{
		res.status( StatusCodes.FORBIDDEN );
		res.send("Unallowed action")
	} 
}
function get_user( req, res )
{
	const id =  parseInt( req.params.id );
	const user= User.get_user_by_ID(id);
	if(user)
	{
		res.send({"id":user.id,"email":user.email,"name":user.name});
	}
	else
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send("User doesnt exist")
	}
}

async function change_status( req, res )
{
	const status=req.query.status;
	const id =  parseInt( req.params.id );
	const userID=req.userID;
	let user= User.get_user_by_ID(id);
	if(userID==1&&id!=1)
	{
		if(!user)
		{
			res.status( StatusCodes.NOT_FOUND );
			res.send("User doesnt exist")
			return;
		}
		if(req.query.status)
		{
			try
			{
				user=await User.update_status(user,status)
				res.send(user)
			}
			catch(e)
			{		
				res.status( StatusCodes.BAD_REQUEST );
				res.send(e.message)
			}
			
		}
		else
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send("please enter  status")
		}

	}
	else
	{
		res.status( StatusCodes.FORBIDDEN );
		res.send("canno change root user")
	}
}
function logout(req,res)
{
	const userID=req.userID;
	User.logout(userID);
	res.send({})
}


router.post('/users', (req, res) => { create_user(req, res )  } )
router.post('/users/logout',auth, (req, res) => { logout(req, res )  } )
router.post('/users/login', (req, res) => { log_user(req, res )  } )
router.get('/user/:id',auth, (req, res) => { get_user(req, res )  })
router.get('/users',auth, (req, res) => { list_users(req, res )  } )
router.patch("/user/:id",auth, (req, res) => { change_status(req, res )})
router.delete('/user/:id',auth, (req, res) => { delete_user(req, res )  })
 module.exports = router