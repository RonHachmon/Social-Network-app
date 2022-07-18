
const fileManager=require("./fileManager")
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt');
const validator = require('validator');
const DATABASE_PATH="./database/user.json"
const TOKEN_LOCK="Rumpelstiltskin"
let g_users = [];
const status= {
    created: 'created',
    active: 'active',
    suspended: 'suspended',
    deleted: 'deleted'
    }

function User(name,email,password)
{
    this.name=name;
    this.email=email;
    this.creation_date=new Date();
    this.status=status.created;
    this.password=password;
    this.id=generate_id();
    this.token=null;
}
const auth_user= async (email,password)=> 
{
    user=g_users.find(user=>user.email==email)
    if(user)
    {
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
        {
            throw new Error('Unable to login')
        }
        if(user.token==null)
        {
            await generateAuthToken(user);
            await fileManager.store_in_DB(DATABASE_PATH,g_users);
        }
        return user;
    }
    else
    {
        throw new Error('Unable to login')
    }
}

const create_user=async (name,email,password) =>
{
    validate_email(email);
    hash_pass=await bcrypt.hash(password, 8)
    const user=new User(name,email,hash_pass);
    await generateAuthToken(user);
    g_users.push(user);
    fileManager.store_in_DB(DATABASE_PATH,g_users);
    return user;    
}
const get_user_by_ID= (id)=>
{
     return g_users.find( user =>  user.id == id ); 
}
const validate_email=(email)=>
{
    if(validator.isEmail(email))
    {
        g_users.forEach(
            item => { 
                if(email===item.email)
                {
                    throw new Error('bad email/password')
                }
             }
        )   
    }
    else
    {
        throw new Error('invalid email')
    } 
}
const verify_token=(id,token)=>
{   
    let valid=false;
    user=get_user_by_ID(id)
    if(user.token==token)
    {
        valid=true;
    }
    return valid;
}


const create_admin=async()=>
{
    if( !g_users.find(user=>user.id==1))
    {
        const pass=await bcrypt.hash("password", 8)
        admin=new User("admin","admin",pass);
        admin.id=1;
        admin.status=status.active;
        g_users.push(admin);
        await fileManager.store_in_DB(DATABASE_PATH,g_users);
    }
}

const generate_id=()=>
{
    let max_id = 0;
	g_users.forEach(
		item => { max_id = Math.max( max_id, item.id) }
	)
    return max_id+1;
}
const generateAuthToken = async (user)=> {
    const id=user.id.toString();
    const token = jwt.sign(id, TOKEN_LOCK)
    user.token=token;
    return token
}

const get_all_users=()=>
{
    return g_users;
}
const remove_user_by_ID=(id)=>
{
    const idx=g_users.findIndex( user =>  user.id == id )
    if(idx)
    {
        g_users.splice( idx, 1 )
        fileManager.store_in_DB(DATABASE_PATH,g_users);
    }
    else
    {
        throw new Error('id doesnt exist')
    }
    
}
const update_status= async(user,i_status)=>
{
    if(Object.keys(status).find(stat =>  stat== i_status ))
    {
        user.status=i_status
        await fileManager.store_in_DB(DATABASE_PATH,g_users);
        return user
    }
    throw new Error('status doesnt exist')
}
const logout=async(id)=>
{
    const user =get_user_by_ID(id)
    user.token=null;
    fileManager.store_in_DB(DATABASE_PATH,g_users);

}

const boot_system=async()=>
{
    g_users= await fileManager.load_from_DB(DATABASE_PATH,g_users)
    if(!g_users)
    {
        g_users=[];
    }
    create_admin();
    console.log("sucessfuly booted user");
    
}

module.exports = {
    create_user:create_user,
    verify_token:verify_token,
    logout:logout,
    update_status:update_status,
    remove_user_by_ID:remove_user_by_ID,
    get_all_users:get_all_users,
    auth_user:auth_user,
    boot_system:boot_system,
    generateAuthToken:generateAuthToken,
    get_user_by_ID:get_user_by_ID,
    TOKEN_LOCK:TOKEN_LOCK
}
