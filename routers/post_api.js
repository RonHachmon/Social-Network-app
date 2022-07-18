const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const Post=require("../objects/post");
const auth=require("../middleware/auth")
const router = new express.Router();

 function  create_post( req, res )
{
    if(req.body.content)
    {
    const post=Post.create_post(req.body.content,req.userID)
    res.status( StatusCodes.CREATED);
    res.send(post);
    }
    else
    {
        res.status( StatusCodes.BAD_REQUEST);
        res.send("please fill all fields")
    }
}
function  get_posts( req, res )
{

    const all_post=Post.get_all_posts();
    res.send(all_post);
}
function delete_post( req, res )
{
	let id = parseInt( req.params.id );
    const post=Post.get_post_by_ID(id);
	const userID=req.userID;

	if(post)
	{
        if(post.creator_ID==userID||userID==1)
        {
            try{

            
            Post.remove_post_by_ID(id);
            res.send(  JSON.stringify( {}) ); 
            }
            catch(e)
            {
                res.send("error")
            }
        }
        else
        {
            res.status( StatusCodes.UNAUTHORIZED );
            res.send("Unauthorized action")
        }
	}
	else
	{
        res.status( StatusCodes.NOT_FOUND);
		res.send( "post id not found")
		return;
	} 

}



router.post('/post',auth, (req, res) => { create_post(req, res ) } )
router.get('/post',auth, (req, res) => { get_posts(req, res )  } )
router.delete('/post/:id',auth, (req, res) => { delete_post(req, res )  })

 module.exports = router