import { SetupError } from "@/components/layout/SetupError";
import { TagsManager } from "@/components/notes/TagsManager";
import { getTagsWithCount } from "@/lib/actions/tags";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const result = await getTagsWithCount()
    .then((tags) => ({ tags, error: "" }))
    .catch((error: Error) => ({ tags: [], error: error.message }));

  if (result.error) {
    return <SetupError message={result.error} />;
  }

  const tags = result.tags;
  return <TagsManager initialTags={tags} />;
}
