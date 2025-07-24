import React from "react";

const LeftUiPublicPages = () => {
  return (
    <>
      <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center relative overflow-hidden">
        {/* Full page background image - choose one of these options */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            // Option 1: People connecting/networking
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200')",

            // Option 2: Social media icons pattern
            // backgroundImage: "url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200')"

            // Option 3: People using phones/social media
            // backgroundImage: "url('https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200')"

            // Option 4: Abstract network connections
            // backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200')"

            // Option 5: Community/group of people
            // backgroundImage: "url('https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200')"
          }}
        ></div>

        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.15),_transparent_50%)]"></div>
      </div>
    </>
  );
};

export default LeftUiPublicPages;
