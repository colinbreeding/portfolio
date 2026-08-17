import { SiteHeader } from "@/components/site-header";
import { About } from "@/components/about";
import { Socials } from "@/components/socials";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";
import { Underwater } from "@/components/underwater";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Underwater />

      <div className="paper-grain relative isolate mx-auto flex w-full flex-1 flex-col border border-white/[0.05] bg-[rgba(4,12,32,0.6)] shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
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
