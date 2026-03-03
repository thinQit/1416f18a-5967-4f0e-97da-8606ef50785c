"use client";

import React, { useState } from "react";

export interface ProductFormValues {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  sku?: string;
  stock?: number;
  images?: string;
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  submitLabel?: string;
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  sku: "",
  stock: 0,
  images: ""
};

export function ProductForm({ initialValues, onSubmit, submitLabel = "Save" }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    ...defaultValues,
    ...initialValues
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          rows={4}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="price">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={values.price}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="imageUrl">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          value={values.imageUrl}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <button type="submit" className="rounded bg-black px-4 py-2 text-white">
        {submitLabel}
      </button>
    </form>
  );
}

export default ProductForm;
