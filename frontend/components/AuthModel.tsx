import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { User, X, Mail, Lock } from "lucide-react";
import TwitterLogo from "./TwitterLogo";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import LoadingSpinner from "./LoadingSpinner";
import { Separator } from "./ui/separator";
import { useAuth } from "@/context/AuthContext";

const AuthModel = ({ isopen, isclose, initialmode = "signup" }: any) => {
  const { login, signup, isloading } = useAuth();
  const [mode, setmode] = useState<"login" | "signup">(initialmode);
  const [formData, setformData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  });
  const [error, seterror] = useState<any>({});

  if (!isopen) return null;
  const validateForm=()=>{
    const newErrors={email:"",password:"",name:"",username:""}
    if(!formData.email.trim()){
      newErrors.email="Email is required"
    }
    if(!formData.password.trim()){
      newErrors.password="Password is required"
    }
    if(mode==="signup"){
      if(!formData.name.trim()){
        newErrors.name="Name is required"
      }
      if(!formData.username.trim()){
        newErrors.username="Username is required"
      }
    }
    seterror(newErrors)
    return Object.values(newErrors).every((v) => v === "")
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!validateForm() || isloading){
      return
    }
    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await signup(
          formData.email,
          formData.password,
          formData.name,
          formData.username,
        );
      }
      isclose();
      setformData({ email: "", password: "", name: "", username: "" });
      seterror({});
    } catch (error) {
      seterror({ general: "Authentication failed" });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setformData((prev) => ({ ...prev, [field]: value }));
    if (error[field]) {
      seterror((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  const swithMode = () => {
    setmode((prev) => (prev === "login" ? "signup" : "login"));
    seterror({});
    setformData({ email: "", password: "", name: "", username: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#242d34]/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-[600px] bg-black text-white border-none shadow-2xl rounded-2xl md:min-h-[600px] flex flex-col pt-2 relative overflow-hidden">
        <CardHeader className="relative flex flex-col items-center justify-center p-4 border-b-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 rounded-full h-8 w-8 text-white hover:bg-gray-800 hover:text-white"
            onClick={isclose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="w-10 h-10 mt-2 text-white fill-white">
            <TwitterLogo />
          </div>
          <CardTitle className="text-3xl font-extrabold mt-8 self-start px-4 text-white">
            {mode === "login" ? "Sign in to X" : "Join X today"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 px-8 pb-10 sm:px-24">
          <div className="w-full max-w-sm mx-auto flex flex-col h-full justify-between">
            <div>
              {error.general && (
                <p className="text-red-500 text-sm mb-4 bg-red-900/30 border border-red-500/50 p-2 rounded">
                  {error.general}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "signup" ? (
                  <>
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder=" "
                          className="h-14 px-4 pt-4 pb-2 w-full bg-black text-white border-gray-700 focus:border-blue-500 focus:ring-0 peer ring-0"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                        />
                        <Label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500">
                          Name
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder=" "
                          className="h-14 px-4 pt-4 pb-2 w-full bg-black text-white border-gray-700 focus:border-blue-500 focus:ring-0 peer ring-0"
                          value={formData.username}
                          onChange={(e) =>
                            handleInputChange("username", e.target.value)
                          }
                        />
                        <Label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500">
                          Username
                        </Label>
                      </div>
                    </div>
                  </>
                ) : null}

                <div className="space-y-5">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder=" "
                      className="h-14 px-4 pt-4 pb-2 w-full text-lg bg-black text-white border-gray-700 focus:border-blue-500 focus:ring-0 peer ring-0"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                    <Label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500">
                      Email
                    </Label>
                  </div>

                  <div className="relative">
                    <Input
                      type="password"
                      placeholder=" "
                      className="h-14 px-4 pt-4 pb-2 w-full text-lg bg-black text-white border-gray-700 focus:border-blue-500 focus:ring-0 peer ring-0"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                    <Label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500">
                      Password
                    </Label>
                  </div>
                  {error.password && (
                    <p className="text-red-500 text-sm">{error.password}</p>
                  )}
                </div>

                <div className="pt-6">
                  <Button
                    disabled={isloading}
                    type="submit"
                    className="w-full rounded-full h-12 text-base font-bold bg-white text-black hover:bg-gray-200 transition-colors"
                  >
                    {isloading ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadingSpinner />
                        <span>Loading...</span>
                      </div>
                    ) : mode === "login" ? (
                      "Log in"
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            <div className="mt-8">
              {mode === "login" && (
                <div className="mb-6">
                  <Button
                    variant="outline"
                    className="w-full rounded-full h-10 font-semibold bg-black border-gray-600 text-white hover:bg-gray-900 hover:text-white"
                  >
                    Forgot password?
                  </Button>
                </div>
              )}

              <div className="text-gray-500 text-sm mt-4 flex items-center justify-start gap-1">
                <span>
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Have an account already?"}
                </span>
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={swithMode}
                >
                  {mode === "login" ? "Sign up" : "Log in"}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModel;
