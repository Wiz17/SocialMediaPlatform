import React from "react"
import SuspenseUIFollowSuggestion from "../../components/suspense/follow-suggestion.tsx"
import UserCard from '../../components/user.tsx'
import SectionWrapper from "../../components/sectionWrapper.tsx";

const userId: string = localStorage.getItem("id") || "";
const FollowingTab = ({ fetchFollowedUsers, users2, loading5, error5 }) => {

  const refreshHandle = () => {
    fetchFollowedUsers();
  }
  console.log(users2)
  return (
    <>
      <SectionWrapper loading={loading5} error={error5} onRetry={() => refreshHandle()} loader={<SuspenseUIFollowSuggestion repeat={10} />}>
        <div>
          {users2.length === 0 ? (
            <div className="w-full sm:w-2/3 mx-auto text-center py-16">
              <h1 className="text-lg text-gray-200 font-semibold">No users followed yet</h1>
              <p className="text-sm text-gray-500 mt-2">
                When you follow someone, they will appear here.
              </p>
            </div>
          ) : (
            <div className="w-full sm:w-2/3 mx-auto">
              {users2.map((data) => (
                <div className="p-4" key={data.id}>
                  <UserCard
                    name={data.username.trim()}
                    userId={userId}
                    followedId={data.id}
                    profilePicture={data.profile_picture}
                    suggestion={false}
                    followerCreatedId={data.followedId}
                    tagName={data.tag_name}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>
    </>
  )
}
//use .memo here
export default React.memo(FollowingTab)
