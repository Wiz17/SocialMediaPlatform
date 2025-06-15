import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostCard from "../components/posts.tsx";
import UserCard from "../components/user.tsx";
import { useFetchFeed } from "../hooks/useFetchFeed.tsx";
import { useFetchUnfollowedUsers } from "../hooks/useFetchUnfollowedUsers.tsx";
import { useFetchFollowedUsers } from "../hooks/useFetchFollowedUsers.tsx";
import { useAddPost } from "../hooks/useAddPost.tsx";
import { useFileUploader } from "../hooks/useFileUploader.tsx";
import { useState } from "react";
// import { createClient } from "@supabase/supabase-js";
import { useGenerateNotification } from "../hooks/useGenerateNotification.tsx";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IS_NOTIFICATION, LIKED_POSTS_FETCH, LIKED_POSTS_HANDLE } from "../graphql/queries.tsx";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { supabase } from "../supabaseClient.jsx";
import { FETCH_USER } from "../graphql/queries.tsx";
import SuggestionCard from "../components/suggestionCard.tsx";
import { HomeSvg, CameraSvg, LogoutSvg } from "../utils/svg.tsx";
const Home: React.FC = () => {
  const userId: string = localStorage.getItem("id") || "";
  const { posts, loading, error } = useFetchFeed(userId);
  const { users, loading1, error1 } = useFetchUnfollowedUsers(userId);
  const { users2, loading5, error5 } = useFetchFollowedUsers(userId);
  const { addPost, loading2, error2 } = useAddPost();
  const { uploadFile, uploading, error3 } = useFileUploader();
  const { generateNotification, loading4, data, error4 } =
    useGenerateNotification();

  const [inputValue, setInputValue] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [section, setSection] = useState<boolean>(true);
  const navigate = useNavigate();

  console.log(users2);

  const formSubmitHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      const uploadedUrl = await uploadFile(file, "post-images");

      const input = e.target[0].value;
      const words = input.split(/\s+/);

      // Filter words that start with @
      const result = words.filter((word: string) => word.startsWith("@"));
      if (result.length != 0) {
        generateNotification(result, userName) //replace it with logged in person userName
          .then((result) => console.log("Updated Notifications:", result))
          .catch((err) => console.error("Error in Notification:", err));
      }
      addPost(userId, e.target[0].value, uploadedUrl.data.publicUrl);
      setFile(null);
    } else {
      const input = e.target[0].value;
      const words = input.split(/\s+/);

      // Filter words that start with @
      const result = words.filter((word: string) => word.startsWith("@"));
      if (result.length != 0) {
        generateNotification(result, userName) //replace it with logged in person userName
          .then((result) => console.log("Updated Notifications:", result))
          .catch((err) => console.error("Error in Notification:", err));
      }

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
  const calculateTimeAgo = (timestamp: string): string => {
    const givenTime = new Date(timestamp);
    const currentTime = new Date();

    // Reduce 5 hours (5 * 60 * 60 * 1000 milliseconds) from the given timestamp
    givenTime.setTime(givenTime.getTime() + 5 * 60 * 60 * 1000);

    const diffMilliseconds = currentTime.getTime() - givenTime.getTime();
    const diffSeconds = Math.floor(diffMilliseconds / 1000); // Convert to seconds
    const diffMinutes = Math.floor(diffSeconds / 60); // Convert to minutes

    if (diffMinutes >= 1440) {
      // 1440 minutes in a day
      const days = Math.floor(diffMinutes / 1440); // Convert minutes to days
      return `${days} d`;
    } else if (diffMinutes >= 60) {
      const hours = Math.floor(diffMinutes / 60); // Convert minutes to hours
      return `${hours} h`;
    } else if (diffSeconds >= 60) {
      return `${diffMinutes} m`;
    } else {
      return `${diffSeconds} s`;
    }
  };
  useEffect(() => {
    const func = async () => {
      const variables = { userId };

      try {
        const data = await fetchMutationGraphQL(IS_NOTIFICATION, variables);
        setNotification(
          data.usersCollection.edges[0].node.tag_notification ? 1 : 0
        );
        console.log(
          data.usersCollection.edges[0].node.tag_notification ? 1 : 0
        );
      } catch (error) {
        console.error("Error fetching notification:", error);
      }

      try {
        const data = await fetchMutationGraphQL(FETCH_USER, variables);
        setUserName(data.usersCollection.edges[0].node.username);
        setProfilePhoto(data.usersCollection.edges[0].node.profile_picture);

        console.log(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    func();
  }, []);
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      alert("Failed to log out. Please try again.");
    } else {
      console.log("Successfully logged out!");
      localStorage.removeItem("id");
      localStorage.removeItem("email");
      alert("You have been logged out.");
      navigate("/login");
    }
  };


  const [dataLikedPosts, setDataLikedPosts] = useState<string[]>([]);
  useEffect(() => {
    const func = async () => {
      const data = await fetchMutationGraphQL(LIKED_POSTS_FETCH, { userId });
      setDataLikedPosts(data.usersCollection.edges[0].node.liked_posts)
    }
    func();

  }, [])

  if (!userId) {
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
    );
  }
  return (
    <>
      {/* <h1>PRODUCTION DEPLOY CHECK!!!!!</h1>
      <h1>Check for project setup!!</h1> */}

      <div className="bg-black flex ">
        <div className="max-sm:hidden w-[15%]">.</div>
        <div className="fixed bottom-0 flex bg-black w-full items-center justify-around py-3 sm:hidden">
          <img
            src={profilePhoto}
            alt=""
            className="object-cover w-12 h-12 rounded-[50%]"
          />
          <div className=" flex justify-end">

            <Link to="/">
              <HomeSvg />
            </Link>
          </div>
          <div className=" flex justify-end">
            <Link to="/notifications">
              <Badge badgeContent={notification} color="primary">
                <NotificationsIcon sx={{ color: "white", fontSize: "40px" }} />
              </Badge>
            </Link>
          </div>
          <div className=" flex justify-end">
            {userId ? (
              <button
                onClick={handleLogout}
                className=" text-white rounded-lg "
              >
                <LogoutSvg />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 font-bold text-white py-2 px-4 rounded-lg"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <section className="max-sm:hidden w-[15%] border-r border-r-gray-700  h-screen fixed top-0 left-0">
          <div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/800px-X_logo.jpg"
              alt="logo"
              className="w-16 h-16 ml-auto mr-4"
            />
          </div>
          <div className=" flex justify-end">

          <Link to="/" className="mr-7 mt-3">
            <HomeSvg />
          </Link>
          </div>
          <div className="mt-8 flex justify-end">
            <Link to="/notifications">
              <Badge
                badgeContent={notification}
                color="primary"
                sx={{ marginRight: "30px" }}
              >
                <NotificationsIcon sx={{ color: "white", fontSize: "40px" }} />
              </Badge>
            </Link>
          </div>
          <div className="mt-6 flex justify-end mr-5">
            {userId ? (
              <button
                onClick={handleLogout}
                className=" text-white py-2 pr-2.5 rounded-lg "
              >
                <LogoutSvg />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 font-bold text-white py-2 px-4 rounded-lg"
                >
                  Login
                </Link>
              </>
            )}
          </div>
          <div className="absolute bottom-5 right-5">
            <img
              src={profilePhoto}
              alt=""
              className="object-cover w-12 h-12 rounded-[50%]"
            />
          </div>
        </section>
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
              {loading ? (
                <h1 className="text-white text-2xl p-3">Loading.....</h1>
              ) : posts.length === 0 ? ( // Check if the users array is empty
                <h1 className="text-white text-2xl p-3">
                  Follow to see feed!!
                </h1>
              ) : (
                <div className="p-4">
                  {posts.map((data) => {
                    const timeAgo = calculateTimeAgo(data.created_at);
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
                        dataArr={dataLikedPosts}
                        dataArrSetState={setDataLikedPosts}
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
        <section className="w-[35%] max-lg:hidden">
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
      </div>
    </>
  );
};

export default Home;
