import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../../components/posts.tsx";
import UserCard from "../../components/user.tsx";
import { useFetchFeed } from "../../hooks/useFetchFeed.tsx";
import { useFetchFollowedUsers } from "../../hooks/useFetchFollowedUsers.tsx";
import { useAddPost } from "../../hooks/useAddPost.tsx";
import { useFileUploader } from "../../hooks/useFileUploader.tsx";
import { useState } from "react";
// import { createClient } from "@supabase/supabase-js";
import { CameraSvg } from "../../utils/svg.tsx";
import CalculateTimeAgo from "../../helper/calculate-time-ago.ts";
import LeftNav from "../../components/leftNav.tsx";
import FollowSuggestion from "./follow-suggestion.tsx";

const HomeFeedsPage = () => {
  const userId: string = localStorage.getItem("id") || "";
  const { fetchFeed, posts, loading, error } = useFetchFeed(userId);
  const { fetchFollowedUsers, users2, loading5, error5 } = useFetchFollowedUsers(userId);
  const { addPost, loading2, error2 } = useAddPost();
  const { uploadFile, uploading, error3 } = useFileUploader();
  const [inputValue, setInputValue] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [section, setSection] = useState<boolean>(true);
  // const [dataLikedPosts, setDataLikedPosts] = useState<string[]>([]);
  useEffect(() => {
    fetchFeed();
    fetchFollowedUsers();
  }, [])

  const formSubmitHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      const uploadedUrl = await uploadFile(file, "post-images");
      addPost(userId, e.target[0].value, uploadedUrl.data.publicUrl);
      setFile(null);
    } else {
      addPost(userId, e.target[0].value, "");
      alert("Posted Successfully!!");
      setFile(null);
    }
    setInputValue("");
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  return (
    <>
      <div className="bg-black flex ">
        <div className="max-sm:hidden w-[15%]">.</div>
        <LeftNav />
        <section className="w-full sm:w-[85%] lg:w-[50%] border-r border-r-gray-700 min-h-screen max-sm:pb-10">
          <div className="flex text-white justify-around items-center border-b border-b-gray-700">
            <button
              className={`hover:bg-zinc-800 w-full text-center py-3 cursor-pointer ${section && "underline"
                }`}
              onClick={() => setSection(true)}
            >
              For you
            </button>
            <button
              className={`hover:bg-zinc-800 w-full text-center py-3 cursor-pointer ${!section && "underline"
                }`}
              onClick={() => setSection(false)}
            >
              Following
            </button>
          </div>
          {section ? (
            <>
              <div>
                <form onSubmit={formSubmitHandle}>
                  <input
                    type="text"
                    placeholder="What is happening?!"
                    className="text-white bg-transparent text-xl p-4 border-none hover:border-none focus:outline-none w-full"
                    value={inputValue}
                    required
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div className="p-4 flex justify-between items-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden" // Hide the input but keep it functional
                      />
                      <CameraSvg />
                    </label>

                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 focus:outline-none font-bold"
                      disabled={loading2}
                    >
                      {loading2 ? "Posting..." : "Post"}
                    </button>
                  </div>
                  <div className="h-[0.5px] bg-gray-700 w-[95%] mx-auto"></div>
                </form>
              </div>
              <div className="lg:hidden p-4">
                <FollowSuggestion />
              </div>

              {/* responsive sugest card */}
              {loading ? (
                <h1 className="text-white text-2xl p-3">Loading.....</h1>
              ) : posts.length === 0 ? ( // Check if the users array is empty
                <h1 className="text-white text-2xl p-3">
                  Follow to see feed!!
                </h1>
              ) : (
                <div className="p-4">
                  {posts.map((data) => {
                    const timeAgo = CalculateTimeAgo(data.created_at);
                    // console.log(data)
                    return (
                      <PostCard
                        key={data.id}
                        id={data.id}
                        name={data.users.username}
                        userImg={data.users.profile_picture}
                        content={data.content}
                        timeAgo={timeAgo}
                        postImg={data.image}
                        tagName={data.users.tag_name}
                        likes={data.likes}
                        liked={data.liked}
                      // dataArr={dataLikedPosts}
                      // dataArrSetState={setDataLikedPosts}
                      />
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
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
            </>
          )}

        </section>
        <div className="w-[35%] max-lg:hidden">
          <FollowSuggestion />
        </div>

      </div>
    </>
  )

}

const NoUseridPageHandle = () => {
  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gradient-to-r bg-black ">
        <div className="text-center bg-gray-800 rounded-lg shadow-lg p-8 max-w-sm">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">
            Please Login to Continue!
          </h1>
          <p className="text-gray-100 mb-6">
            You need to log in to access this page. If you don’t have an
            account, sign up now!
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )

}

const Home: React.FC = () => {

  const userId: string = localStorage.getItem("id") || "";
  return userId ? <HomeFeedsPage /> : <NoUseridPageHandle />;
};

export default Home;
