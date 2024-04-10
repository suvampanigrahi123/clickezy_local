const ProductTitle = ({ title, sub_title }) => {
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-6 md:px-20">
        <p className="flex-grow-0 flex-shrink-0 text-xl md:text-3xl font-medium text-left text-white">
          {title || ''}
        </p>
        <p className="self-stretch flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-white/[0.64]">
          {sub_title || ''}
        </p>
      </div>
    </>
  );
};

export default ProductTitle;
