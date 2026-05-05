"use client";

import { useEffect } from "react";
import { record } from "@/lib/recently-viewed";

interface RecordViewProps {
  type: "movie" | "tv";
  id: number;
  title: string;
  poster_url: string | null;
  year: number | null;
}

export function RecordView(props: RecordViewProps) {
  useEffect(() => {
    record(props);
  }, [props.type, props.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
