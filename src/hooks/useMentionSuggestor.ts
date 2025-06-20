import { useState, useRef } from "react";

type User={
    id:string,
    profile_picture:string,
    tag_name: string,
    username:string
}

const Fetcher=(input:string,setSuggestions:React.Dispatch<React.SetStateAction<User[]>>,setError:React.Dispatch<React.SetStateAction<string | null>>,setLoading:React.Dispatch<React.SetStateAction<boolean>>)=>{   

    try{
        setError(null);
        setLoading(true);

        

    }catch{
        setError("Getting error while loading suggestions")
    }finally{
        setLoading(false);
    }

}

const useMentionSuggestor = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const ref:any=useRef(null);


    const fetchSuggestions=(inputValue:string)=>{
        if(ref.current!==null){
            clearTimeout(ref.current);
        }
        ref.current = setTimeout(()=>{   
            Fetcher(inputValue,setSuggestions,setError,setLoading);
        },500)
    }
    return {fetchSuggestions,loading,error,suggestions}
}
export default useMentionSuggestor;