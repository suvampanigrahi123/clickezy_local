const EmptyData = () => {
  return (
    <>
      {/* empty data design in tailwind css */}
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-2xl font-bold text-gray-500">No Data Found</span>
      </div>
    </>
  );
};

export default EmptyData;
