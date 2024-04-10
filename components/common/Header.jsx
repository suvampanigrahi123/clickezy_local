const Header = ({ children }) => {
  return (
    <>
      <section className="md:hidden flex flex-col justify-start items-start bg-[#010201] min-h-[64px]">
        {children}
      </section>
    </>
  );
};

export default Header;
