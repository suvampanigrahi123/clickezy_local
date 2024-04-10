import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, XCircleIcon } from '@heroicons/react/24/outline';
import SecondaryLayout from '../../../components/layout/SecondaryLayout';
import Header from '../../../components/common/Header';
import * as api from '../../../services/storeService';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { COMMON } from '../../../constants/const';
import CartQuantityHeader from '../../../components/eCom/CartQuantityHeader';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { filter } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProductCard from '../../../components/eCom/ProductCard';

export default function Products() {
  const router = useRouter();
  const { query } = router;
  const { category_id, sub_cat_id } = query;
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState([]);
  const [index, setIndex] = useState(0);

  const { data: c, isLoading } = useSWR(
    category_id &&
      sub_cat_id && ['/store/products', index, category_id, sub_cat_id],
    () => api.getProducts({ catId: category_id, subCatId: sub_cat_id, index })
  );
  const categories = c && c?.product_list;
  useEffect(() => {
    if (categories?.length > 0) {
      setResult((prev) => [...prev, ...categories]);
    }
  }, [categories]);
  const getMoreData = () => {
    if (categories?.length > 0) {
      setIndex(index + 1);
    }
  };

  const handleProductSearch = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      const data = filter(categories, (item) => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      });
      setResult(data);
    } else {
      setResult(categories);
    }
  };
  const clearSearchQuery = (e) => {
    e.preventDefault();
    setSearchQuery('');
  };
  return (
    <SecondaryLayout>
      <Head>
        <meta name="title" content="clickezy" />
        <meta name="description" content="customize your photo frame" />
        <meta
          name="keywords"
          content="book your photographer, photoshoot, weeding photography, marriage photoshoot "
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
      </Head>
      <Header>
        <div className="flex flex-col justify-start items-start self-stretch bg-[#010201]">
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 py-4">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <Link href="/store">
                <ArrowLeftIcon className="h-6 w-6 text-white" />
              </Link>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow flex-shrink-0 relative self-stretch gap-1">
              <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                Home
              </p>
            </div>
            <CartQuantityHeader />
          </div>
        </div>
      </Header>

      {/* Page Body */}
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#19191c]">
        <div className="md:flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-3 sm:pt-3 md:px-20 md:pt-8">
          <div className="w-full flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
            <div className="flex items-center w-full relative">
              <button
                className="absolute left-2 hidden md:block"
                onClick={() => router.push('/store')}
              >
                <ArrowLeftIcon className="h-5 w-5 text-white" />
              </button>
              <input
                className="placeholder:text-slate-400 placeholder:text-sm block border-white/25 bg-[#19191c] text-white w-full border rounded-md h-10 pr-3 py-4 pl-9 shadow-sm focus:outline-none focus:ring-blue-500 focus:ring-1"
                placeholder="Type to search..."
                type="text"
                name="product search"
                autoComplete="none"
                autoFocus={false}
                aria-autocomplete="none"
                value={searchQuery}
                onChange={handleProductSearch}
              />
              {searchQuery?.length > 0 && (
                <button className="absolute right-2" onClick={clearSearchQuery}>
                  <XCircleIcon className="h-5 w-5 text-white/40" />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center items-start flex-grow flex-shrink-0 relative self-stretch gap-1">
            <p className="flex-grow-0 flex-shrink-0 text-3xl font-medium text-left text-white">
              {categories?.name}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-stretch self-stretch flex-grow-0 flex-shrink-0 gap-6 p-4 md:px-20">
          <>
            <InfiniteScroll
              dataLength={result.length} //This is important field to render the next data
              next={getMoreData}
              style={{ overflow: 'hidden' }}
              hasMore={true}
              refreshFunction={() => {}}
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
              loader={
                isLoading && (
                  <div className="py-12 px-6 md:px-16">loading...</div>
                )
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 pb-3">
                {result?.map((product, index) => (
                  <ProductCard
                    key={product.product_id}
                    name={product.name}
                    price={product.discounted_amount}
                    id={product.product_id}
                    images={product.images?.thumb[0]}
                    discount={product?.percentage}
                    originalPrice={product?.price}
                    index={index}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </>
        </div>
      </div>
    </SecondaryLayout>
  );
}
