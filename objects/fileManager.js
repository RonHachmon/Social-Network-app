const fs = require("fs").promises;

const store_in_DB= async (path,source) =>
{
    await fs.writeFile(path,JSON.stringify(source),(err) => {
        if (err)
        {
            throw (err);
        }
    });
}
const load_from_DB=async(path)=>
{

        const buffer_data= await fs.readFile(path,(e)=>
        {
            if (e)
            {
                throw (e);
            }
        })
        if(buffer_data.length>1)
        { 
        const json_data=buffer_data.toString();
        return JSON.parse(json_data);
        } 
}
module.exports = {
    store_in_DB:store_in_DB,
    load_from_DB:load_from_DB
}
