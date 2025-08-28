import { Fragment, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin-view/product-tile";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);

  function handleImageUploadComplete(imageUrl) {
    setUploadedImageUrl(imageUrl);
  }

  function handleEdit(product) {
    setCurrentEditedId(product._id);
    setFormData(product);
    setUploadedImageUrl(product.image); // Set the initial image URL for the editor
    setOpenCreateProductsDialog(true);
  }

  function onSubmit(e) {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      image: uploadedImageUrl,
    };

    currentEditedId !== null
      ? dispatch(
          editProduct({ id: currentEditedId, formData: updatedFormData })
        ).then((data) => {
          if (data?.payload.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            toast.success(
              data.payload.message || "Product Edited successfully"
            );
          }
        })
      : dispatch(addNewProduct(updatedFormData)).then((data) => {
          if (data?.payload.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setFormData(initialFormData);
            setUploadedImageUrl("");
            toast.success(data.payload.message || "Product added successfully");
          }
        });
  }

  function isFormValid() {
    const requiredKeys = Object.keys(initialFormData).filter(
      (key) => key !== "image" && key !== "salePrice"
    );
    return requiredKeys.every(
      (key) => formData[key] !== "" && formData[key] !== null
    );
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload.success) {
        dispatch(fetchAllProducts());
        toast.success(data.payload.message || "Product Deleted successfully");
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-6 w-full flex justify-end">
        <Button
          onClick={() => setOpenCreateProductsDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={handleEdit}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          setOpenCreateProductsDialog(open);
          if (!open) {
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setUploadedImageUrl("");
          }
        }}
        className="z-50 p-40 bg-amber-50"
      >
        <SheetContent
          side="right"
          className="w-full max-w-md overflow-y-auto shadow-lg p-5 bg-white"
        >
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-xl font-bold">
              {currentEditedId !== null ? "Edit Product" : " Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            initialImageUrl={uploadedImageUrl}
            onUploadComplete={handleImageUploadComplete}
            isEditMode={currentEditedId !== null}
            isCustomStyling={true}
          />
          <div className="py-6 px-1">
            <CommonForm
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              buttonText={
                currentEditedId !== null ? "Edit Product" : " Add New Product"
              }
              isBtnDisabled={!isFormValid()}
              onSubmit={onSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
