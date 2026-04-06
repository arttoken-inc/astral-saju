"use client";

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import type { CategoryData } from "@/data/categories";

export default function CategoryPageClient({
  category,
}: {
  category: CategoryData;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[448px] pt-[104px]">
        <div className="mb-20 min-h-[calc(100dvh-24rem)]">
          <div className="grid grid-cols-2 gap-x-2 gap-y-8 px-5 py-8">
            {category.products.map((product) => (
              <a key={product.href} className="shrink-0" href={product.href}>
                <div className="aspect-[295/370] w-full">
                  <img
                    className="h-full w-full rounded-xl border border-[#E1E1E1] object-cover"
                    alt={product.title}
                    src={product.img}
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 flex w-full flex-col gap-1 px-1">
                  <h5 className="truncate font-pretendard text-lg font-semibold text-[#111111]">
                    {product.title}
                  </h5>
                  <p className="line-clamp-1 font-pretendard text-sm font-medium leading-[130%] text-[#757575]">
                    {product.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <Footer />
        <div className="h-20" />
      </main>
      <BottomNav />
    </>
  );
}
