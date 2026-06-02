export function getRouteScrollKey(pathname, searchParams) {
  const path = pathname || "/";
  const query = searchParams ? String(searchParams) : "";
  return query ? `${path}?${query}` : path;
}
