import { prepareURLEncodedParams } from "@/lib/helpers/prepareUrlEncodedParams";
import { $fetch } from "@/lib/servicehelpers/fetch";
import { RootState } from "@/redux";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export const getAllFilesAPI = async (
  params: any,
  file_id: string | string[]
) => {
  try {
    return await $fetch.get(`/categories/${file_id}/files`, params);
  } catch (err) {
    throw err;
  }
};

export const getMyFilesAPI = async (params: any) => {
  try {
    return await $fetch.get("/files", params);
  } catch (err) {
    throw err;
  }
};

export const getSingleFileAPI = async (categoryid: number,fileid: number) => {
  try {
    return await $fetch.get(`/categories/${categoryid}/files/${fileid}`);
  } catch (err) {
    throw err;
  }
};

export const updateFileAPI = async (
  categoryid: number,
  fileid:number,
  payload: any
) => {
  try {
    return await $fetch.patch(`/categories/${categoryid}/files/${fileid}`, payload);
  } catch (err) {
    throw err;
  }
};

export const deleteFilesAPI = async (categoryid: number, fileid: number) => {
  try {
    return await $fetch.delete(`/categories/${categoryid}/files/${fileid}`);
  } catch (err) {
    throw err;
  }
};

export const deleteMyFilesAPI = async (fileid: number) => {
  try {
    return await $fetch.delete(`/files/${fileid}`);
  } catch (err) {
    throw err;
  }
};

export const handleDownloadFile = async (url: string, title: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = title;
    document.body.appendChild(link);
    link.click();

<<<<<<< HEAD
  export const getMyFilesAPI = async (queryParams: any,access_token : string) => {
    try {
       const url = prepareURLEncodedParams(
      `${process.env.NEXT_PUBLIC_API_URL}/files`,
      queryParams
    );
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${access_token}`, 
        },
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      return await res.json();
    } catch (err) {
      console.error("Error creating category:", err);
      throw err;
    }
  };
=======
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download error:", error);
    toast.error("File download failed");
  }
};
>>>>>>> features/categories

