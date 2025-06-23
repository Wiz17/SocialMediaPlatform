import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

type MentionSuggestionData = {
  id: string;
  profile_picture: string;
  tag_name: string;
  username: string;
};

type MentionSuggestionModalProp = {
  open: boolean;
  onClose: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  mentionSuggestionData: MentionSuggestionData[];
};

export default function MentionSuggestionModal({
  open,
  onClose,
  textareaRef,
  mentionSuggestionData,
}: MentionSuggestionModalProp) {
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (open && textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        setModalPosition({
          top: rect.bottom + scrollTop + 5, // 5px gap below textarea
          left: rect.left,
        });
      }
    };

    updatePosition();

    // Update position on window resize or scroll
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [open, textareaRef]);

  const style = {
    position: "absolute",
    top: `${modalPosition.top}px`,
    left: `${modalPosition.left}px`,
    maxHeight: "300px",
    overflowY: "auto",
    backgroundColor: "black",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    p: 2,
    outline: "none",
    zIndex: 1300,
    // Hide scrollbar when not needed
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#4a5568",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#6b7280",
    },
  };

  // Prevent modal from closing when clicking inside
  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        style: {
          backgroundColor: "transparent",
        },
      }}
      disableAutoFocus={true}
      disableEnforceFocus={true}
      disableRestoreFocus={true}
    >
      <Box
        sx={style}
        onClick={handleModalClick}
        className="max-sm:w-[300px] w-[400px]"
      >
        <div className="">
          {/* Handle empty data */}
          {mentionSuggestionData.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <div className="text-gray-400 text-sm">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                No users found
              </div>
            </div>
          ) : (
            /* Render mention suggestions */
            mentionSuggestionData.map((user, index) => (
              <div
                key={user.id || index}
                className="px-2 py-1 hover:bg-gray-800 cursor-pointer transition-colors duration-150 flex items-center gap-3"
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-white font-medium text-sm truncate">
                      {user.username}
                    </span>
                    {true && (
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-400 text-sm">{user.tag_name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Box>
    </Modal>
  );
}
