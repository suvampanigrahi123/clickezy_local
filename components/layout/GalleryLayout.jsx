const TitleBox = ({ children }) => {
  return (
    <>
      <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative px-6">
        {children}
      </div>
    </>
  );
};

export default TitleBox;
