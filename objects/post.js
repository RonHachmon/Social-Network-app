const fileManager=require("./fileManager")
const DATABASE_PATH="./database/post.json"
let g_posts = [];
function Post(content,creator_id)
{
    this.creation_date=new Date();
    this.content=content;
    this.creator_ID=creator_id;
    this.id=generate_id();
}

const generate_id=()=>
{
    let max_id = 0;
	g_posts.forEach(
		item => { max_id = Math.max( max_id, item.id) }
	)
    return max_id+1;
}
const create_post=(content,creator_id) =>
{
    const post=new Post(content,creator_id);
    g_posts.push(post);
    fileManager.store_in_DB(DATABASE_PATH,g_posts);
    return post;    
}
const remove_post_by_ID=(id)=>
{
    const idx=g_posts.findIndex( post =>  post.id == id )
    if(idx)
    {
        g_posts.splice( idx, 1 )
    }
    else
    {
        throw new Error('id doesnt exist')
    }
    
}
const get_all_posts=()=>
{
    return g_posts;
}
const get_post_by_ID= (id)=>
{
     return g_posts.find( post =>  post.id == id ); 
}

const boot_system=async()=>
{
    g_posts=await fileManager.load_from_DB(DATABASE_PATH);
    if(!g_posts)
    {
        g_posts=[];
    }
    console.log("sucessfuly booted post");
}

module.exports = {
    create_post:create_post,
    remove_post_by_ID:remove_post_by_ID,
    get_all_posts:get_all_posts,
    get_post_by_ID:get_post_by_ID,
    boot_system:boot_system
}