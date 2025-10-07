"use client";

import * as React from "react";
import { Button, ActionIcon, Text, Group } from "@mantine/core";
import {
  HiChevronLeft,
  HiChevronRight,
  HiMiniEllipsisHorizontal,
} from "react-icons/hi2";
import { LinkButton } from "./link-button";

// ---------- Pagination Context ----------
interface PaginationContextValue {
  page: number;
  totalPages: number;
  count: number;
  pageRange: { start: number; end: number };
  previousPage?: number;
  nextPage?: number;
  onPageChange?: (page: number) => void;
}

const PaginationContext = React.createContext<PaginationContextValue | null>(
  null
);

export const usePaginationContext = () => {
  const context = React.useContext(PaginationContext);
  if (!context)
    throw new Error("usePaginationContext must be used within PaginationRoot");
  return context;
};

// ---------- Root ----------
interface PaginationRootProps {
  page: number;
  totalPages: number;
  count: number;
  pageRange?: { start: number; end: number };
  children: React.ReactNode;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export const PaginationRoot: React.FC<PaginationRootProps> = ({
  page,
  totalPages,
  count,
  pageSize = 5, // default to 5 if not provided
  pageRange = { start: 0, end: totalPages ?? Math.ceil(count / pageSize) },
  onPageChange,
  children,
}) => {
  const computedTotalPages = totalPages ?? Math.ceil(count / pageSize);

  const previousPage = page > 1 ? page - 1 : undefined;
  const nextPage = page < computedTotalPages ? page + 1 : undefined;

  return (
    <PaginationContext.Provider
      value={{
        page,
        totalPages: computedTotalPages,
        count,
        pageRange,
        previousPage,
        nextPage,
        onPageChange, // pass down to items if needed
      }}
    >
      <Group gap="xs">{children}</Group>
    </PaginationContext.Provider>
  );
};

// ---------- Item ----------
interface PaginationItemProps {
  value: number;
  getHref?: (page: number) => string;
}

export const PaginationItem: React.FC<PaginationItemProps> = ({
  value,
  getHref,
}) => {
  const { page, onPageChange } = usePaginationContext();
  const current = page === value;

  const handleClick = () => {
    if (onPageChange) onPageChange(value);
  };
  if (getHref) {
    return (
      <LinkButton
        href={getHref(value)}
        variant={current ? "filled" : "outline"}
      >
        {value}
      </LinkButton>
    );
  }

  return (
    <Button variant={current ? "filled" : "outline"} onClick={handleClick}>
      {value}
    </Button>
  );
};

// ---------- Ellipsis ----------
export const PaginationEllipsis: React.FC = () => (
  <Button variant="subtle">
    <HiMiniEllipsisHorizontal />
  </Button>
);

// ---------- Prev / Next ----------
interface PaginationTriggerProps {
  getHref?: (page: number) => string;
}

export const PaginationPrevTrigger: React.FC<PaginationTriggerProps> = ({
  getHref,
}) => {
  const { previousPage, onPageChange } = usePaginationContext();
  if (!previousPage) return null;

  const handleClick = () => {
    if (onPageChange && previousPage) onPageChange(previousPage);
  };

  if (getHref)
    return (
      <LinkButton href={getHref(previousPage)}>
        <HiChevronLeft />
      </LinkButton>
    );

  return (
    <ActionIcon onClick={handleClick}>
      <HiChevronLeft />
    </ActionIcon>
  );
};

export const PaginationNextTrigger: React.FC<PaginationTriggerProps> = ({
  getHref,
}) => {
  const { nextPage, onPageChange } = usePaginationContext();
  if (!nextPage) return null;
  const handleClick = () => {
    if (onPageChange && nextPage) onPageChange(nextPage);
  };

  if (getHref)
    return (
      <LinkButton href={getHref(nextPage)}>
        <HiChevronRight />
      </LinkButton>
    );

  return (
    <ActionIcon onClick={handleClick}>
      <HiChevronRight />
    </ActionIcon>
  );
};

// ---------- PaginationItems ----------
interface PaginationItemsProps {
  getHref?: (page: number) => string;
}

export const PaginationItems: React.FC<PaginationItemsProps> = ({
  getHref,
}) => {
  const { totalPages } = usePaginationContext();

  // Render all pages as PaginationItem for now; could add ellipsis logic later
  return (
    <>
      {Array.from({ length: totalPages }, (_, i) => (
        <PaginationItem key={i} value={i + 1} getHref={getHref} />
      ))}
    </>
  );
};

// ---------- Page Text ----------
interface PaginationPageTextProps {
  format?: "short" | "compact" | "long";
}

export const PaginationPageText: React.FC<PaginationPageTextProps> = ({
  format = "compact",
}) => {
  const { page, totalPages, pageRange, count } = usePaginationContext();

  const content = React.useMemo(() => {
    if (format === "short") return `${page} / ${totalPages}`;
    if (format === "compact") return `${page} of ${totalPages}`;
    return `${pageRange.start + 1} - ${Math.min(pageRange.end, count)} of ${count}`;
  }, [format, page, totalPages, pageRange, count]);

  return <Text>{content}</Text>;
};
