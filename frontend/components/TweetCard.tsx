import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, MessageCircle, Repeat } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

const TweetCard = ({ tweet }: any) => {
  const { user } = useAuth();
  const [tweetstate, settweetstate] = useState(tweet);
  const likeTweet = async (tweetId: any) => {
    try {
      const res = await axiosInstance.post(`/like/${tweetId}`, {
        userId: user?._id,
      });
      settweetstate(res.data)
    } catch (error) {
      console.log(error);
      
    }
  };
  const retweetTweet = async (tweetId: any) => {
     try {
      const res = await axiosInstance.post(`/retweet/${tweetId}`, {
        userId: user?._id,
      });
      settweetstate(res.data)
    } catch (error) {
      console.log(error);
      
    }
  };
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num
  };
  const isLiked=tweetstate.likedBy.includes(user?._id)
  const isRetweeted=tweetstate.retweetBy.includes(user?._id)
  return (
    <Card className="border-0 border-b border-border rounded-none bg-background hover:bg-muted/20 transition-colors cursor-pointer">
      <CardContent className="px-4 py-3">
        {/* Row: Avatar + Content */}
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={tweetstate.avatar} className="object-cover" />
              <AvatarFallback className="text-sm font-semibold bg-sky-500 text-white">
                {tweetstate.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name row with verified badge inline */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-sm hover:underline">
                {tweetstate.name}
              </span>
              {tweetstate.verified && (
                <svg
                  className="w-4 h-4 text-sky-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.707-12.293l-5.657 5.657-2.829-2.829a1 1 0 10-1.414 1.414l3.536 3.536a1 1 0 001.414 0l6.364-6.364a1 1 0 00-1.414-1.414z" />
                </svg>
              )}
              <span className="text-muted-foreground text-sm">
                {tweetstate.username}
              </span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">
                {tweetstate.timestamp}
              </span>
            </div>

            {/* tweetstate text */}
            <p className="text-sm mt-0.5 leading-relaxed break-words">
              {tweetstate.content}
            </p>

            {/* tweetstate image */}
            {tweetstate.image && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-border max-h-80">
                <img
                  src={tweetstate.image}
                  alt="tweetstate media"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between mt-3 max-w-xs text-muted-foreground">
              {/* //For like */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  likeTweet(tweetstate._id);
                }}
                className={`bg-black ${isLiked?"text-pink-500":"text-white"} hover:bg-white hover:text-black`}
              >
                <Heart className={`onhover:text-black onhover:text-pink-500 ${isLiked?"text-pink-500":"text-white"}`} />
                {formatNumber(tweetstate.likes)}
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  retweetTweet(tweetstate._id);
                }}
                className={`bg-black ${isRetweeted?"text-pink-500":"text-white"} hover:bg-white hover:text-black`}
              >
                <Repeat className="onhover:text-black onhover:text-green-500" />
                {formatNumber(tweetstate.retweetstates)}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetCard;
