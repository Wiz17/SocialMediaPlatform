import React, { useEffect } from "react";
import SuggestionCard from "../../components/suggestionCard.tsx";
import { useFetchUnfollowedUsers } from "../../hooks/useFetchUnfollowedUsers.tsx";
import UserCard from "../../components/user.tsx"
const FollowSuggestion = () => {
    const userId: string = localStorage.getItem("id") || "";
    const { fetchUnfollowedUsers, users, loading1, error1 } = useFetchUnfollowedUsers(userId);
    useEffect(() => {
        fetchUnfollowedUsers();
    }, [])
    return (

        <>
            <section className="w-full mx-auto max-lg:hidden">
                <h1 className="text-white p-4">Suggested For You</h1>
                {loading1 ? (
                    <h1 className="text-white text-2xl p-3">Loading.....</h1>
                ) : (
                    users.map((data) => (
                        <div className="p-4" key={data.id}>
                            <UserCard
                                name={data.username.trim()}
                                userId={userId}
                                followedId={data.id}
                                profilePicture={data.profile_picture}
                                suggestion={true}
                                followerCreatedId=""
                                tagName={data.tag_name}
                            />
                        </div>
                    ))
                )}
            </section>
            <div className="lg:hidden">
                <h1 className="text-white">Suggestions for you.</h1>
                <div className="flex overflow-x-auto whitespace-nowrap space-x-4 mt-5">
                    {users.map((data, index) => (
                        <SuggestionCard
                            key={index}
                            name={data.username.trim()}
                            userId={userId}
                            followedId={data.id}
                            photo={data.profile_picture}
                            tagName={data.tag_name}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default FollowSuggestion;