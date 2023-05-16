import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ url }) => {
  const gridView = url.searchParams.get("view") !== "list"
  return { gridView }
}
