import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  // Calculate total cart amount, handling both salePrice and regular price
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md md:max-w-lg flex flex-col p-6 bg-white">
      {" "}
      {/* Added flex-col and increased padding */}
      <SheetHeader className="border-b border-gray-200 pb-4 mb-4">
        {" "}
        {/* Added border and padding */}
        <SheetTitle className="text-2xl font-extrabold text-primary">
          Your Cart
        </SheetTitle>{" "}
        {/* Styled title */}
      </SheetHeader>
      {/* Cart Items List - Made scrollable */}
      <div className="flex-grow overflow-y-auto space-y-4 py-2 pr-2">
        {" "}
        {/* Added flex-grow, overflow, padding */}
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            // Ensure a unique key is provided for list items
            <UserCartItemsContent key={item._id} cartItem={item} />
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p className="text-lg">Your cart is empty!</p>
            <p className="text-sm">Start shopping to add items.</p>
          </div>
        )}
      </div>
      {/* Total Amount Section */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        {" "}
        {/* Added top border and padding */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl">Total</span>{" "}
          {/* Increased font size */}
          <span className="font-bold text-xl text-primary">
            ${totalCartAmount.toFixed(2)}
          </span>{" "}
          {/* Increased font size and added .toFixed(2) for currency formatting */}
        </div>
      </div>
      {/* Checkout Button */}
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6 py-3 rounded-lg text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-200"
        disabled={cartItems.length === 0} // Disable checkout if cart is empty
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
