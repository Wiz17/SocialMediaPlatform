import React, { useState } from "react";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect } from "react";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { IS_NOTIFICATION } from "../graphql/queries.tsx";
import { supabase } from "../supabaseClient.jsx";
import { useNavigate } from "react-router-dom";
const Notifications: React.FC = () => {
  const userId = localStorage.getItem('id'); // Replace with the actual logged-in user ID
  const [taggedUser , setTaggedUser] = useState("");
  const [profilePic , setProfilePic] = useState("");
  const navigate=useNavigate();

  useEffect(() => {
    const func = async () => {
      const variables = { userId };

      try {
        const data = await fetchMutationGraphQL(IS_NOTIFICATION, variables);

        setTaggedUser(data.usersCollection.edges[0].node.tagged_user)
        setProfilePic(data.usersCollection.edges[0].node.profile_picture)
        console.log(data.usersCollection.edges[0].node)

      } catch (error) {
        console.error("Error fetching notification:", error);
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

      // Optionally redirect the user after logout
      navigate("/login");
    }
  };
  return (
    <>
      <div className="flex">
        <div className="max-sm:hidden w-[15%]"></div>
        <div className="fixed bottom-0 flex bg-black w-full items-center justify-around py-3 sm:hidden">
          <img
            src={profilePic}
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
              <Badge
                badgeContent={0}
                color="primary"
                
              >
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
        <section className="w-[15%] border-r border-r-gray-700  h-screen fixed top-0 left-0 bg-black max-sm:hidden">
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
          <div className="mt-10 flex justify-end">
            <Link to="/notifications">
              <Badge
                badgeContent={0}
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
        </section>
        <section className="w-full sm:w-[85%] border-r-gray-700  min-h-screen bg-black p-5">
        <h2 className="text-gray-50 text-3xl font-semibold">Notifications</h2>
        <div className="mt-10">
        <img
            src="https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png"
            alt=""
            className="object-cover w-12 h-12 rounded-[50%]"
          />
          <p className="text-gray-50 font-bold mt-1">{taggedUser}</p>
          <p className="text-gray-400 mt-1">Mentioned you in their post!!</p>
        </div>
        </section>
        

      </div>
    </>
  );
};
export default Notifications;
