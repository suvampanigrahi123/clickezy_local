import PrimaryLayout from '../../components/layout/PrimaryLayout';
import Header from '../../components/common/Header';
import ProductDetails from '../../components/eCom/ProductDetails';
import * as api from '../../services/storeService';
import HeroBanner from '../../components/eCom/HeroBanner';
import useSWR from 'swr';
import CartQuantityHeader from '../../components/eCom/CartQuantityHeader';

function Dashboard() {
  const { data: categories } = useSWR('/store/categories', api.getCategories);
  const { data: banner } = useSWR('/store/banner', api.getBanners);
  const categoriesList = categories?.category_list?.filter(
    (category) => category?.sub_category_list?.length > 0
  );
  return (
    <PrimaryLayout>
      <Header>
        <div className="flex flex-col justify-start items-center self-stretch bg-[#010201]">
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 py-5">
            {/* <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative">
              <Link href="/store">
                <ArrowLeftIcon className="h-6 w-6 text-white" />
              </Link>
            </div> */}
            <div className="flex flex-col justify-center items-start flex-grow flex-shrink-0 relative self-stretch gap-1">
              <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                Photo Frames
              </p>
            </div>
            <CartQuantityHeader />
          </div>
        </div>
      </Header>

      {/* Page Body */}
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#19191c]">
        <div className="flex self-stretch md:overflow-hidden">
          <HeroBanner banners={banner} />
        </div>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-14 md:gap-24 py-14 md:py-24">
          {categoriesList?.map((category) => (
            <ProductDetails
              key={category?.cat_id}
              title={category?.name}
              desc={category?.description}
              catId={category?.cat_id}
              image={category?.thumb}
              subcategories={category?.sub_category_list}
              displayType={category?.type}
            />
          ))}
        </div>
      </div>
    </PrimaryLayout>
  );
}
export default Dashboard;
