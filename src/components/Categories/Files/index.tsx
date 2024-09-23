"use client";
import { ListOrdered, PanelLeft } from "lucide-react";

import { SideBar } from "@/components/Dashboard/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useParams, useRouter } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAllFilesAPI, getMyFilesAPI } from "@/lib/services/files";
import { useEffect, useRef, useState } from "react";
import FileUpload from "./filesupload";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import CategoriesSideBar from "@/components/Dashboard/categoriesSidebar";

import MyListFiles from "./mylistfiles";
import Loading from "@/components/Core/loading";
import { Table2 } from "lucide-react";
import { FileData } from "@/lib/interfaces/files";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const truncateFileName = (name: string, maxLength: number) => {
  // Remove the extension
  const baseName = name.split(".")[0]; // Get the part before the file extension
  if (baseName.length <= maxLength) {
    return baseName;
  }
  return `${baseName.substring(0, maxLength)}...`; // Truncate after maxLength and add '...'
};

export const formatSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1048576) {
    // Less than 1 MB and 1048576bytes
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    // 1 MB or more
    return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
  }
};

const Files = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [filesData, setFilesData] = useState<FileData[]>([]); // State for file list
  const [categoryId, setCategoryId] = useState<number | null>(null); // Keep track of category ID
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [listView, setListView] = useState(false);

  const lastFileRef = useRef<HTMLDivElement>(null);
  const fileListRef = useRef<HTMLDivElement>(null);

  const { file_id } = useParams();

  const user = useSelector((state: RootState) => state?.user);
  console.log(user?.access_token);

  const formatSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1048576) {
      // Less than 1 MB and 1048576bytes
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      // 1 MB or more
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
    }
  };

  const handleToggle = () => {
    setShowFileUpload(true);
  };

  const getAllFiles = async (page: number, isScrolling: boolean = false) => {
    try {
      setLoading(true);
      const response = await getAllFilesAPI(page, file_id);

      if (response?.success) {
        const newPage = page + 1;
        const newFileData = response.data;
        // const updatedFilesData = [...filesData, ...newFileData];
        setFilesData((prevFilesData) => [...prevFilesData, ...newFileData]);
        setPage(newPage);

        if (newFileData.length === 0) {
          setNoData(true);
        }
      } else {
        console.log(response);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAllMyFiles = async (page: number, isScroll: boolean = false) => {
    try {
      setLoading(true);
      const response = await getMyFilesAPI(page, user?.access_token);

      if (response?.success) {
        const newPage = page + 1;
        const newFileData = response.data;
        // const updatedFilesData = [...filesData, .::.newFileData];
        setFilesData((prevFilesData) => [...prevFilesData, ...newFileData]);
        setPage(newPage);
        console.log(newPage);
        console.log(setFilesData);

        if (newFileData.length === 0) {
          setNoData(true);
        }
      } else {
        // throw new Error(response.message || "Failed to load files");
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file_id) {
      getAllFiles(page);
      const id = Array.isArray(file_id) ? file_id[0] : file_id;
      setCategoryId(parseInt(id));
    }
  }, []);

  useEffect(() => {
    const fileListContainer = fileListRef.current;

    if (!fileListContainer || noData) return;

    const handleScroll = (file_id: any) => {
      if (
        fileListContainer.scrollTop + fileListContainer.clientHeight >=
        fileListContainer.scrollHeight
      ) {
        if (file_id) {
          getAllFiles(page, true); // Load more files
        } else {
          getAllMyFiles(page, true);
        }
      }
    };

    fileListContainer.addEventListener("scroll", handleScroll);

    return () => {
      fileListContainer.removeEventListener("scroll", handleScroll);
    };
  }, [page, filesData, noData, file_id]);

  useEffect(() => {
    if (file_id) {
      getAllFiles(page, true);
    } else {
      getAllMyFiles(page, true);
    }
  }, []);

  const renderFilePreview = (file: FileData) => {
    const mimeType = file.mime_type;

    if (mimeType.includes("image")) {
      return (
        <img
          src={"/dashboard/stats/image.svg"}
          alt={file.name}
          data-file-type="image"
          width={60}
          height={60}
          className="rounded-lg"
        />
      );
    }

    if (mimeType.includes("video/")) {
      return (
        <>
          {/* <video width={60} height={60} controls>
            <source src={file.url} type={mimeType} />
            Your browser does not support the video tag.
          </video> */}
          <img
            src={"/dashboard/stats/video.svg"}
            alt={file.name}
            data-file-type="video"
            width={60}
            height={60}
          />
        </>
      );
    }

    if (mimeType == "application/pdf") {
      return (
        <img
          src="/dashboard/stats/pdf.svg"
          alt={file.name}
          data-file-type="pdf"
          width={60}
          height={60}
          className="rounded-lg"
        />
      );
    }

    if (mimeType === "application/msword") {
      return (
        <img
          src="/dashboard/stats/docs.svg"
          alt={file.name}
          data-file-type="document"
          width={60}
          height={60}
          className="rounded-lg"
        />
      );
    }

    return (
      <img
        src="/dashboard/stats/others.svg"
        alt={file.name}
        data-file-type="others"
        width={60}
        height={60}
        className="rounded-lg"
      />
    );
  };

  return (
    <>
      <div className="flex min-h-screen w-full">
        {/* Sidebar - sticky */}
        {/* <div className="sticky top-0 left-0 h-screen w-50 bg-white">
        <SideBar categoryid={categoryId} />
      </div> */}
        {/* {file_id && (
        <div className="w-60 ">
          <CategoriesSideBar />
        </div>
      )} */}

        {/* Main Content */}
        <div className="flex flex-1 flex-col bg-muted/40">
          {/* Header */}

          <header className=" sticky  top-[10%] z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs"></SheetContent>
            </Sheet>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Categories</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/files"> Files</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <span className="flex justify-between items-center ml-90">
              <Table2 onClick={() => setListView(true)} />
              <ListOrdered onClick={() => setListView(false)} />
            </span>
          </header>

          {listView ? (
            <div className="ml-40 mt-10 flex-grow flex flex-col justify-between p-6 ">
              {/* File List */}
              <div
                ref={fileListRef} // Ref for scrolling
                className={`grid gap-10 transition-all duration-300 ${
                  showFileUpload ? "grid-cols-3" : "grid-cols-4"
                } flex-grow h-[calc(100vh-5rem)] overflow-y-auto p-4`}
              >
                {filesData.length > 0 ? (
                  filesData.map((file, index) => (
                    <div
                      key={file.id}
                      ref={index === filesData.length - 1 ? lastFileRef : null} // load more file when reach to last
                      className="flex flex-col items-center space-y-2"
                    >
                      {/* <img
                    src={file.url}
                    alt={file.name}
                    data-file-type={file.type}
                    width={60}
                    height={60}
                    onError={handleImageError}
                    className="rounded-lg"
                  /> */}

                      <Card className="w-[200px] rounded-lg border border-[#8E8EFC] shadow-none flex flex-col flex items-center ">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 "
                              >
                                {renderFilePreview(file)}
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Name :{file.name}</p>
                              <p>Size :{formatSize(file.size)}</p>
                              <p>Type :{file.mime_type}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* {renderFilePreview(file)} */}
                        <CardFooter className="bg-[#F5F5F5] py-2 w-full flex items-center justify-center">
                          <span className="text-sm font-medium flex ">
                            {truncateFileName(file.name, 10)}
                          </span>
                        </CardFooter>
                      </Card>
                    </div>
                  ))
                ) : (
                  <div></div>
                )}
              </div>

              {/* File Upload Section */}
              {showFileUpload && (
                <div
                  className=" right-0 top-0 w-85 h-20   transition-all duration-300"
                  style={{ zIndex: 1000 }}
                ></div>
              )}
            </div>
          ) : (
            <MyListFiles filesData={filesData} />
          )}
          {/* Upload Button */}
          {file_id ? (
            <div className="fixed bottom-20 right-20">
              <button
                onClick={handleToggle}
                className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-700 focus:outline-none"
              >
                +
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <Loading loading={loading} />
      <Dialog
        open={showFileUpload}
        onOpenChange={() => setShowFileUpload(false)}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>New FileUpload</DialogTitle>
          </DialogHeader>
          <FileUpload
            showFileUpload={showFileUpload}
            setShowFileUpload={setShowFileUpload}
            getAllFiles={getAllFiles}
          />
          <DialogFooter>
            {/* <Button
              onClick={() => setShowFileUpload(false)}
              // className="bg-grey-700"
              // variant="outline"
              variant="secondary"
              type="submit"
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Files;
