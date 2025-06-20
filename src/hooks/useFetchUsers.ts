import { useState } from "react";

import { GET_USERS_FROM_IDS } from "../graphql/queries/home.ts";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";

type User={
    id:string,
    profile_picture:string,
    tag_name: string,
    username:string
}

const useFetchUsers=()=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [users,setUsers] = useState<User[]>([]);

    const fetchAllUsers=async(followerIds:[string])=>{
        try{
            setLoading(true)
            setError(null);
            const variables ={
                userIds:followerIds
            }
            const usersData = await fetchMutationGraphQL(GET_USERS_FROM_IDS, variables);
            const filteredData = usersData.usersCollection.edges.map((data) => ({
                id: data.node.id,
                profile_picture: data.node.profile_picture,
                tag_name: data.node.tag_name,
                username: data.node.username
            }))
            console.log(usersData)
            // setUsers(usersData);
            return filteredData;

        }catch{
            setError("Error in fetching all users.")
        }finally{
            setLoading(false)
        }
    }

    return { fetchAllUsers, loading , error , users }
}
export default useFetchUsers;