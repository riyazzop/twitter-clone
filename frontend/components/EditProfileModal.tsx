import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  X,
  Camera,
  MapPin,
  Link2,
  User,
  FileText,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axiosInstance from "@/lib/axiosInstance";

const EditProfileModal = ({ isOpen = true, onClose }: any) => {
  if (!isOpen) return null;
  const { user, updateProfile } = useAuth();

  const [formData, setformData] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    avatar: user?.avatar ?? "",
    location: "Earth",
    website: "my-website",
  });
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState<any>({});

  const validateForm = () => {
    seterror({});
    const errors: any = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.bio) errors.bio = "Bio is required";
    if (!formData.location) errors.location = "Location is required";
    if (!formData.website) errors.website = "Website is required";
    seterror(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setloading(true);
      await updateProfile(formData as any);
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setformData({ ...formData, [field]: value });
    if (error[field]) seterror((prev: any) => ({ ...prev, [field]: "" }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setloading(true);
    const image = e.target.files[0];
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
        setformData((prev) => ({ ...prev, avatar: imageUrl }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[600px] bg-black text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <h2 className="text-xl font-bold text-white">Edit profile</h2>
          </div>
          <Button
            type="submit"
            form="edit-profile"
            disabled={loading}
            className="rounded-full bg-white text-black text-sm font-bold px-5 h-9 hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <form id="edit-profile" onSubmit={handleSave}>
            {/* Cover Photo */}
            <div className="relative w-full h-44 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 group">
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="rounded-full p-3 bg-black/70 hover:bg-black/90 transition-colors"
                  title="Change cover photo"
                >
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Avatar row */}
            <div className="px-4 -mt-12 mb-4">
              <div className="relative inline-block group">
                <Avatar className="h-24 w-24 border-4 border-black">
                  <AvatarImage src={formData.avatar} className="object-cover" />
                  <AvatarFallback className="bg-gray-700 text-2xl font-bold text-white">
                    {formData.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input type="file" accept="image/*" id='avatarUpload' onChange={handlePhotoUpload} />
                </div>
                <Button
                  type="button"
                  onClick={()=>document.getElementById("avatarUpload")?.click()}
                  className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Change profile photo"
                >
                  <Camera className="h-6 w-6 text-white" />
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="px-4 pb-6 space-y-5">
              {/* Name */}
              <div className="relative">
                <div
                  className={`flex items-start border rounded-md px-3 pt-5 pb-2 bg-black transition-colors focus-within:border-blue-500 ${
                    error.name ? "border-red-500" : "border-gray-700"
                  }`}
                >
                  <User className="h-4 w-4 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <label
                      htmlFor="name"
                      className="block text-xs text-gray-500 mb-0.5"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      maxLength={50}
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-600"
                      placeholder="Your name"
                    />
                  </div>
                  <span className="text-xs text-gray-600 ml-2 mt-0.5 flex-shrink-0">
                    {formData.name.length}/50
                  </span>
                </div>
                {error.name && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{error.name}</p>
                )}
              </div>

              {/* Bio */}
              <div className="relative">
                <div
                  className={`flex items-start border rounded-md px-3 pt-5 pb-2 bg-black transition-colors focus-within:border-blue-500 ${
                    error.bio ? "border-red-500" : "border-gray-700"
                  }`}
                >
                  <FileText className="h-4 w-4 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <label
                      htmlFor="bio"
                      className="block text-xs text-gray-500 mb-0.5"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      maxLength={160}
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="w-full bg-transparent text-white text-sm outline-none resize-none placeholder-gray-600"
                      placeholder="A short bio about yourself"
                    />
                  </div>
                  <span className="text-xs text-gray-600 ml-2 mt-0.5 flex-shrink-0">
                    {(formData.bio ?? "").length}/160
                  </span>
                </div>
                {error.bio && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{error.bio}</p>
                )}
              </div>

              {/* Location */}
              <div className="relative">
                <div
                  className={`flex items-start border rounded-md px-3 pt-5 pb-2 bg-black transition-colors focus-within:border-blue-500 ${
                    error.location ? "border-red-500" : "border-gray-700"
                  }`}
                >
                  <MapPin className="h-4 w-4 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <label
                      htmlFor="location"
                      className="block text-xs text-gray-500 mb-0.5"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      maxLength={30}
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-600"
                      placeholder="Your location"
                    />
                  </div>
                </div>
                {error.location && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {error.location}
                  </p>
                )}
              </div>

              {/* Website */}
              <div className="relative">
                <div
                  className={`flex items-start border rounded-md px-3 pt-5 pb-2 bg-black transition-colors focus-within:border-blue-500 ${
                    error.website ? "border-red-500" : "border-gray-700"
                  }`}
                >
                  <Link2 className="h-4 w-4 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <label
                      htmlFor="website"
                      className="block text-xs text-gray-500 mb-0.5"
                    >
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      maxLength={100}
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-600"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                {error.website && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {error.website}
                  </p>
                )}
              </div>

              {/* Avatar URL field */}
              <div className="relative">
                <div className="flex items-start border border-gray-700 rounded-md px-3 pt-5 pb-2 bg-black transition-colors focus-within:border-blue-500">
                  <Camera className="h-4 w-4 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <label
                      htmlFor="avatar"
                      className="block text-xs text-gray-500 mb-0.5"
                    >
                      Avatar URL
                    </label>
                    <input
                      type="text"
                      id="avatar"
                      value={formData.avatar}
                      onChange={(e) =>
                        handleInputChange("avatar", e.target.value)
                      }
                      className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-600"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
