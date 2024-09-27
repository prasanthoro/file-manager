"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getMyFilesAPI } from "@/lib/services/files";
import { RootState } from "@/redux";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TanStackTable from "../Core/TanstackTable";
import { FilesTableColumns } from "./FilesTableColoumns";
import { FileDataDetails } from "@/lib/interfaces";

export const convertToLocalDate = (utcDateString: string | number | Date) => {
  const date = new Date(utcDateString);
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    //timeZoneName: "short",
  });
};

export function DashboardTable() {
  const [page, setPage] = useState(1);
  const params = useSearchParams();

  const [filesData, setFilesData] = useState<FileDataDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const user = useSelector((state: RootState) => state?.user);

  const getAllMyFiles = async (page: number) => {
    try {
      setLoading(true);
      const response = await getMyFilesAPI({
        page: 1,
        limit: 10,
        order_by: "uploaded_at",
        order_type: "desc",
        search_string: "",
      });
      if (response?.success) {
        setFilesData(response?.data?.data);
        setPage(page + 1);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMyFiles(page);
  }, []);

  return (
<<<<<<< HEAD
    <div className=" mt-10 flex-grow flex flex-col justify-between p-6 w-[140%]">
      <h1>Recent Files</h1>
      <br />
      <Card className="h-full">
        {/* <CardHeader className="px-7">
          <CardTitle>Recent Files</CardTitle>
        </CardHeader> */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <strong>Title</strong>
                </TableHead>
                <TableHead>
                  <strong>Uploaded Date</strong>
                </TableHead>
                <TableHead>
                  <strong>Categories</strong>
                </TableHead>
                <TableHead>
                  <strong>Type</strong>
                </TableHead>
                <TableHead>
                  <strong>Size</strong>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filesData.length > 0 ? (
                filesData.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="font-medium">
                        {truncateFileName(file.title, 10)}
                      </div>
                      {/* <div className="text-sm text-muted-foreground">
                      {truncateFileName(file.mime_type, 10)}
                    </div> */}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {convertToLocalDate(file.uploaded_at)}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      categorie {file.category_id}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {file.type}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatSize(file.size)}
                    </TableCell>

                    {/* <TableCell className="text-right">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View File
                    </a>
                  </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {loading ? "Loading..." : "No files available"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
=======
    <div className="flex flex-col ">
      <Card className="bg-white shadow-lg rounded-lg">
        <CardContent>
          <h2 className="text-xl font-semibold mt-4 mb-4"> Recent Files</h2>

          <div className="overflow-x-auto">
            <TanStackTable
              columns={FilesTableColumns()}
              data={filesData}
              loading={loading}
              searchParams={searchParams}
              getData={getAllMyFiles}
            />
          </div>
>>>>>>> features/categories
        </CardContent>
      </Card>
    </div>
  );
}
