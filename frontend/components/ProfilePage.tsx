import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  Camera,
  CalendarDays,
  MapPin,
  Link2,
  Heart,
  MessageCircle,
  Repeat2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import EditProfileModal from "./EditProfileModal";
import axiosInstance from "@/lib/axiosInstance";

const TABS = ["Posts", "Replies", "Media", "Likes"] as const;
type Tab = (typeof TABS)[number];

const ProfilePage = () => {
  const [tweets, settweets] = useState<any>([])
  const [loading, setloading] = useState<boolean>(false)
  const fetchTweets = async () => {
    try {
      setloading(true);
      const res = await axiosInstance.get("/get-tweets");
      settweets(res.data);
      console.log(res.data);
      
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("Posts");
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) return null;

  const filteredTweets = tweets.filter((tweet:any)=>tweet.author._id===user._id);

  return (
    <div className="w-full min-h-screen relative bg-black text-white">
      {/* Top Nav Bar */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 py-3 border-b border-gray-800">
        <button className="rounded-full p-2 hover:bg-gray-800 transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div className="flex flex-col leading-tight">
          <h1 className="text-lg font-bold text-white">{user.name}</h1>
          <p className="text-xs text-gray-500">{filteredTweets.length} posts</p>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 group">
        <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="rounded-full p-3 bg-black/60">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </button>
      </div>

      {/* Avatar + Edit Row */}
      <div className="px-4 flex items-end justify-between -mt-14 mb-3">
        <div className="relative group">
          <Avatar className="h-28 w-28 border-4 border-black ring-0">
            <AvatarImage src={user.avatar} className="object-cover" />
            <AvatarFallback className="bg-gray-700 text-2xl font-bold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <button className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
            <Camera className="h-7 w-7 text-white" />
          </button>
        </div>
        <Button
          className="rounded-full border border-gray-600 bg-transparent text-white text-sm font-bold px-4 py-1.5 hover:bg-gray-900 transition-colors mt-2"
          variant="outline"
          onClick={() => setShowEditModal(true)}
        >
          Edit profile
        </Button>
      </div>

      {/* User Info */}
      <div className="px-4 pb-3">
        <h2 className="text-xl font-bold text-white leading-tight">
          {user.name}
        </h2>
        <p className="text-gray-500 text-sm mb-3">
          @{user.username ?? user.name?.toLowerCase().replace(/\s/g, "")}
        </p>
        <p className="text-white text-sm mb-3 leading-relaxed">
          Building cool things on the internet. Passionate about design, code,
          and coffee. ☕
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-500 text-sm mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />{" "}
            {user.location ? user.location : "Earth"}
          </span>
          <span className="flex items-center gap-1">
            <Link2 className="h-4 w-4" />
            <a href="#" className="text-blue-500 hover:underline">
              {user.website ? user.website : "example.com"}
            </a>
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />{" "}
            {user.joinedDate &&
              new Date(user.joinedDate).toLocaleDateString("en-us", {
                month: "long",
                year: "numeric",
              })}
          </span>
        </div>
        <div className="flex gap-4 text-sm">
          <span>
            <span className="font-bold text-white">248</span>
            <span className="text-gray-500 ml-1">Following</span>
          </span>
          <span>
            <span className="font-bold text-white">1.4K</span>
            <span className="text-gray-500 ml-1">Followers</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative hover:bg-gray-900 ${
              activeTab === tab ? "text-white" : "text-gray-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-10 rounded-full bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tweet Feed */}
      <div className="divide-y divide-gray-800">
        {filteredTweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg font-bold text-white mb-2">No posts yet</p>
            <p className="text-sm">When you post, it'll show up here.</p>
          </div>
        ) : (
          filteredTweets.map((tweet:any) => (
            <div
              key={tweet._id}
              className="px-4 py-4 hover:bg-gray-900/50 transition-colors cursor-pointer"
            >
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage
                    src={tweet.author.avatar}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {tweet.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-bold text-white text-sm">
                      {tweet.author.displayName}
                    </span>
                    <span className="text-gray-500 text-sm">
                      @{tweet.author.username}
                    </span>
                    <span className="text-gray-600 text-sm">·</span>
                    <span className="text-gray-500 text-sm">
                      {tweet.timestamp}
                    </span>
                  </div>
                  <p className="text-white text-sm mt-1 leading-relaxed">
                    {tweet.content}
                  </p>
                  {tweet.image && (
                    <img
                      src={tweet.image}
                      alt="tweet media"
                      className="mt-3 rounded-2xl w-full max-h-72 object-cover border border-gray-800"
                    />
                  )}
                  {/* Actions */}
                  <div className="flex items-center gap-6 mt-3 text-gray-500">
                    <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group">
                      <span className="p-1.5 rounded-full group-hover:bg-blue-400/10">
                        <MessageCircle className="h-4 w-4" />
                      </span>
                      <span className="text-xs">{tweet.comments}</span>
                    </button>
                    <button
                      className={`flex items-center gap-1.5 hover:text-green-400 transition-colors group ${tweet.retweeted ? "text-green-400" : ""}`}
                    >
                      <span className="p-1.5 rounded-full group-hover:bg-green-400/10">
                        <Repeat2 className="h-4 w-4" />
                      </span>
                      <span className="text-xs">{tweet.retweets}</span>
                    </button>
                    <button
                      className={`flex items-center gap-1.5 hover:text-pink-500 transition-colors group ${tweet.liked ? "text-pink-500" : ""}`}
                    >
                      <span className="p-1.5 rounded-full group-hover:bg-pink-500/10">
                        <Heart className="h-4 w-4" />
                      </span>
                      <span className="text-xs">{tweet.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
