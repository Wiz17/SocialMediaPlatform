import React from "react";
import LeftNav from "../components/leftNav.tsx";
import {
  User,
  Users,
  FileText,
  Heart,
  MessageCircle,
  Tag,
  Bell,
  Smartphone,
  Rocket,
  CheckCircle,
  Clock,
  Mail,
  Bug,
  Lightbulb,
} from "lucide-react";

const Updates = () => {
  const currentFeatures = [
    {
      icon: User,
      title: "User Account Creation",
      description:
        "Create your personalized profile with username and profile picture",
    },
    {
      icon: Users,
      title: "Follow/Unfollow System",
      description:
        "Connect with other users by following them to see their content",
    },
    {
      icon: FileText,
      title: "Post Creation",
      description:
        "Share your thoughts with text posts and optional image & video attachments",
    },
    {
      icon: Heart,
      title: "Post Interactions",
      description: "Like posts from users you follow to show appreciation",
    },
  ];

  const upcomingFeatures = [
    {
      icon: MessageCircle,
      title: "Comment Section",
      description: "Engage in conversations by commenting on posts",
      status: "Coming Soon",
    },
    {
      icon: Tag,
      title: "User Tagging",
      description: "Tag other users in your posts to mention them",
      status: "Coming Soon",
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description:
        "Get instant notifications for tags, likes, and interactions",
      status: "Coming Soon",
    },
    {
      icon: Smartphone,
      title: "Stories Feature",
      description: "Share temporary stories that disappear after 24 hours",
      status: "Planned",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Development":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Coming Soon":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Planned":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="flex">
      <div className="max-sm:hidden w-[15%]"></div>
      {/* <LeftNav /> */}
      <section className="w-full sm:w-[85%] border-r-gray-700 min-h-screen bg-black">
        <div className="max-w-4xl mx-auto p-5 sm:p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white text-4xl font-bold mb-4">App Updates</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Stay updated with the latest features and upcoming enhancements to
              your social experience
            </p>
          </div>

          {/* Current Version */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white text-2xl font-semibold">
                Current Features
              </h2>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                v1.0 Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Features */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white text-2xl font-semibold">
                Upcoming Features
              </h2>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
                Roadmap
              </span>
            </div>

            <div className="space-y-6">
              {upcomingFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-800/50 hover:bg-zinc-900/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-600">
                      <feature.icon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white text-lg font-semibold">
                          {feature.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(feature.status)}`}
                        >
                          {feature.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl p-8 border border-zinc-700">
              <h3 className="text-white text-xl font-semibold mb-3">
                Have Suggestions?
              </h3>
              <p className="text-gray-400 mb-6">
                We're always looking to improve. Share your ideas for new
                features!
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>feedback@yourapp.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Bug className="w-4 h-4" />
                  <span>Report bugs</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>Feature requests</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Updates;
