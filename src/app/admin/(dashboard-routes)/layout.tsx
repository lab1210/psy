"use client";

import { Book, House, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Cookies from "js-cookie";
import { APP_NAME, AUTH_TOKEN, BASE_URL, REFRESH_TOKEN } from "@/static";
import { useRouter } from "next-nprogress-bar";
import { useToast } from "@/hooks/use-toast";
import { apiCall } from "@/services/endpoint";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/components/ui/loader";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: logout, isPending: isLogoutPending } = useMutation<
    any,
    Error,
    any
  >({
    mutationFn: async (data) => {
      const res = await apiCall(data, `${BASE_URL}/logout/`, "post");
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Logout successful",
        type: "foreground",
        duration: 2000,
      });
      router.push("/admin/login");
    },
    onError: (err) => {
      toast({
        title: err.message,
      });
    },
  });

  const tabs = [
    {
      name: "Overview",
      path: "/admin",
      icon: House,
    },
    {
      name: "View All Entries",
      path: "/admin/entries",
      icon: Book,
    },
  ];
  return (
    <div className="flex flex-grow">
      <nav className="bg-primary fixed w-64 h-dvh px-5 pb-5 flex flex-col justify-between gap-4">
        <div>
          <h1 className="mx-auto py-8 text-xl w-fit font-bold">{APP_NAME}</h1>
          {/* <div className="pt-4 pb-8">
            <p className="text-white w-fit font-bold">Akinsanya Adeyinka</p>
            <p className="text-white/40">@adeyinka</p>
          </div> */}
          <div className="py-6 border-white/40 border-y-[0.4px] flex gap-4 flex-col">
            {tabs.map((tab, index) => {
              const isActive = tab.path === pathname;
              return (
                <Link
                  href={tab.path}
                  key={index}
                  className={`flex items-center gap-x-2 ${
                    isActive ? "text-white" : "text-white/40"
                  }`}
                >
                  <tab.icon size={22} />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div>
          <div className="py-6 border-white/40 border-t-[0.4px] flex gap-4 flex-col">
            {/* <button className="flex items-center gap-x-2 text-white/80">
              <Settings size={22} />
              <span>Profile Settings</span>
            </button> */}
            <button
              className="flex items-center gap-x-2 text-[#FF0000]/80"
              onClick={() => {
                logout({ refresh_token: Cookies.get(REFRESH_TOKEN) });
                Cookies.remove(AUTH_TOKEN);
                Cookies.remove(REFRESH_TOKEN);
              }}
            >
              {isLogoutPending ? (
                <Loader className="m-0" />
              ) : (
                <LogOut size={22} />
              )}
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="pl-64 h-full w-full min-h-dvh bg-[#B2AFAF]/30">
        <section className="py-8 px-5 h-full">{children}</section>
      </main>
    </div>
  );
};

export default DashboardLayout;
