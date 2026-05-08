import { ListChecks, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";

export function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Tasks</h1>
        <p className="mt-2 text-sm text-zinc-400">Task board and advanced filtering are being finalized.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-emerald-300" />
            Tasks module in progress
          </CardTitle>
          <CardDescription>
            Task data is available via <span className="font-mono text-zinc-300">GET /api/tasks</span>. Kanban/list
            visualization is next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            <div className="inline-flex items-center gap-2 font-medium">
              <Sparkles className="h-4 w-4" />
              Coming next
            </div>
            <p className="mt-1 text-emerald-100/90">Task grouping by status, due-date sorting, and assignment filters.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

