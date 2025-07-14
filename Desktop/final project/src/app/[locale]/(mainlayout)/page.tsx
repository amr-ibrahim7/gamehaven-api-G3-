import { AppSidebar } from "@/components/layout/sidebar/AppSidebar";
import CreatePostWrapper from "@/components/post/CreatePostWrapper";
import PostsListContainer from "@/components/post/PostsListContainer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="container mx-auto">
      <SidebarProvider>
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-3">
            <AppSidebar />
          </div>
          <div className="col-span-6">
            <main className="w-full space-y-6 my-6">
              <CreatePostWrapper />
              <PostsListContainer />
            </main>
          </div>
          <div className="col-span-3">

          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
