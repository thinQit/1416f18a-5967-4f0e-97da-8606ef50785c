import Link from "next/link";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Product</h1>
      <p className="mb-6 text-gray-600">Editing product with ID: {params.id}</p>
      <div className="rounded border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">
          Product editing form will go here.
        </p>
      </div>
      <Link href="/products" className="mt-6 inline-block text-blue-600">
        Back to products
      </Link>
    </main>
  );
}
