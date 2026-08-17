import { SiteHeader } from "@/components/site-header";
import { About } from "@/components/about";
import { Socials } from "@/components/socials";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto flex w-full flex-1 flex-col border border-white/[0.08] bg-[rgba(3,15,45,0.5)] shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl backdrop-saturate-[1.2]">
        <SiteHeader />

        <main className="mx-auto w-full max-w-xl flex-1 px-6 pt-11">
          <About />

          <div className="mt-9">
            <Socials />
          </div>

          <hr className="my-9 border-border" />

          <Contact />
        </main>

        <div className="mx-auto w-full max-w-xl px-6">
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
