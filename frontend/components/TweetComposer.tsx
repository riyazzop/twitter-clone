import { useAuth } from "@/context/AuthContext";
import React, { useRef, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Image, Film, Smile, BarChart2, X } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

const MAX_LENGTH = 280;

/** Thin SVG ring that fills as the user types */
const CharProgress = ({
  count,
  max,
}: {
  count: number;
  max: number;
}) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(count / max, 1);
  const dashOffset = circumference * (1 - ratio);
  const isOver = count > max;
  const isNear = count >= max * 0.8;
  const strokeColor = isOver
    ? "#ef4444"
    : isNear
    ? "#f59e0b"
    : "#1d9bf0";

  // hide ring entirely when nothing typed
  if (count === 0) return null;

  return (
    <div className="relative flex items-center justify-center w-8 h-8">
      <svg width="28" height="28" viewBox="0 0 28 28">
        {/* track */}
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke="#2f3336"
          strokeWidth="2.5"
        />
        {/* progress */}
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 14 14)"
          style={{ transition: "stroke-dashoffset 0.15s, stroke 0.15s" }}
        />
      </svg>
      {/* show remaining digits only when ≤ 20 left */}
      {count >= max - 20 && (
        <span
          className="absolute text-[9px] font-semibold"
          style={{ color: strokeColor }}
        >
          {max - count}
        </span>
      )}
    </div>
  );
};

const TweetComposer = ({onTweetPosted}:any) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setloading] = useState(false);
  const [imageurl, setimageurl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_LENGTH;
  const canTweet = (content.trim().length > 0 || imageurl !== "") && !isOverLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!content.trim() && !imageurl)) return;
    try {
      setloading(true);
      const tweetdata = {
        author: user?._id,
        content,
        image: imageurl,
      };
      const res = await axiosInstance.post("/post-tweet", tweetdata);
      onTweetPosted(res.data);
      setContent("");
      setimageurl("");
      setImagePreview("");
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setloading(true);
    const image = e.target.files[0];

    // Show local preview immediately
    setImagePreview(URL.createObjectURL(image));

    const formDataImg = new FormData();
    formDataImg.append("image", image);
    try {
      const imgbbkey = process.env.NEXT_PUBLIC_IMGBB_KEY;
      // Use native fetch instead of axios — axios adds a Content-Type header
      // that triggers a CORS preflight which imgbb's API blocks.
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbkey}`,
        {
          method: "POST",
          body: formDataImg,
        }
      );
      const data = await res.json();
      const imageUrl = data?.data?.display_url;
      if (imageUrl) {
        setimageurl(imageUrl);
      }
    } catch (error) {
      console.log(error);
      setImagePreview("");
    } finally {
      setloading(false);
      // Reset so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setimageurl("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!user) return null;

  return (
    <Card className="border-0 border-b border-border rounded-none">
      <CardContent className="px-4 pt-3 pb-0">
        <form onSubmit={handleSubmit}>
          {/* Top row: avatar + textarea */}
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0 pt-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} className="object-cover" />
                <AvatarFallback className="bg-sky-500 text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Input */}
            <div className="flex-1 min-w-0">
              <Textarea
                id="tweet-input"
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="
                  w-full bg-transparent border-none shadow-none
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  resize-none text-[17px] leading-relaxed placeholder:text-muted-foreground
                  p-0 pt-2
                "
              />

              {/* Image preview */}
              {imagePreview && (
                <div className="relative mt-2 mb-1 rounded-2xl overflow-hidden border border-border max-h-72 w-full">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Loading overlay while uploading */}
                  {loading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Separator className="mt-3 mb-2" />

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="image-upload-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between pb-3 pl-12">
            {/* Media buttons */}
            <div className="flex items-center gap-0.5 text-sky-500">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-sky-500/10"
                aria-label="Add image"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || !!imageurl}
              >
                <Image className="h-[18px] w-[18px]" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-sky-500/10"
                aria-label="Add GIF"
              >
                <Film className="h-[18px] w-[18px]" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-sky-500/10"
                aria-label="Add poll"
              >
                <BarChart2 className="h-[18px] w-[18px]" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-sky-500/10"
                aria-label="Add emoji"
              >
                <Smile className="h-[18px] w-[18px]" />
              </Button>
              <span  className="text-sky-500 hover:underline hover:cursor-pointer text-sm">Everyone can reply</span>
            </div>

            {/* Right side: progress ring + post button */}
            <div className="flex items-center gap-3">
              <CharProgress count={charCount} max={MAX_LENGTH} />

              {/* Thin vertical divider */}
              {charCount > 0 && (
                <Separator orientation="vertical" className="h-6" />
              )}

              <Button
                type="submit"
                disabled={!canTweet || loading}
                className="
                  rounded-full bg-sky-500 text-white font-bold px-5 h-9
                  hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Posting…
                  </span>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TweetComposer;
