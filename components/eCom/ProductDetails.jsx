import Link from 'next/link';
import ProductImage from './ProductImage';

function ThumbnailSmall({ info, catId, subCatId, name }) {
  return (
    <>
      <div className="flex flex-col justify-start items-start flex-grow relative gap-2.5">
        <Link
          href={{
            pathname: '/store/products',
            query: { category: name, category_id: catId, sub_cat_id: subCatId },
          }}
          className="w-[164px] md:w-full h-[164px] aspect-w-16 aspect-h-16 overflow-hidden rounded"
        >
          <ProductImage image={info.image} />
        </Link>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
          <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-white capitalize">
            {info.name}
          </p>
        </div>
      </div>
    </>
  );
}

function ThumbnailLarge({ info, catId, subCatId }) {
  return (
    <>
      <div className="flex flex-col justify-start items-start flex-grow relative gap-2.5">
        <Link
          href={{
            pathname: '/store/products',
            query: { category_id: catId, sub_cat_id: subCatId },
          }}
          className="w-[250px] md:w-full h-auto aspect-w-16 aspect-h-16 overflow-hidden rounded"
        >
          <ProductImage image={info.image} />
        </Link>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
          <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-white capitalize">
            {info.name}
          </p>
        </div>
      </div>
    </>
  );
}

const ProductDetails = ({ title, desc, subcategories, displayType, catId }) => {
  return (
    <>
      <div className="flex flex-col justify-start items-stretch self-stretch flex-grow-0 flex-shrink-0 gap-6">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-6 md:px-20">
          <p className="flex-grow-0 flex-shrink-0 text-xl md:text-3xl font-medium text-left text-white">
            {title}
          </p>
          <p className="self-stretch flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-white/[0.64]">
            {desc}
          </p>
        </div>
        {displayType === 'grid' ||
          (!displayType && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-20">
              {subcategories?.map((subcat) => (
                <ThumbnailSmall
                  key={subcat.sub_cat_id}
                  info={subcat}
                  subCatId={subcat.sub_cat_id}
                  catId={catId}
                  name={subcat.name}
                />
              ))}
            </div>
          ))}

        {displayType === 'slide' && (
          <>
            <div className="grid grid-flow-col md:grid-cols-4 gap-4 px-6 md:px-20 overflow-scroll">
              {subcategories.map((subcat) => (
                <ThumbnailLarge key={subcat.sub_cat_id} info={subcat} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
