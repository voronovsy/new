
"use client"

import * as React from "react"
import { Bot, Calendar, Clock, AlertTriangle, Lightbulb, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { JiraIssue, PredictWorkloadAndTaskCompletionOutput } from "@/lib/types"
import { predictWorkload } from "@/app/actions"

type WorkloadPredictionDialogProps = {
  isOpen: boolean
  onClose: () => void
  task: JiraIssue | null
}

export function WorkloadPredictionDialog({ isOpen, onClose, task }: WorkloadPredictionDialogProps) {
  const [prediction, setPrediction] = React.useState<PredictWorkloadAndTaskCompletionOutput | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleGeneratePrediction = async () => {
    if (!task) return;
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await predictWorkload({ task });
      if (result.success) {
        setPrediction(result.data);
      } else {
        setError(result.error || "An unexpected error occurred.");
      }
    } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      setPrediction(null)
      setError(null)
      setIsLoading(false)
    }
  }, [isOpen])

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Bot className="h-6 w-6 text-accent" />
            AI Workload Prediction
          </DialogTitle>
          <DialogDescription>
            {task.key}: {task.fields.summary}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Task Details</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <p><strong>Type:</strong> {task.fields.issuetype.name}</p>
                        <p><strong>Status:</strong> <Badge variant="outline">{task.fields.status.name}</Badge></p>
                        <p><strong>Priority:</strong> <Badge variant={task.fields.priority?.name === 'High' ? 'destructive' : 'secondary'}>{task.fields.priority?.name || 'N/A'}</Badge></p>
                        <p><strong>Complexity:</strong> {task.fields.customfield_25904?.value || 'N/A'}</p>
                    </CardContent>
                </Card>
                <Button onClick={handleGeneratePrediction} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        "Generate Prediction"
                    )}
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                {error && (
                    <Card className="border-destructive bg-destructive/10">
                        <CardHeader>
                            <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                                <AlertTriangle className="h-5 w-5" />
                                Prediction Error
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-destructive">{error}</p>
                        </CardContent>
                    </Card>
                )}
                {prediction ? (
                    <div className="space-y-4 animate-in fade-in-50">
                        <Card>
                            <CardHeader className="flex-row items-center gap-2 space-y-0">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-lg">Estimated Workload</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{prediction.estimatedWorkload}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex-row items-center gap-2 space-y-0">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-lg">Estimated Completion Date</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{new Date(prediction.estimatedCompletionDate).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex-row items-center gap-2 space-y-0">
                                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-lg">Potential Bottlenecks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{prediction.potentialBottlenecks}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex-row items-center gap-2 space-y-0">
                                <Lightbulb className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-lg">Process Improvements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{prediction.processImprovementOpportunities}</p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full rounded-lg border border-dashed text-muted-foreground">
                        <p>Prediction results will appear here</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
