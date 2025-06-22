import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PostCard from "../../components/posts.tsx";
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
import PostFeedSuspence from '../../components/suspense/post-feed.tsx'
import FollowingTab from "./following-tab.tsx";
import SectionWrapper from "../../components/sectionWrapper.tsx";
import { X } from "lucide-react";
import { toast } from "sonner";
import DetectMentionInPost from "../../helper/detect-mention-in-post.ts";
import MentionSuggestionModal from "../../components/mentionSuggestionModal.tsx";
import useMentionSuggestor from "../../hooks/useMentionSuggestor.ts";

const HomeFeedsPage = () => {
  const userId: string = localStorage.getItem("id") || "";
  const { fetchFeed, posts, loading, error } = useFetchFeed(userId);
  const { addPost, loading2, error2: errorInPosting } = useAddPost();
  const { uploadFile, uploading, error3: uploadingError } = useFileUploader();
  const { fetchFollowedUsers, users2, loading5, error5 } = useFetchFollowedUsers(userId);
  const {fetchSuggestions,loading:loading6,error:error6,suggestions}=useMentionSuggestor();

  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [section, setSection] = useState(true);
  const [imgUrl, setImgUrl] = useState("")
  const [openMentionModal, setOpenMentionModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchFeed();
    fetchFollowedUsers();
    
  }, [])

  const formSubmitHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      const uploadedUrl = await uploadFile(file, "post-images");
      console.log(uploadingError, uploadedUrl)
      if (uploadingError || uploadedUrl === null) {
        toast.error("Failed to upload image.")
        return;
      }
      addPost(userId, inputValue, uploadedUrl.data.publicUrl);
      if (errorInPosting) {
        toast.error("Failed to make post.")
        return;
      }
      toast.success("Posted Successfully!!")

    } else {
      addPost(userId, inputValue, "");
      if (errorInPosting) {
        toast.error("Failed to make post.")
        return;
      }
      toast.success("Posted Successfully!!")

    }
    setFile(null);
    setInputValue("");
    setImgUrl("")
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);

      setImgUrl(URL.createObjectURL(e.target.files[0]))
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const mentionedName = DetectMentionInPost(e);
    
    if (mentionedName) {
      setOpenMentionModal(true);
      fetchSuggestions(mentionedName);
      return
    }

    setOpenMentionModal(false)
    
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  return (
    <>
      <div className="bg-black flex">
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
              <div className="w-10/12 mx-auto pt-6">
                <form onSubmit={formSubmitHandle} className="flex flex-col gap-3">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      placeholder="What is happening?!"
                      className="text-white bg-transparent text-xl border-none hover:border-none focus:outline-none w-full resize-none overflow-hidden min-h-[1.5rem]"
                      value={inputValue}
                      required
                      onChange={handleInputChange}
                      onInput={handleInput}
                      rows={1}
                    />
                    <MentionSuggestionModal
                      open={openMentionModal}
                      onClose={() => setOpenMentionModal(false)}
                      textareaRef={textareaRef}
                      mentionSuggestionData={
                        suggestions

                      }
                    />
                  </div>

                  <div className="relative">
                    <img src={imgUrl} className="w-full object-cover" />
                    {imgUrl && <button className="absolute -top-2 -right-2 bg-gray-900 text-white p-2 rounded-full" onClick={() => setImgUrl("")}>

                      <X />
                    </button>}
                  </div>


                  <div className="flex justify-between items-center">
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
                      className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 focus:outline-none font-bold disabled:bg-gray-400 disabled:text-black disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                      disabled={loading2 || uploading || inputValue.length === 0}
                    >
                      {loading2 || uploading ? "Posting..." : "Post"}
                    </button>
                  </div>
                </form>
              </div>
              <div className="lg:hidden p-4">
                <FollowSuggestion />
              </div>

              <SectionWrapper loading={loading} error={error ? true : false} onRetry={() => fetchFeed()} loader={<PostFeedSuspence repeat={5} />}>
                {posts.length === 0 ? ( // Check if the users array is empty
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
              </SectionWrapper>
            </>
          ) : (
            <>
              <FollowingTab fetchFollowedUsers={fetchFollowedUsers} users2={users2} loading5={loading5} error5={error5} />
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
