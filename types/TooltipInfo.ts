/** Cấu trúc tooltip hiển thị */
export interface TooltipInfo {
  title: string;
  description?: string;
  imageUrl?: string;
  owner?: string;
  sourceUrl?: string;
}
/** Cấu hình request API Pinterest */
export interface PinterestRequestPayload {
  options: {
    id: string;
    field_set_key?: "detailed" | "unauthenticated";
  };
  context: Record<string, unknown>;
}
