import { Pagination } from "@heroui/react";

type Props = {
  page: number;
  count: number;
  onChange: (page: number) => void;
};

function getPageWindow(page: number, count: number): (number | "ellipsis")[] {
  if (count <= 7) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, count, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(p);
  });

  return result;
}

export function AppPagination({ page, count, onChange }: Props) {
  if (count <= 1) return null;

  const pages = getPageWindow(page, count);

  return (
    <div className="flex w-full justify-center py-6">
      <Pagination>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={page <= 1}
              onPress={() => onChange(page - 1)}
            >
              <Pagination.PreviousIcon />
              Anterior
            </Pagination.Previous>
          </Pagination.Item>

          {pages.map((p, index) =>
            p === "ellipsis" ? (
              <Pagination.Item key={`ellipsis-${index}`}>
                <Pagination.Ellipsis />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={p}>
                <Pagination.Link isActive={p === page} onPress={() => onChange(p)}>
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            ),
          )}

          <Pagination.Item>
            <Pagination.Next
              isDisabled={page >= count}
              onPress={() => onChange(page + 1)}
            >
              Próxima
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}
