import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeSvg, LogoutSvg } from "../utils/svg.tsx";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { Settings } from "lucide-react";

const LeftNav = () => {
  const userId: string = localStorage.getItem("id") || "";
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Failed to log out. Please try again.");
    } else {
      localStorage.removeItem("id");
      localStorage.removeItem("email");
      toast.success("You have been logged out.");
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
  }, [userId]);
  return (
    <>
      <section className="max-sm:hidden w-[15%] border-r border-r-gray-700  h-screen fixed top-0 left-0 bg-black flex flex-col gap-7 pr-5 pt-3">
        <div className="flex justify-end">
          <img
            src="https://arxkebsmrbstwstaxbig.supabase.co/storage/v1/object/public/post-images/uploads/socialX.png"
            alt="logo"
            className="w-12 h-12 -mb-3 -mr-2"
          />
        </div>
        <div className=" flex justify-end">
          <Link to="/" className="">
            <HomeSvg className="w-8 h-8" />
          </Link>
        </div>
        <div className="flex justify-end">
          <Link to="/notifications">
            <Badge badgeContent={1} color="primary">
              <NotificationsIcon sx={{ color: "white", fontSize: "35px" }} />
            </Badge>
          </Link>
        </div>

        <div className="flex justify-end">
          <Link to="/updates">
            <Badge badgeContent={1} color="primary">
              <Settings className="w-8 h-8 text-white" />
            </Badge>
          </Link>
        </div>
        <div className="flex justify-end">
          <button onClick={handleLogout} className=" text-white rounded-lg ">
            <LogoutSvg className="w-8 h-8" />
          </button>
        </div>
        <div className="absolute bottom-5 right-5">
          <img
            src={profilePhoto}
            alt=""
            className="object-cover w-11 h-11 rounded-[50%]"
          />
        </div>
      </section>
      <div className="fixed bottom-0 flex bg-black w-full items-center justify-evenly py-3 sm:hidden z-10 border-t border-gray-800">
        <div className="flex items-center justify-center">
          <img
            src={profilePhoto}
            alt="Profile"
            className="object-cover w-10 h-10 rounded-full"
          />
        </div>

        <div className="flex items-center justify-center">
          <Link to="/">
            <HomeSvg className="w-9 h-9" />
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <Link to="/notifications">
            <Badge badgeContent={1} color="primary">
              <NotificationsIcon sx={{ color: "white", fontSize: "36px" }} />
            </Badge>
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <Link to="/updates">
            <Badge badgeContent={1} color="primary">
              <Settings className="w-8 h-8 text-white" />
            </Badge>
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <button onClick={handleLogout} className="text-white rounded-lg">
            <LogoutSvg className="w-8 h-8" />
          </button>
        </div>
      </div>
    </>
  );
};
export default LeftNav;
