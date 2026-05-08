import { FolderKanban, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";

export function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Projects</h1>
        <p className="mt-2 text-sm text-zinc-400">Project workspace is being expanded with full list and filters.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-indigo-300" />
            Projects module in progress
          </CardTitle>
          <CardDescription>
            Data is available via <span className="font-mono text-zinc-300">GET /api/projects</span>. UI list, search, and
            actions are next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
            <div className="inline-flex items-center gap-2 font-medium">
              <Sparkles className="h-4 w-4" />
              Coming next
            </div>
            <p className="mt-1 text-indigo-100/90">Project cards, member counts, and quick access actions.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

