import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationNavProps = {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  basePath: string;
  queryParams?: URLSearchParams;
};

export function PaginationNav({
  currentPage,
  totalItems,
  pageSize = 9,
  basePath,
  queryParams,
}: PaginationNavProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const params = new URLSearchParams(queryParams?.toString() || "");
  const buildHref = (page: number) => {
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <Pagination className="mt-10 justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(Math.max(1, currentPage - 1))}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          return (
            <PaginationItem key={page}>
              <PaginationLink href={buildHref(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href={buildHref(Math.min(totalPages, currentPage + 1))}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

