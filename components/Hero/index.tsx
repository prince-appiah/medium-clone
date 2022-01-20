const Hero = () => {
  return (
    <main className="flex items-center justify-between px-10 py-10 space-y-5 bg-yellow-400 border-black lg:py-0 border-y">
      <div>
        <h1 className="max-w-xl font-serif text-6xl">
          <span className="underline decoration-black decoration-4">
            Medium
          </span>{" "}
          is a place to read, write and connect
        </h1>
        <h2 className="">
          It's easy and free yo post your thinking on any topic and connect with
          millions of readers
        </h2>
      </div>
      {/* Right */}
      <img
        className="hidden object-contain h-32 md:inline-flex lg:h-full"
        src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
        alt=""
      />
    </main>
  );
};

export default Hero;
