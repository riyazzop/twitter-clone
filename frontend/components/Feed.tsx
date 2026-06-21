import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import LoadingSpinner from "./LoadingSpinner";
import TweetCard from "./TweetCard";
import TweetComposer from "./TweetComposer";
import axiosInstance from "@/lib/axiosInstance";
import { log } from "node:console";

const Feed = () => {
  const exampleFeeds = [
    {
      id: 1,
      name: "Riyaz",
      username: "@riyaz",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "Hello everyone",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      timestamp: "2 hours ago",
      likes: 10,
      comments: 5,
      retweets: 3,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 2,
      name: "Riyaz",
      username: "@riyaz",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "Hello everyone",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      timestamp: "2 hours ago",
      likes: 10,
      comments: 5,
      retweets: 3,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 3,
      name: "Riyaz",
      username: "@riyaz",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "Hello everyone",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      timestamp: "2 hours ago",
      likes: 10,
      comments: 5,
      retweets: 3,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 4,
      name: "Riyaz",
      username: "@riyaz",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "Hello everyone",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      timestamp: "2 hours ago",
      likes: 10,
      comments: 5,
      retweets: 3,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 5,
      name: "Riyaz",
      username: "@riyaz",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "Hello everyone",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      timestamp: "2 hours ago",
      likes: 10,
      comments: 5,
      retweets: 3,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 6,
      name: "Riyaz",
      username: "@riyaz",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "Hello everyone",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      timestamp: "2 hours ago",
      likes: 10,
      comments: 5,
      retweets: 3,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 7,
      name: "Riyaz",
      username: "@riyaz",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "Hello everyone",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      timestamp: "2 hours ago",
      likes: 10,
      comments: 5,
      retweets: 3,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 8,
      name: "Riyaz",
      username: "@riyaz",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "Hello everyone",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      timestamp: "2 hours ago",
      likes: 10,
      comments: 5,
      retweets: 3,
      isLiked: false,
      isRetweeted: false,
      verified: true,
    },
    {
      id: 9,
      name: "Riyaz",
      username: "@riyaz",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "Hello everyone",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      timestamp: "2 hours ago",
      likes: 10,
      comments: 5,
      retweets: 3,
      isLiked: false,
      isRetweeted: false,
      verified: true,
    },
    {
      id: 10,
      name: "Riyaz",
      username: "@riyaz",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "Hello everyone",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      timestamp: "2 hours ago",
      likes: 10,
      comments: 5,
      retweets: 3,
      isLiked: false,
      isRetweeted: false,
    },
  ];
  const [tweets, settweets] = useState<any>([]);
  const [loading, setloading] = useState<boolean>(false);
  const fetchTweets = async () => {
    try {
      setloading(true);
      const res = await axiosInstance.get("/get-tweets");
      settweets(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  const handleNewTweet = async (tweet: any) => {
    settweets((prev: any) => [tweet, ...prev]);
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight">Home</h1>
        </div>
        <Tabs defaultValue="foryou" className="w-full">
          <TabsList className="w-full rounded-none bg-transparent border-none h-auto p-0">
            <TabsTrigger
              value="foryou"
              className="flex-1 rounded-none py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-500 bg-transparent hover:bg-muted/40 transition-colors"
            >
              For you
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="flex-1 rounded-none py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-500 bg-transparent hover:bg-muted/40 transition-colors"
            >
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <TweetComposer />
      {/* Tweet List */}
      <div className="divide-y divide-border flex flex-col gap-3">
        {loading && <div><LoadingSpinner/>Loading...</div>}
        {tweets.length === 0 ? (
          <Card className="flex items-center justify-center gap-3 p-8 border-none shadow-none">
            No Tweets
          </Card>
        ) : (
          tweets.map((tweet: any) => (
            <TweetCard key={tweet._id} tweet={tweet} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
