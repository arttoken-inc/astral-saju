import Link from "next/link";

const services = [
  { id: "bluemoonladysaju", name: "청월아씨 정통사주", description: "정통 사주팔자 서비스" },
];

export default function ServicesPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 font-pretendard text-xl font-bold text-gray-900">서비스 관리</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/admin/services/${s.id}`}
            className="rounded-lg border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
          >
            <h3 className="font-pretendard text-base font-semibold text-gray-900">{s.name}</h3>
            <p className="mt-1 font-pretendard text-sm text-gray-500">{s.description}</p>
            <p className="mt-3 font-pretendard text-xs text-blue-600">편집하기 &rarr;</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
