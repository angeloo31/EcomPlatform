import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  if (!orderDetails) {
    return (
      <DialogContent className="sm:max-w-[600px] flex items-center justify-center p-6">
        <p className="text-muted-foreground">Order details not found.</p>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[600px] p-6 bg-white">
      <div className="flex flex-col gap-6">
        {/* Order Summary Section */}
        <div className="grid gap-2">
          <h3 className="text-xl font-bold">Order Summary</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">Order ID</p>
              <Label className="font-normal">{orderDetails?._id}</Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Order Date</p>
              <Label className="font-normal">
                {orderDetails?.orderDate.split("T")[0]}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Order Price</p>
              <Label className="font-normal">
                {orderDetails?.totalAmount !== undefined
                  ? `$${orderDetails.totalAmount.toFixed(2)}`
                  : "N/A"}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Payment Method</p>
              <Label className="font-normal">
                {orderDetails?.paymentMethod}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Payment Status</p>
              <Label className="font-normal">
                {orderDetails?.paymentStatus}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Order Status</p>
              <Label className="font-normal">
                <Badge
                  className={`py-1 px-3 ${
                    orderDetails?.orderStatus === "confirmed"
                      ? "bg-green-500 hover:bg-green-500/80"
                      : orderDetails?.orderStatus === "rejected"
                      ? "bg-red-600 hover:bg-red-600/80"
                      : "bg-black hover:bg-black/80 text-white"
                  }`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Order Details (Items) Section */}
        <div className="grid gap-4">
          <h3 className="text-xl font-bold">Items</h3>
          <ul className="grid gap-3">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails?.cartItems.map((item) => (
                  <li
                    key={item._id || item.productId}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))
              : null}
          </ul>
        </div>

        <Separator />

        {/* Shipping Info Section */}
        <div className="grid gap-4">
          <h3 className="text-xl font-bold">Shipping Info</h3>
          <div className="flex flex-col gap-0.5 text-muted-foreground">
            <span className="font-medium text-foreground">
              Recipient: {user?.userName}
            </span>
            <span>
              Address: {orderDetails?.addressInfo?.address},{" "}
              {orderDetails?.addressInfo?.city},{" "}
              {orderDetails?.addressInfo?.pincode}
            </span>
            <span>Phone: {orderDetails?.addressInfo?.phone}</span>
            {orderDetails?.addressInfo?.notes && (
              <span>Notes: {orderDetails?.addressInfo?.notes}</span>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
// order details not original
