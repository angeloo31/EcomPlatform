import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config"; // Assuming this is defined
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label"; // Using Label for menu items

/**
 * MenuItems Component: Renders navigation links for the header.
 * Handles navigation and setting filter parameters.
 */
function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    // If already on the listing page and a filter is applied, update search params
    // Otherwise, navigate to the path
    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors duration-200 ease-in-out"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

/**
 * HeaderRightContent Component: Renders cart icon with item count and user dropdown.
 * Handles cart sheet visibility and user logout.
 */
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    // Optionally navigate to home or login page after logout
    navigate("/shop/home");
  }

  // Fetch cart items when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      // Only fetch if user ID is available
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]); // Added user.id to dependency array

  // console.log(cartItems, "sangam"); // Keeping this log for debugging if needed

  return (
    <div className="flex items-center gap-4">
      {" "}
      {/* Aligned items centrally with gap */}
      {/* Cart Sheet Trigger Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        {" "}
        {/* Use onOpenChange for controlled sheet */}
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost" // Changed to ghost for a cleaner look
          size="icon"
          className="relative text-gray-700 hover:bg-gray-100 transition-colors duration-200" // Styled button
        >
          <ShoppingCart className="w-6 h-6" />
          {/* Cart Item Count Badge */}
          {cartItems?.items?.length > 0 && ( // Only show badge if there are items
            <span className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold border-2 border-background">
              {cartItems?.items?.length}
            </span>
          )}
          <span className="sr-only">User cart</span>
        </Button>
        {/* User Cart Wrapper Component */}
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
      {/* User Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-blue-600 cursor-pointer transition-transform duration-200 hover:scale-105 shadow-sm">
            {" "}
            {/* Styled Avatar trigger */}
            <AvatarFallback className="bg-blue-600 text-white font-extrabold text-lg">
              {user?.userName ? user.userName[0].toUpperCase() : "U"}{" "}
              {/* Fallback for user name initial */}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-56 p-2 shadow-lg rounded-lg bg-white"
        >
          {" "}
          {/* Styled dropdown content */}
          <DropdownMenuLabel className="font-semibold text-gray-800 px-2 py-1">
            Logged in as {user?.userName || "Guest"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200 my-1" />{" "}
          {/* Styled separator */}
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="flex items-center gap-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors duration-200"
          >
            <UserCog className="h-4 w-4 text-gray-600" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200 my-1" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 px-2 py-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 text-red-600" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 * ShoppingHeader Component: Main header for the shopping view.
 * Includes logo, navigation menu, and user/cart controls.
 */
function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      {" "}
      {/* Enhanced header styling */}
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand Link */}
        <Link
          to="/shop/home"
          className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors duration-200"
        >
          <HousePlug className="h-7 w-7 text-blue-600" /> {/* Styled icon */}
          <span className="font-extrabold text-xl tracking-tight">
            Ecommerce
          </span>{" "}
          {/* Styled text */}
        </Link>

        {/* Mobile Menu Trigger (Sheet) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-700 hover:bg-gray-100"
            >
              {" "}
              {/* Styled mobile trigger */}
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          {/* SheetContent for Mobile Menu - Removed conflicting styles */}
          <SheetContent
            side="left"
            className="w-full max-w-xs p-6 flex flex-col bg-white " // Removed bg-white, text-black
          >
            {" "}
            {/* Styled mobile sheet content */}
            <div className="flex flex-col gap-6">
              {" "}
              {/* Container for mobile menu items */}
              <MenuItems />
              {isAuthenticated && <HeaderRightContent />}{" "}
              {/* Only show right content if authenticated */}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Menu Items */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Desktop Header Right Content (Cart & User) */}
        <div className="hidden lg:block">
          {isAuthenticated && <HeaderRightContent />}{" "}
          {/* Only show right content if authenticated */}
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
