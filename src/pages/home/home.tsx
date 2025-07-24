//implement updates info tab.
import React, { useEffect, useRef } from "react";
import PostCard from "../../components/posts.tsx";
import { useFetchFeed } from "../../hooks/useFetchFeed.tsx";
import { useFetchFollowedUsers } from "../../hooks/useFetchFollowedUsers.tsx";
import { useAddPost } from "../../hooks/useAddPost.tsx";
import { useFileUploader } from "../../hooks/useFileUploader.tsx";
import { useState } from "react";
import { CameraSvg } from "../../utils/svg.tsx";
import CalculateTimeAgo from "../../helper/calculate-time-ago.ts";
import FollowSuggestion from "./follow-suggestion.tsx";
import PostFeedSuspence from "../../components/suspense/post-feed.tsx";
import FollowingTab from "./following-tab.tsx";
import SectionWrapper from "../../components/sectionWrapper.tsx";
import { X } from "lucide-react";
import { toast } from "sonner";
import DetectMentionInPost from "../../helper/detect-mention-in-post.ts";
import MentionSuggestionModal from "../../components/mentionSuggestionModal.tsx";
import useMentionSuggestor from "../../hooks/useMentionSuggestor.ts";
import NoPostFoundUI from "./noPostFoundUI.tsx";

const HomeFeedsPage = () => {
  const userId: string = localStorage.getItem("id") || "";
  const { fetchFeed, posts, loading, error, loadMore, hasMore } =
    useFetchFeed(userId);
  // console.log(posts.length);
  const { addPost, loading2, error2: errorInPosting } = useAddPost();
  const { uploadFile, uploading, error3: uploadingError } = useFileUploader();
  const { fetchFollowedUsers, users2, loading5, error5 } =
    useFetchFollowedUsers(userId);
  const { fetchSuggestions, suggestions } = useMentionSuggestor();
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [section, setSection] = useState(true);
  const [imgUrl, setImgUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [openMentionModal, setOpenMentionModal] = useState(false);
  const [showMorePosts, setShowMorePosts] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formSubmitHandle = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      // Handle file upload if file exists
      if (file) {
        try {
          const uploadedUrl = await uploadFile(file, "post-images");

          if (!uploadedUrl?.data?.publicUrl) {
            throw new Error("Failed to get image URL");
          }

          imageUrl = uploadedUrl.data.publicUrl;
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to upload image. Please try again.");
          return; // Exit early if upload fails
        }
      }

      // Create the post
      try {
        const result = await addPost(userId, inputValue, imageUrl);

        if (!result) {
          throw new Error("Failed to create post");
        }

        // Success - clear form and show success message
        toast.success("Posted Successfully!");

        // Clear form only on success
        removeFile(); // Use the removeFile function
        setInputValue("");
      } catch (postError) {
        console.error("Post creation error:", postError);
        toast.error("Failed to create post. Please try again.");
        // Don't clear form on error so user can retry
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file size (3MB = 3 * 1024 * 1024 bytes)
      const maxSize = 3 * 1024 * 1024; // 3 MB in bytes

      if (selectedFile.size > maxSize) {
        const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
        toast.error(
          `File size is ${fileSizeMB}MB. Please select a file smaller than 3MB.`,
        );
        // Clear the input
        e.target.value = "";
        return;
      }

      // Clean up previous object URLs to prevent memory leaks
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }

      // Clear both URLs first
      setImgUrl("");
      setVideoUrl("");

      // Set the file
      setFile(selectedFile);

      // Create new object URL based on file type
      if (selectedFile.type.startsWith("image/")) {
        const newImageUrl = URL.createObjectURL(selectedFile);
        setImgUrl(newImageUrl);
      } else if (selectedFile.type.startsWith("video/")) {
        const newVideoUrl = URL.createObjectURL(selectedFile);
        setVideoUrl(newVideoUrl);
      } else {
        toast.error("Please select a valid image or video file.");
        e.target.value = "";
        setFile(null);
        return;
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValue(e.target.value);
    const mentionedName = DetectMentionInPost(e);

    if (mentionedName) {
      setOpenMentionModal(true);
      fetchSuggestions(mentionedName);
      return;
    }

    setOpenMentionModal(false);
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
  };

  const loadMorePost = () => {
    setShowMorePosts(true);
    loadMore();
  };

  const removeFile = () => {
    // Revoke object URLs to prevent memory leaks
    if (imgUrl) {
      URL.revokeObjectURL(imgUrl);
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    // Clear all states
    setFile(null);
    setImgUrl("");
    setVideoUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      // Clean up object URLs when component unmounts
      if (imgUrl) URL.revokeObjectURL(imgUrl);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, []);
  return (
    <>
      <div className="bg-black flex">
        <div className="max-sm:hidden w-[15%]">.</div>

        {/* <LeftNav /> */}
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
              <div className="w-10/12 mx-auto pt-6">
                <form
                  onSubmit={formSubmitHandle}
                  className="flex flex-col gap-3"
                >
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
                      textareaRef={
                        textareaRef as React.RefObject<HTMLTextAreaElement>
                      }
                      mentionSuggestionData={suggestions}
                    />
                  </div>

                  <div className="relative">
                    {videoUrl && (
                      <>
                        <video
                          src={videoUrl}
                          className="w-full object-contains rounded-lg"
                          controls
                          preload="metadata"
                          style={{ height: "400px" }}
                          // Optional: limit video height
                        ></video>
                        <button
                          onClick={removeFile}
                          className="absolute -top-2 -right-2 bg-gray-900 text-white p-2 rounded-full"
                        >
                          <X />
                        </button>
                      </>
                    )}
                    {imgUrl && (
                      <>
                        <img
                          src={imgUrl}
                          className="w-full object-cover"
                          alt="post image"
                        />
                        <button
                          className="absolute -top-2 -right-2 bg-gray-900 text-white p-2 rounded-full"
                          onClick={removeFile}
                        >
                          <X />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="cursor-pointer">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <CameraSvg />
                    </label>

                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 focus:outline-none font-bold disabled:bg-gray-400 disabled:text-black disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                      disabled={
                        loading2 || uploading || inputValue.length === 0
                      }
                    >
                      {loading2 || uploading ? "Posting..." : "Post"}
                    </button>
                  </div>
                </form>
              </div>
              <div className="lg:hidden p-4">
                <FollowSuggestion />{" "}
              </div>

              <SectionWrapper
                loading={loading && !showMorePosts}
                error={error ? true : false}
                onRetry={() => {
                  if (error === "JWT Expired") {
                    window.location.reload(); // Reloads the whole app (forces re-auth)
                  } else {
                    fetchFeed(); // Retry fetch logic
                  }
                }}
                loader={<PostFeedSuspence repeat={5} />}
              >
                {posts && posts.length === 0 ? (
                  // Only show "no posts" when we have an empty array (not undefined)
                  <NoPostFoundUI />
                ) : (
                  <div className="p-4">
                    {posts?.map((data) => {
                      const timeAgo = CalculateTimeAgo(data.created_at);
                      return (
                        <PostCard
                          key={data.id}
                          id={data.id}
                          name={data.users.username}
                          userId={userId}
                          userImg={data.users.profile_picture}
                          content={data.content}
                          timeAgo={timeAgo}
                          postImg={data.image}
                          tagName={data.users.tag_name}
                          likes={data.likes}
                          liked={data.liked}
                        />
                      );
                    })}

                    {/* Load More Button */}
                    {hasMore && posts && posts.length > 0 && (
                      <div className="flex justify-center mt-6 mb-4">
                        <button
                          onClick={() => loadMorePost()}
                          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Load More Posts"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </SectionWrapper>
            </>
          ) : (
            <>
              <FollowingTab
                fetchFollowedUsers={fetchFollowedUsers}
                users2={users2}
                loading5={loading5}
                error5={error5}
              />
            </>
          )}
        </section>
        <div className="w-[35%] max-lg:hidden">
          <FollowSuggestion />
        </div>
      </div>
    </>
  );
};

const Home: React.FC = () => {
  return <HomeFeedsPage />;
};

export default Home;
