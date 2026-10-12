// Original illustrative code: never extracted from an employer repository.
export const codeScenes = [
  {
    path: "~/Projects/inference/stream.cs",
    language: "C#",
    code: `// illustrative · streaming an inference response
using System.Diagnostics;
using System.Runtime.CompilerServices;

public sealed class InferenceStream
{
    private readonly IModelClient model;
    private readonly IMetricSink metrics;

    public async IAsyncEnumerable<string> Generate(
        Conversation conversation,
        [EnumeratorCancellation] CancellationToken cancellation)
    {
        var timer = Stopwatch.StartNew();
        var firstToken = true;
        var outputTokens = 0;

        await foreach (var token in model.StreamAsync(
            conversation.Messages, cancellation))
        {
            cancellation.ThrowIfCancellationRequested();

            if (firstToken)
            {
                metrics.Observe("time_to_first_token", timer.Elapsed);
                firstToken = false;
            }

            outputTokens++;
            yield return token.Text;
        }

        metrics.Observe("generated_tokens", outputTokens);
        metrics.Observe("generation_duration", timer.Elapsed);
    }
}

// latency and throughput tell different stories.
// measure both. keep the context. respect the budget.
public record Conversation(IReadOnlyList<Message> Messages);
public record Message(string Role, string Content);
public record Token(string Text);
// end of illustrative buffer`,
  },
  {
    path: "~/Projects/agents/workflow.ts",
    language: "TypeScript",
    code: `// illustrative · a bounded conversation workflow
type State = {
    messages: Message[];
    context: string[];
    remainingSteps: number;
};

async function respond(state: State, signal: AbortSignal) {
    const context = await retrieve(state.messages, signal);
    const request = {
        messages: state.messages,
        context,
        stream: true,
    };

    for await (const token of model.generate(request, signal)) {
        if (signal.aborted) break;
        yieldToConversation(token);
    }
}

function nextStep(state: State) {
    if (state.remainingSteps <= 0) return "finish";
    const last = state.messages.at(-1);

    if (!last) return "listen";
    if (last.toolCalls?.length) return "tools";
    return "respond";
}

const graph = workflow
    .node("listen", transcribe)
    .node("retrieve", retrieve)
    .node("respond", respond)
    .node("tools", executeAllowedTools)
    .route("respond", nextStep)
    .compile();

// explicit state. bounded work. observable execution.
// every transition has a reason.
// every request can be cancelled.
// end of illustrative buffer`,
  },
];
