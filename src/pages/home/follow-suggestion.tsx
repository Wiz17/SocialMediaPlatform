import React, { useEffect, useState } from "react";
import SuggestionCard from "../../components/suggestionCard.tsx";
import { useFetchUnfollowedUsers } from "../../hooks/useFetchUnfollowedUsers.tsx";
import UserCard from "../../components/user.tsx";
import SuspenseUIFollowSuggestion from "../../components/suspense/follow-suggestion.tsx";
import FollowSuggestionMobile from "../../components/suspense/follow-suggestion-mobile.tsx";
import SectionWrapper from "../../components/sectionWrapper.tsx";
import { Loader2 } from "lucide-react";

const FollowSuggestion = () => {
  const userId: string = localStorage.getItem("id") || "";
  const { fetchUnfollowedUsers, loadMore, users, loading1, error1 } =
    useFetchUnfollowedUsers(userId);
  const [currentPage, setCurrentPage] = useState(0);
  const [seemoreLoader, setSeemoreLoader] = useState(false);
  const USERS_PER_PAGE = 5;

  useEffect(() => {
    loadInitialUsers();
  }, []);

  const loadInitialUsers = async () => {
    setCurrentPage(0);
    await fetchUnfollowedUsers(0, USERS_PER_PAGE);
  };

  const loadMoreUsers = async () => {
    const nextPage = currentPage + 1;
    setSeemoreLoader(true);

    try {
      await loadMore(nextPage, USERS_PER_PAGE);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more users:", error);
    }
  };

  return (
    <>
      <section className="w-full mx-auto max-lg:hidden">
        <h1 className="text-white p-4">Suggested For You</h1>
        <SectionWrapper
          loading={loading1 && !seemoreLoader}
          error={error1 ? true : false}
          onRetry={loadInitialUsers}
          loader={<SuspenseUIFollowSuggestion repeat={10} />}
        >
          {users.map((data) => (
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
          ))}
          <div className="p-4 w-full flex justify-center">
            {loading1 ? (
              <div className="animate-spin">
                <Loader2 className="text-white" />
              </div>
            ) : (
              <button
                onClick={loadMoreUsers}
                className="text-gray-600 hover:text-gray-300 hover:underline"
              >
                See More
              </button>
            )}
          </div>
        </SectionWrapper>
      </section>

      <div className="lg:hidden">
        <h1 className="text-white mb-5">Suggested For You</h1>
        <SectionWrapper
          loading={loading1 && !seemoreLoader}
          error={error1 ? true : false}
          onRetry={loadInitialUsers}
          loader={<FollowSuggestionMobile repeat={5} />}
        >
          <div className="flex overflow-x-auto whitespace-nowrap space-x-4 pb-4">
            {users.map((data, index) => (
              <SuggestionCard
                key={data.id} // Use data.id instead of index for better key
                name={data.username.trim()}
                userId={userId}
                followedId={data.id}
                photo={data.profile_picture}
                tagName={data.tag_name}
              />
            ))}
            <div className="h-auto flex items-center">
              {loading1 ? (
                <div className="animate-spin">
                  <Loader2 className="text-white" />
                </div>
              ) : (
                <button
                  onClick={loadMoreUsers}
                  className="text-gray-600 hover:text-gray-300 hover:underline"
                >
                  See More
                </button>
              )}
            </div>
          </div>
        </SectionWrapper>
      </div>
    </>
  );
};

export default FollowSuggestion;
