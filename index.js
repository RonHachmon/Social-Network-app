// External modules
const express = require('express')
const userRouter = require('./routers/users_api.js')
const PostRouter=	require("./routers/post_api.js")
const MessagesRouter=	require("./routers/messages_api.js")
const user=require("./objects/user.js");
const post=require("./objects/post.js");
const message=require("./objects/messages");

const app = express()
let  port = 2718;

const reExt=/\.([a-z]+)/i;
function content_type_from_extension(url)
{
	const m=url.match(reExt)
	if(!m)
	{
		return 'text/html'
	}
	const ext=m[1].toLowerCase();
	switch(ext)
	{
		case 'js':return 'text/javascript'
		case 'css':return 'text/css'
		case 'html':return 'text/html'
		case 'png':return 'text/png'
	}
	return 'text/plain'
}
// General app settings
const set_content_type = function (req, res, next) 
{
	const content_type=req.baseUrl=='/api'?
	"application/json; charsert=utf-8":content_type_from_extension(req.url)
	res.setHeader("Content-Type", content_type);
	next()
}

app.use( set_content_type );

app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded( // to support URL-encoded bodies
{  
  extended: true
}));
//Routers

app.use(express.static('site'))
app.get('/', (req, res) =>{
	res.sendFile('site/Post.html', { root: __dirname })
});
app.use('/api',userRouter)
app.use('/api',PostRouter)
app.use('/api',MessagesRouter)


// Init 

let msg = `listening at port ${port}`
app.listen(port, () => { 
	console.log( msg ) ;
	user.boot_system();
	post.boot_system();
	message.boot_system();
 })


