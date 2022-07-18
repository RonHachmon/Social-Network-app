const fileManager=require("./fileManager")
const DATABASE_PATH="./database/messages.json"
let g_message = [];
function Message(content,creator_id,recipient_id)
{
    this.creation_date=new Date();
    this.content=content;
    this.creator_ID=creator_id;
    this.recipient_ID=recipient_id;
    this.id=generate_id();
}

const generate_id=()=>
{
    let max_id = 0;
    if(g_message)
    {
        g_message.forEach(
            item => { max_id = Math.max( max_id, item.id) }
        )
    }
    return max_id+1;
}
const create_message=(content,creator_id,recipient_id) =>
{
    const message=new Message(content,creator_id,recipient_id);
    g_message.push(message);
    fileManager.store_in_DB(DATABASE_PATH,g_message);
    return message;    
}

const get_all_my_messages=(id)=>
{
    return g_message.filter(message=>message.recipient_ID==id);
}
const send_message_to_all=(user_id,content,user_array)=>
{
    user_array.forEach(user => {
        let message=new Message(content,user_id,user.id);
        g_message.push(message);
    });
    fileManager.store_in_DB(DATABASE_PATH,g_message);
}
const boot_system=async()=>
{
    g_message=  await fileManager.load_from_DB(DATABASE_PATH);
    if(!g_message)
    {
        g_message=[];
    }
    console.log("sucessfuly booted messsages");
}

module.exports = {
    create_message:create_message,
    get_all_my_messages:get_all_my_messages,
    send_message_to_all:send_message_to_all,
    boot_system:boot_system
}