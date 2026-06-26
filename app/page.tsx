import { SiteHeader } from "@/components/site-header";
import { About } from "@/components/about";
import { Socials } from "@/components/socials";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
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
  );
}
