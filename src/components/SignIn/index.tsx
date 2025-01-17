"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// import { errorPopper, successPopper } from "./Toastmessage";
// import { toast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { encode } from "string-encode-decode";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/redux/Modules/userlogin/userlogin.slice";
import { RootState, store } from "@/redux";
import { toast } from "sonner";

const SignInPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const user = useSelector((state: RootState) => state.user);

  const setUserDetailsInCookies = ({ access_token, user_details }: any) => {
    const details: any = jwt.decode(access_token);
    const encodedString = access_token;

    Cookies.set("token", access_token, {
      // session cookies are temporary cookies
      priority: "High",
      expires: details["exp"],
    });
  };

  const fetchData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setErrors([]);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUserDetailsInCookies(data?.data);
        dispatch(
          loginSuccess({
            user: data.data,
            token: data.data.access_token,
          })
        );
        toast.success(data?.message);

        router.push("/dashboard");
      } else if (data?.status == 422) {
        setErrors(data?.errors);
      } else if (data?.status == 401) {
        setErrorMessage(data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[500px] lg:grid-cols-2 xl:min-h-[700px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={fetchData} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // onChange={handleEmailChange}
                required
              />
              {errors?.email && (
                <p className="text-red-500">{errors.email[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors?.password && (
                <p className="text-red-500">{errors.password[0]}</p>
              )}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
            <Button type="submit" onClick={fetchData} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden bg-muted lg:block w-[758px] h-[698px]">
        <Image
          src="/dashboard/desktopimage.svg"
          alt="Image"
          width="1920"
          height="1000"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default SignInPage;
