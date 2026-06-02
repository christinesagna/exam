import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      category_id: searchParams.get("category_id") || "",
      min_price: searchParams.get("min_price") || "",
      max_price: searchParams.get("max_price") || "",
      sort: searchParams.get("sort") || "latest",
      page: Number(searchParams.get("page") || 1),
    }),
    [searchParams]
  );

  const updateParams = (patch = {}) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(patch).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (key === "page" && Number(value) === 1)
      ) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    if (!("page" in patch)) {
      next.delete("page");
    }

    setSearchParams(next);
  };

  const resetParams = () => {
    setSearchParams(new URLSearchParams());
  };

  const setPage = (page) => {
    updateParams({ page });
  };

  return {
    params,
    updateParams,
    resetParams,
    setPage,
  };
}
