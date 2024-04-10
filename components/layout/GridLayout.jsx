const GridLayout = ({ children }) => {
  return (
    <>
      <main className="max-w-sm mx-auto md:max-w-full min-h-screen bg-[#19191C] shadow-xl">
        <div className="grid grid-flow-row content-between place-content-stretch place-items-stretch overflow-hidden gap-0 min-h-screen bg-[#010201]">
          {children}
        </div>
      </main>
    </>
  );
};

export default GridLayout;
