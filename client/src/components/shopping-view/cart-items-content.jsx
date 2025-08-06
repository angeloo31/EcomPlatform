import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner"; // Assuming you have sonner installed and configured

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];

      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item) => item.productId === getCartItem?.productId
      );

      const getCurrentProductIndex = productList.findIndex(
        (product) => product._id === getCartItem?.productId
      );
      const getTotalStock = productList[getCurrentProductIndex]?.totalStock;

      if (indexOfCurrentCartItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          // Corrected toast message and removed the second one
          toast.error(
            `Only ${getTotalStock} items are available for this product.`
          );
          return;
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item updated"); // Using toast.success for a clear message
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast("Cart item removed"); // Using simple string for toast
      }
    });
  }

  return (
    <div className="flex w-full items-center gap-4 rounded-xl border bg-card p-4 shadow-md transition-all duration-200 hover:shadow-lg">
      {" "}
      {/* Enhanced container styling */}
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="h-20 w-20 flex-shrink-0 rounded-lg object-cover border border-gray-100" // Added flex-shrink-0 and subtle border
      />
      <div className="flex-1 flex flex-col justify-center">
        {" "}
        {/* Added flex-col to align content vertically */}
        <h3 className="text-base font-semibold text-foreground mb-1">
          {" "}
          {/* Added text-foreground and margin-bottom */}
          {cartItem?.title}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="min-w-[24px] text-center font-medium text-lg text-foreground">
            {" "}
            {/* Increased font size and color */}
            {cartItem?.quantity}
          </span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {" "}
        {/* Added flex-shrink-0 */}
        <p className="text-base font-bold text-primary">
          {" "}
          {/* Adjusted font size */}$
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCartItemDelete(cartItem)}
          className="text-destructive hover:bg-destructive/10" // Improved hover state
        >
          <Trash className="h-5 w-5" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
