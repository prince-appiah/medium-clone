import Link from "next/link";

const Header = () => {
  return (
    <header className="flex justify-between px-5 mx-auto max-w-7xl">
      <aside className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="object-contain cursor-pointer w-44"
            src="https://miro.medium.com/max/8978/1*s986xIGqhfsN8U--09_AdA.png"
            alt=""
          />
        </Link>
        <div className="items-center hidden space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="px-4 py-1 text-white bg-green-600 rounded-full">
            Follow
          </h3>
        </div>
      </aside>

      {/* Left */}
      <aside className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="px-4 py-1 border border-green-600 rounded-full">
          Get Started
        </h3>
      </aside>
    </header>
  );
};

export default Header;
