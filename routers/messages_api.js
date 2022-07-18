const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const Messages=require("../objects/messages");
const User=require("../objects/user");
const auth=require("../middleware/auth")
const router = new express.Router();

 function  create_message( req, res )
{
    const recipent_id =  parseInt( req.params.id );
    if(User.get_user_by_ID(recipent_id))
    {
        if(!req.body.content)
        {
            res.status( StatusCodes.BAD_REQUEST);
            res.send("please enter message")
            return
        }

    const message=Messages.create_message(req.body.content,req.userID,recipent_id)
    res.status( StatusCodes.CREATED);
    res.send(message);
    }
    else
    {
        res.status( StatusCodes.NOT_FOUND);
        res.send("User doesnt exist")
    }
}
 function  get_messages( req, res )
{
    const all_messages=Messages.get_all_my_messages(req.userID);
    res.send(all_messages);
}
 function  send_to_all( req, res )
{
    if(req.userID==1)
    {
        Messages.send_message_to_all(req.userID,req.body.content,User.get_all_users());
        res.status( StatusCodes.CREATED);
        res.send("message send")
    }
    else
    {
        res.status( StatusCodes.FORBIDDEN );
        res.send("Unauthorized action")
    }
}




router.post('/message/:id',auth, (req, res) => { create_message(req, res ) } )
router.get('/message',auth, (req, res) => { get_messages(req, res )  } )
router.post('/message',auth, (req, res) => { send_to_all(req, res )  })

 module.exports = router