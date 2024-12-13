import FriendSection from "@/components/FriendSection";
import TrendingSection from "@/components/TrendingSection";
import { Divider, ScrollShadow } from "@nextui-org/react";

function HomeSidebar() {
  return (
    <section className="w-full min-h-screen bg-slate-200 text-black py-8 pr-8 flex flex-col gap-6">
      <div className="bg-primaryWhite rounded-lg flex flex-col overflow-hidden px-3">
        <h3 className="mt-2 font-semibold">Trending Posts</h3>
        <Divider className="my-2" />
        <ScrollShadow className="max-h-[200px]" hideScrollBar>
          <TrendingSection />
        </ScrollShadow>
      </div>

      <div className="bg-primaryWhite rounded-lg flex flex-col overflow-hidden px-3">
        <h3 className="mt-2 font-semibold">Pending Requests</h3>
        <Divider className="my-2" />
        <ScrollShadow className="max-h-[200px]" hideScrollBar>
          <FriendSection />
        </ScrollShadow>
      </div>
    </section>
  );
}

export default HomeSidebar;
