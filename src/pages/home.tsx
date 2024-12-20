import React, { useEffect , useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import PostCard from "../components/posts.tsx";
import UserCard from "../components/user.tsx";
import { useFetchFeed } from "../hooks/useFetchFeed.tsx";
import { useFetchUnfollowedUsers } from "../hooks/useFetchUnfollowedUsers.tsx";
import { useFetchFollowedUsers } from "../hooks/useFetchFollowedUsers.tsx";
import { useAddPost } from "../hooks/useAddPost.tsx";
import { useFileUploader } from "../hooks/useFileUploader.tsx";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useGenerateNotification } from "../hooks/useGenerateNotification.tsx";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IS_NOTIFICATION, LIKED_POSTS_FETCH, LIKED_POSTS_HANDLE } from "../graphql/queries.tsx";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { supabase } from "../supabaseClient.jsx";
import { FETCH_USER } from "../graphql/queries.tsx";
import SuggestionCard from "../components/suggestionCard.tsx";

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


  const [dataLikedPosts , setDataLikedPosts] = useState<string[]>([]);
  useEffect(()=>{
    const func=async()=>{
      const data = await fetchMutationGraphQL(LIKED_POSTS_FETCH,{userId});
      setDataLikedPosts(data.usersCollection.edges[0].node.liked_posts)
    }
    func();
    
  },[])

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
    {/* <h1>PRODUCTION DEPLOY CHECK!!!!!</h1> */}
      <div className="bg-black flex ">
        <div className="max-sm:hidden w-[15%]">.</div>
        <div className="fixed bottom-0 flex bg-black w-full items-center justify-around py-3 sm:hidden">
          <img
            src={profilePhoto}
            alt=""
            className="object-cover w-12 h-12 rounded-[50%]"
          />
          <Link to="/">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 "
            >
              <g>
                <path
                  d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"
                  fill="white"
                ></path>
              </g>
            </svg>
          </Link>
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
                <svg
                  fill="#ff0000"
                  height="30px"
                  width="30px"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-38.5 -38.5 461.97 461.97"
                  stroke="#ff0000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <g id="Sign_Out">
                        {" "}
                        <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03 C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03 C192.485,366.299,187.095,360.91,180.455,360.91z"></path>{" "}
                        <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279 c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179 c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"></path>{" "}
                      </g>{" "}
                      <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
                    </g>{" "}
                  </g>
                </svg>
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
          <Link to="/">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 ml-auto mr-7 mt-4"
            >
              <g>
                <path
                  d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"
                  fill="white"
                ></path>
              </g>
            </svg>
          </Link>
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
                <svg
                  fill="#ff0000"
                  height="30px"
                  width="30px"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-38.5 -38.5 461.97 461.97"
                  stroke="#ff0000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <g id="Sign_Out">
                        {" "}
                        <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03 C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03 C192.485,366.299,187.095,360.91,180.455,360.91z"></path>{" "}
                        <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279 c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179 c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"></path>{" "}
                      </g>{" "}
                      <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
                    </g>{" "}
                  </g>
                </svg>
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
              className={`hover:bg-zinc-800 w-full text-center py-3 cursor-pointer ${
                section && "underline"
              }`}
              onClick={() => setSection(true)}
            >
              For you
            </button>
            <button
              className={`hover:bg-zinc-800 w-full text-center py-3 cursor-pointer ${
                !section && "underline"
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        //   xmlns:xlink="http://www.w3.org/1999/xlink"
                        height="20px"
                        width="20px"
                        version="1.1"
                        id="Capa_1"
                        viewBox="0 0 15.479 15.479"
                        //   xml:space="preserve"
                      >
                        <g>
                          <g>
                            <path
                              style={{ fill: "#3b82f6" }}
                              d="M0.318,3.357h6.936l1.397-1.455c0,0-6.411,0-7.466,0c-1.054,0-0.878,0.76-0.878,0.76L0.318,3.357z"
                            />
                            <path
                              style={{ fill: "#3b82f6" }}
                              d="M14.89,1.814h-4.438c-0.168,0-0.329,0.072-0.44,0.199L8.283,3.97H0.589C0.264,3.97,0,4.233,0,4.558    v8.519c0,0.325,0.264,0.588,0.589,0.588H14.89c0.325,0,0.589-0.263,0.589-0.588V2.403C15.479,2.078,15.216,1.814,14.89,1.814z     M14.302,12.488H1.177V5.146h7.372c0.169,0,0.328-0.072,0.44-0.198l1.729-1.958h3.583v9.498H14.302z"
                            />
                            <path
                              style={{ fill: "#3b82f6" }}
                              d="M10.99,6.748H9.504L9.379,6.376c0-0.125-0.144-0.228-0.323-0.228H7.678    c-0.179,0-0.325,0.102-0.325,0.228L7.229,6.748H7.018H5.806V6.444H4.937v0.304H4.804c-0.284,0-0.515,0.23-0.515,0.515v3.662    c0,0.285,0.231,0.516,0.515,0.516h5.832c0.755,0,0.869-0.23,0.869-0.516V7.263C11.505,6.978,11.273,6.748,10.99,6.748z     M8.118,10.576c-0.853,0-1.547-0.692-1.547-1.546s0.694-1.546,1.547-1.546c0.854,0,1.546,0.692,1.546,1.546    C9.664,9.884,8.972,10.576,8.118,10.576z"
                            />
                            <circle
                              style={{ fill: "#3b82f6" }}
                              cx="8.094"
                              cy="9.03"
                              r="0.98"
                            />
                          </g>
                        </g>
                      </svg>
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
