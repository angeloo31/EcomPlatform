import { UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRef, useState, useCallback } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  isEditMode = false,
  isCustomStyling = false,
  onUploadComplete,
  initialImageUrl = "",
}) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState(initialImageUrl);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const inputRef = useRef(null);
  const isUploadingRef = useRef(false);

  const handleImageFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      uploadImageToCloudinary(selectedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      uploadImageToCloudinary(droppedFile);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    isUploadingRef.current = false;
    if (onUploadComplete) {
      onUploadComplete("");
    }
  };

  const uploadImageToCloudinary = useCallback(
    async (file) => {
      if (!file || isUploadingRef.current) return;

      isUploadingRef.current = true;
      setImageLoadingState(true);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          ` ${import.meta.env.VITE_API_URL}/api/admin/products/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response?.data?.success) {
          const imageUrl = response.data.result.url;
          setUploadedImageUrl(imageUrl);
          if (onUploadComplete) {
            onUploadComplete(imageUrl);
          }
        }
      } catch (error) {
        console.error("Upload error:", error.response?.data || error.message);
      } finally {
        setImageLoadingState(false);
        isUploadingRef.current = false;
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [onUploadComplete]
  );

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode || imageLoadingState}
          accept="image/*"
        />

        {!uploadedImageUrl ? (
          imageLoadingState ? (
            <div className="flex flex-col items-center justify-center h-32">
              <Skeleton className="w-10 h-10 rounded-full mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ) : (
            <Label
              htmlFor="image-upload"
              className={`${
                isEditMode ? "cursor-not-allowed" : "cursor-pointer"
              } flex flex-col items-center justify-center h-32`}
            >
              <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
              <span>Drag & drop or click to upload image</span>
            </Label>
          )
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              <img
                src={uploadedImageUrl}
                alt="Uploaded preview"
                className="w-12 h-12 object-cover rounded mr-2"
              />
              <p className="text-sm font-medium">Image uploaded successfully</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
              disabled={isEditMode}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
