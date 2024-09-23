"use client";
import Image from "next/image";
import {
  Folder,
  Users,
  ChevronDown,
  FilePlus,
  FileText,
  Film,
  Grid,
  MoreHorizontal,
  File,
  Home,
  LineChart,
  ListFilter,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
  Cloud,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  getAllCategoriesAPI,
  postCreateCategoryAPI,
} from "@/lib/services/categories";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RootState } from "@/redux";
import { useSelector } from "react-redux";
import CategoriesSideBar from "./categoriesSidebar";
import { prepareQueryParams } from "@/lib/helpers/Core/prepareQueryParams";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FileUpload from "../Categories/Files/filesupload";

export function SideBar({
  categoryid,
  getAllCategories,
  setCategoryId,
  children,
}: {
  categoryid?: number | null;
  getAllCategories?: (page: number, value: boolean) => void;
  setCategoryId?: Dispatch<SetStateAction<number>>;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
  });
  const [recentCategoryId, setRecentCategoryId] = useState(0);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [errMessages, setErrMessages] = useState<any>();
  const user = useSelector((state: RootState) => state?.user?.user_details);

  const handleCard = () => {
    router.push(`/myfiles`);
  };

  const handleCreate = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getRecentCategory = async (page: number) => {
    let queryParams = prepareQueryParams({ page: page || 1, limit: 1 });
    setLoading(true);
    try {
      const response = await getAllCategoriesAPI(queryParams);
      if (response?.success) {
        const newData = response?.data?.data;
        console.log(newData[0].id);
        setRecentCategoryId(newData[0].id);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createCategories = async () => {
    setLoading(true);
    try {
      const payload = { ...data };
      const response = await postCreateCategoryAPI(payload);

      if (response?.status == 200 || response?.status == 201) {
        setOpen(false);
        console.log(response);
        router.replace(`/categories/${response?.data?.data?.id}/files`);

        getAllCategories && getAllCategories(1, false);

        // toast.success(response?.data?.message);
        // setDeleteid(false);
      } else if (response?.status === 422 || response?.status === 409) {
        console.log(response);
        setErrMessages(response?.data?.errors);
      } else {
        throw response;
      }
    } catch (err: any) {
      //   errorPopper(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextFieldChange = (e: any) => {
    const { name, value } = e.target;

    // setErrMessages((prevErr: any) => ({
    //   ...prevErr,
    //   [name]: null,
    // }));

    setData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySidebar = () => {
    router.push(`/categories/${recentCategoryId}/files`);
    setCategoryOpen(true);
  };

  const handleCreateFile = () => {
    setFileOpen(true);
  };

  const isActive = (href: string) => pathname.includes(href);

  // const handleCategories = (categoryid: number) => {
  //   router.push(`/categories/${categoryid}/files`);
  // };
  console.log(categoryOpen, "CATEGORY");
  useEffect(() => {
    getRecentCategory(1);
  }, []);

  return (
    <div className="flex mt-20">
      <nav className="flex flex-col h-full w-60 bg-white text-gray-800 py-4 px-3">
        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center justify-center w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                <span>+ New</span>
              </Button>
              {/* <Button variant="outline">Open</Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleCreate}>
                  <Folder className="mr-2 h-4 w-4" />
                  <span>New Category</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCreateFile}>
                  <File className="mr-2 h-4 w-4" />
                  <span>File Upload</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ul className="space-y-4 text-gray-600">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center space-x-3 p-2 rounded-md ${
                isActive("/dashboard") ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <Image
                src="/dashboard/dashboard.svg"
                alt="dashboard"
                width={20}
                height={20}
              />
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              href="/myfiles"
              className={`flex items-center space-x-3 p-2 rounded-md ${
                isActive("/myfiles") ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <Image
                src="/dashboard/MyFiles.svg"
                alt="My Files"
                width={20}
                height={20}
              />
              <span>My Files</span>
            </Link>
          </li>

          <li>
            <a
              onClick={handleCategorySidebar}
              className={`flex items-center space-x-3 p-2 rounded-md ${
                isActive(`/categories`) ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <Image
                src="/dashboard/Categories.svg"
                alt="Categories"
                width={20}
                height={20}
              />
              <div className="flex justify-between items-center">
                <span>Categories</span>
                {categoryOpen ? <ChevronRight /> : ""}
              </div>
            </a>
          </li>

          {/* <li>
          onClick={handleCategorySidebar}
            className={`flex items-center space-x-3 p-2 rounded-md ${
              isActive(`/categories`) ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          <Link
            href="/settings"
            className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-md"
          >
            <Image
              src="/icons/settings.svg"
              alt="Settings"
              width={20}
              height={20}
            />
            <span>Settings</span>
          </Link>
        </li> */}
          {/* <li>
            <div className="mt-auto text-gray-500 text-xs px-3">
              <div className="flex items-center">
                {" "}
                <Cloud />
                <span className="ml-2 text-sm"> Storage (87% full)</span>
              </div>

              <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: "87%" }}
                ></div>
                <span className="mt-3"> 13 GB used</span>
              </div>
            </div>
          </li> */}
        </ul>
        {/* <CategoriesSideBar /> */}

        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent
            className="bg-white"
            onClick={() => console.log("close")}
          >
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
            </DialogHeader>
            <div>
              <Input
                id="name"
                value={data?.name}
                // defaultValue="Pedro Duarte"
                className="col-span-3"
                name="name"
                placeholder="Enter the Category Name"
                onChange={handleTextFieldChange}
              />
              {errMessages ? (
                <span className="text-red-500">{errMessages?.name}</span>
              ) : (
                ""
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={handleClose}
                // className="bg-grey-700"
                // variant="outline"
                variant="secondary"
                type="submit"
              >
                Cancel
              </Button>
              <Button onClick={createCategories} type="submit">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>
      {pathname.includes("/categories") && (
        <div className="w-60 ">
          <CategoriesSideBar />
        </div>
      )}
      <div className="flex-grow">{children}</div>
    </div>
  );
}
