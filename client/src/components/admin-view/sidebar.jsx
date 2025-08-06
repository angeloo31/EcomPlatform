import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket size={20} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck size={20} />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-6 flex flex-col gap-2">
      {adminSidebarMenuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            navigate(item.path);
            setOpen?.(false);
          }}
          className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium cursor-pointer text-black hover:bg-gray-100 transition"
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar (Drawer) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-64 p-6 bg-white text-black shadow-lg"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="mb-6">
              <SheetTitle>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    navigate("/admin/dashboard");
                    setOpen(false);
                  }}
                >
                  <ChartNoAxesCombined size={26} />
                  <span className="text-xl font-bold">Admin Panel</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white text-black p-6">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 mb-6 cursor-pointer"
        >
          <ChartNoAxesCombined size={26} />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
