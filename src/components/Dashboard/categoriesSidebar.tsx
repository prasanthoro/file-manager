"use client";
import { Input } from "@/components/ui/input";
import { prepareQueryParams } from "@/lib/helpers/Core/prepareQueryParams";
import { prepareURLEncodedParams } from "@/lib/helpers/prepareUrlEncodedParams";
import {
  deleteCategoryAPI,
  getAllCategoriesAPI,
  getSingleCategoryAPI,
  postCreateCategoryAPI,
  updateCategoryAPI,
} from "@/lib/services/categories";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import DeleteDialog from "../Core/deleteDialog";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Loading from "../Core/loading";
import { Loader2 } from "lucide-react";

const CategoriesSideBar = () => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const { file_id } = useParams();
  const categorySideBarRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [id, setId] = useState<number>(0);
  const [noData, setNoData] = useState(false);
  const [open, setOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState<boolean>(false);
  const [deleteid, setDeleteid] = useState<number>(0);
  const [search, setSearch] = useState(""); // Search field state
  const [name, setName] = useState("");
  const [recentCategoryId, setRecentCategoryId] = useState(0);
  const [errMessages, setErrMessages] = useState<any>({});

  // API Calls

  const getSingleCategory = async (id: number) => {
    setLoading(true);
    try {
      const response = await getSingleCategoryAPI(id);

      if (response?.status == 200 || response?.status == 201) {
        // toast.success(response?.data?.message);
        console.log(response?.data?.data?.name);
        setName(response?.data?.data?.name);
        setId(id);
        setRenameOpen(true);
      } else {
        throw response;
      }
    } catch (err: any) {
      // errorPopper(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async () => {
    setLoading(true);
    try {
      const payload = {
        name: name,
      };

      const response: any = await updateCategoryAPI(id, payload);

      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.data?.message);
        setRenameOpen(false);
        setId(0);
        setName("");
        await getAllCategories(1, false);
      } else if (response.status === 422) {
        setErrMessages(response?.data?.errors);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllCategories = async (
    page: number,
    isScrolling: boolean = false,
    search_val = params.get("search_string") as any
  ) => {
    let queryParams = prepareQueryParams({
      page: page || 1,
      limit: 20,
      search_string: search_val,
    });

    router.replace(prepareURLEncodedParams(pathname, queryParams));
    setLoading(true);
    try {
      const response = await getAllCategoriesAPI(queryParams);
      if (response?.success) {
        const newPage = page + 1;
        const newData = response?.data?.data;
        setRecentCategoryId(newData[0].id);
        if (isScrolling) {
          setCategoryData((prevData) => prevData.concat(newData));
        } else {
          setCategoryData(newData);
        }
        setPage(newPage);
        if (newData.length === 0) setNoData(true);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async () => {
    setLoading(true);
    try {
      const response = await deleteCategoryAPI(deleteid);

      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.data?.message);
        setOpen(false);
        await getAllCategories(1, false);
        router.replace(`/categories/${recentCategoryId}/files`);
      } else {
        throw response;
      }
    } catch (err: any) {
    } finally {
      setLoading(false);
      setSearch("");
    }
  };

  // Functions Used

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRenameClose = () => {
    setRenameOpen(false);
    setId(0);
    setName("");
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
  };

  const handleCategoryFiles = (id: number) => {
    router.push(`/categories/${id}/files`);
  };

  const isActive = (id: string) => file_id === id;

  const handleScroll = () => {
    const categorySideBar = categorySideBarRef.current;

    if (
      categorySideBar &&
      categorySideBar.scrollTop + categorySideBar.clientHeight >=
        categorySideBar.scrollHeight - 10
    ) {
      if (!noData && !loading) {
        getAllCategories(page, true);
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteid(id);
    setOpen(true);
  };

  useEffect(() => {
    const categorySideBar = categorySideBarRef.current;
    if (categorySideBar) {
      categorySideBar.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (categorySideBar) {
        categorySideBar.removeEventListener("scroll", handleScroll);
      }
    };
  }, [page, noData, loading]);

  useEffect(() => {
    getAllCategories(1, false, search);
  }, [search, file_id]);

  return (
    <>
      <div className="flex flex-col h-screen w-60 bg-gray text-gray-800 p-4">
        <div className="mt-14">
          <Input
            placeholder="Search categories..."
            value={search}
            type="search"
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        <div ref={categorySideBarRef} className="flex-1 overflow-y-auto">
          {categoryData.length > 0 ? (
            categoryData.map((data, index) => (
              <ul key={index} className="space-y-2 text-gray-600">
                <li
                  onClick={() => handleCategoryFiles(data?.id)}
                  className={`flex items-center space-x-2 p-2 rounded-md  ${
                    isActive(`${data?.id}`)
                      ? "text-violet-500"
                      : "hover:text-violet-500"
                  }`}
                >
                  <Image
                    src="/dashboard/dashboard.svg"
                    alt="dashboard"
                    width={20}
                    height={20}
                    className="transition-all duration-200"
                  />
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <span className="cursor-pointer">
                        {data?.name.charAt(0).toUpperCase() +
                          data?.name.slice(1).toLowerCase()}
                      </span>{" "}
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => getSingleCategory(data?.id)}
                      >
                        Rename
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => handleDeleteClick(data?.id)}
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </li>
              </ul>
            ))
          ) : (
            <p className="text-gray-500">No categories found</p>
          )}
        </div>
      </div>
      {open ? (
        <DeleteDialog
          openOrNot={open}
          onCancelClick={handleClose}
          label="Are you sure you want to delete this Category?"
          onOKClick={deleteCategory}
          deleteLoading={loading}
        />
      ) : (
        ""
      )}

      <Dialog open={renameOpen} onOpenChange={handleRenameClose}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Rename Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="name"
              name="name"
              value={name}
              className="col-span-3"
              placeholder="Enter another Name for category"
              onChange={handleTextFieldChange}
            />
            <span>
              {errMessages && (
                <p className="text-red-500">{errMessages?.name}</p>
              )}
            </span>
          </div>
          <DialogFooter>
            <Button onClick={handleRenameClose} variant="ghost" type="submit">
              Cancel
            </Button>
            <Button onClick={updateCategory} type="submit">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Rename"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Loading loading={loading} />
    </>
  );
};

export default CategoriesSideBar;
