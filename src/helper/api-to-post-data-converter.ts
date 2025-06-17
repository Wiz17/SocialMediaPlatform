import { PostData } from "../hooks/useFetchFeed"
const PostDataHelper=(data:PostData[],userId:string)=>{

    console.log(data[0])
    console.log(data[0].node.likes2Collection)
    console.log(data[0]?.node?.users)

    const newData=data.map((data:PostData)=>{
        return{
            content:data.node.content,
            created_at:data.node.created_at,
            id:data.node.id,
            image:data.node.image,
            likes:data.node.likes2Collection.edges.length,
            users:{
                tag_name:data.node.users.tag_name,
                username:data.node.users.username,
                profile_picture:data.node.users.profile_picture,
               
            },
            liked:data.node.likes2Collection.edges.find((edge:any)=>edge.node.user_id===userId)?true:false
        }
    })
    return newData
}
//in newData keep only below keys
//content , created_at,id,image,likes,users( into users keep tag_name, username,profile_picture),liked
//now here calculate likes by length of likes2Collection.edges array length
//calculate liked by traversing if user_id is present in likes2Collection.edges array or not

export default PostDataHelper;