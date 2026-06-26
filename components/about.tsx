import Image from "next/image";

// The bio is intentionally written as JSX (not pulled from site-config) so you
// can bold words and add inline links exactly where you want them. Edit freely.
export function About() {
  return (
    <section id="about">
      <h1 className="mb-5 text-lg font-bold tracking-tight">About</h1>

      <div className="flow-root">
        <Image
          src="/me.jpg"
          alt="Colin Breeding with his son"
          width={160}
          height={160}
          priority
          className="mb-4 h-[160px] w-[160px] rounded-full border border-border object-cover sm:float-right sm:mb-2 sm:ml-7"
        />

        <div className="space-y-4 text-base">
          <p>
            I&apos;m a full-stack engineer with over 6 years of experience
            building mobile apps, desktop apps, and websites.
          </p>
          <p>
            I love making clean interfaces and great user experiences. The small
            details most people never notice are the ones that quietly make
            everything feel better to use.
          </p>
          <p>
            Outside of work, I&apos;m a dad to a 3-year-old who keeps every day
            interesting. I&apos;m also into
            golfing, fishing, and hiking — the hobbies I rely on to make sure I
            actually leave the house and get some sunlight every now and then.
          </p>
        </div>
      </div>
    </section>
  );
}
