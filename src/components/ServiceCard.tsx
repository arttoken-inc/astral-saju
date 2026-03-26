interface ServiceCardProps {
  title: string;
  desc: string;
  href: string;
  img: string;
}

export default function ServiceCard({ title, desc, href, img }: ServiceCardProps) {
  return (
    <a className="block w-full" href={href}>
      <div className="relative w-full">
        <img
          className="w-full object-cover"
          alt={title}
          src={img}
        />
      </div>
      <h3 className="ml-1 mt-3 truncate font-pretendard text-lg font-semibold leading-[130%] text-[#111111] md:mt-5 md:text-2xl">
        {title}
      </h3>
      <p className="ml-1 mt-1 font-pretendard text-sm font-medium leading-[130%] text-[#757575] md:mt-1 md:text-xl">
        {desc}
      </p>
    </a>
  );
}
