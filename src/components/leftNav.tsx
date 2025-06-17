import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { HomeSvg, LogoutSvg } from "../utils/svg.tsx";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { supabase } from "../supabaseClient";


const LeftNav = () => {
    const userId: string = localStorage.getItem("id") || "";
    const navigate = useNavigate();
    const [profilePhoto, setProfilePhoto] = useState<string>("");
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
    useEffect(() => {
        const fetchProfilePhoto = async () => {
            const { data, error } = await supabase
                .from("users")
                .select("profile_picture")
                .eq("id", userId);
            if (error) {
                console.error("Error fetching profile photo:", error.message);
            } else if (data && data.length > 0) {
                setProfilePhoto(data[0].profile_picture);
            }
        };
        fetchProfilePhoto();
    }, [userId])
    return (
        <>
            <section className="max-sm:hidden w-[15%] border-r border-r-gray-700  h-screen fixed top-0 left-0 bg-black">
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
                            badgeContent={1}
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
                        <Badge badgeContent={1} color="primary">
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
        </>
    )

}
export default LeftNav;