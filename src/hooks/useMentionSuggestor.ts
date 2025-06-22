import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";

type User = {
    id: string,
    profile_picture: string,
    tag_name: string,
    username: string
}

const Fetcher = async (input: string, setSuggestions: React.Dispatch<React.SetStateAction<User[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    const userId = localStorage.getItem('id');
    try {
        setError(null);
        setLoading(true);

        console.log(input)

        let { data: followers, error } = await supabase
            .from('followers')
            .select(
            `
                created_at,
                follower_id,
                users!followers_followed_id_fkey (
                  id,
                  username,
                  tag_name,
                  profile_picture
                 )
            `
            )
            .eq('follower_id', userId)
            .ilike('users.tag_name', `%${input}%`)
            .not('users', 'is', null) // This is the key addition
            .limit(4)
            .order('created_at', { ascending: false });

        console.log(followers)
        const newUserdata: any = followers?.map((data) => data.users) || [];
        setError(error?.message || null)
        setSuggestions(newUserdata);

    } catch {
        setError("Getting error while loading suggestions")
    } finally {
        setLoading(false);
    }

}

const useMentionSuggestor = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const ref: any = useRef(null);


    const fetchSuggestions = (inputValue: string) => {
        if (ref.current !== null) {
            clearTimeout(ref.current);
        }
        ref.current = setTimeout(() => {
            Fetcher(inputValue, setSuggestions, setError, setLoading);
        }, 500)
    }
    return { fetchSuggestions, loading, error, suggestions }
}
export default useMentionSuggestor;