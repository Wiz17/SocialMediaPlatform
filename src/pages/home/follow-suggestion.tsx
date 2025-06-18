import React, { useEffect } from "react";
import SuggestionCard from "../../components/suggestionCard.tsx";
import { useFetchUnfollowedUsers } from "../../hooks/useFetchUnfollowedUsers.tsx";
import UserCard from "../../components/user.tsx"
import SuspenseUIFollowSuggestion from "../../components/suspense/follow-suggestion.tsx";
import FollowSuggestionMobile from "../../components/suspense/follow-suggestion-mobile.tsx";
import SectionWrapper from "../../components/sectionWrapper.tsx";


const FollowSuggestion = () => {
    const userId: string = localStorage.getItem("id") || "";
    const { fetchUnfollowedUsers, users, loading1, error1 } = useFetchUnfollowedUsers(userId);
    useEffect(() => {
        fetchUnfollowedUsers();
    }, [])
    return (

        <>
            <section className="w-full mx-auto max-lg:hidden">
                <h1 className="text-white p-4 ">Suggested For You</h1>
                <SectionWrapper loading={loading1} error={error1 ? true : false} onRetry={() => fetchUnfollowedUsers()} loader={<SuspenseUIFollowSuggestion repeat={10} />}>
                    {
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
                    }
                </SectionWrapper>
            </section>

            <div className="lg:hidden">
                <h1 className="text-white mb-5">Suggested For You</h1>
                <SectionWrapper loading={loading1} error={error1 ? true : false} onRetry={() => fetchUnfollowedUsers()} loader={<FollowSuggestionMobile repeat={5} />}>
                    <div className="flex overflow-x-auto whitespace-nowrap space-x-4">
                        {
                            users.map((data, index) => (
                                <SuggestionCard
                                    key={index}
                                    name={data.username.trim()}
                                    userId={userId}
                                    followedId={data.id}
                                    photo={data.profile_picture}
                                    tagName={data.tag_name}
                                />
                            ))
                        }


                    </div>
                </SectionWrapper>
            </div>


        </>
    )
}

export default FollowSuggestion;