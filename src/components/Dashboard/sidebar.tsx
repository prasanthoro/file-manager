"use client";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import Link from "next/link";
import { useRouter } from "next/navigation";

export function SideBar() {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/upload");
  };

  return (
    <nav className="flex flex-col h-full w-60 bg-white text-gray-800 py-4 px-3">
      <div className="flex items-center justify-between mb-6 px-3">
        <div>
          <span className="text-xl font-semibold text-gray-900">
            Marketing Team
          </span>
          <p className="text-sm text-gray-500">17 members</p>
        </div>
        <ChevronDown className="h-5 w-5 text-gray-500" />
      </div>

      <div className="mb-6 px-3">
        <h2 className="text-lg font-bold text-gray-800">Storage</h2>

        <h4 className="text-lg font-bold text-blue-500">My Files</h4>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Assets</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Marketing</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Templates</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Projects</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Projector Courses</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="mb-6 px-3">
        <ul className="space-y-2 text-gray-600">
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <span>Shared with me</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <span>Recent</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <span>Starred</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <span>Trash</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 mb-6" />

      <div className="mt-auto px-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <span>Create new</span>
              <span className="ml-2">
                <FilePlus className="h-5 w-5" />
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="space-y-2 p-4 bg-white shadow-md rounded-md"
          >
            <h3 className="text-md font-bold mb-4 text-gray-800">Create new</h3>
            <button
              onClick={handleCreate}
              className="flex items-center w-full space-x-2 p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              <FilePlus className="h-5 w-5 text-blue-500" />
              <span>Folder</span>
            </button>
            <button className="flex items-center w-full space-x-2 p-2 bg-gray-100 hover:bg-gray-200 rounded">
              <FileText className="h-5 w-5 text-blue-500" />
              <span>Text Doc</span>
            </button>
            <button className="flex items-center w-full space-x-2 p-2 bg-gray-100 hover:bg-gray-200 rounded">
              <Film className="h-5 w-5 text-blue-500" />
              <span>Presentation</span>
            </button>
            <button className="flex items-center w-full space-x-2 p-2 bg-gray-100 hover:bg-gray-200 rounded">
              <Grid className="h-5 w-5 text-blue-500" />
              <span>Sheets</span>
            </button>
            <button className="flex items-center w-full space-x-2 p-2 bg-gray-100 hover:bg-gray-200 rounded">
              <MoreHorizontal className="h-5 w-5 text-blue-500" />
              <span>More</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}