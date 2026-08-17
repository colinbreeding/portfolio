import Image from "next/image";

// The bio is intentionally written as JSX (not pulled from site-config) so you
// can bold words and add inline links exactly where you want them. Edit freely.
export function About() {
  return (
    <section id="about">
      <div className="flex flex-col md:flow-root">
        <h1 className="order-2 mb-5 text-lg font-bold tracking-tight">
          About
        </h1>

        <Image
          src="/scuba.jpg"
          alt="Colin Breeding scuba diving"
          width={160}
          height={160}
          priority
          className="order-1 mb-4 h-[160px] w-[160px] rounded-full object-cover md:float-right md:mb-2 md:ml-7"
        />

        <div className="order-3 space-y-4 text-base">
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
            Outside of work, I have a beautiful fiancé and a 3-year-old who keeps every day
            interesting. I&apos;m also into
            fishing, hiking, and golfing - the hobbies I rely on to make sure I
            actually leave the house and get some sunlight every now and then.
          </p>
        </div>
      </div>
    </section>
  );
}
