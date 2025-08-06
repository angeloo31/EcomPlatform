import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "lucide-react";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleImageUploadComplete(imageUrl) {
    if (imageUrl) {
      dispatch(addFeatureImage(imageUrl)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
        }
      });
    }
  }

  function handleDeleteImage(id) {
    if (window.confirm("Are you sure you want to delete this image?")) {
      dispatch(deleteFeatureImage(id)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
        }
      });
    }
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Upload New Feature Image</h2>
        <ProductImageUpload
          onUploadComplete={handleImageUploadComplete}
          isCustomStyling={true}
        />
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-xl font-bold">Existing Feature Images</h2>
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImgItem, index) => (
            <div
              key={featureImgItem.id || featureImgItem._id || index}
              className="relative rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={featureImgItem.image}
                className="w-full h-[300px] object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full opacity-80 bg-red-600"
                onClick={() => handleDeleteImage(featureImgItem._id)}
              >
                <Trash className="w-5 h-5" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center">
            No feature images found.
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
