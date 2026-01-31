// prompts/planTasks.prompt.ts

/**
 * Plan Tasks Prompt
 * Breaks down an order into operational tasks
 */
export function planTasksPrompt(context: any): string {
  return `
You are planning work for a garment shop.

ORDER AND CONTEXT:
${JSON.stringify(context, null, 2)}

Break this order into operational tasks. Consider:
- Each item may need multiple steps (cutting, stitching, finishing, etc.)
- Match required skills to available workers
- Suggest workers with matching skills and lower current workload
- Estimate time realistically (include buffers)

TASK TYPES TO CONSIDER:
- Material preparation (cutting fabric, gathering supplies)
- Main work (stitching, tailoring, alterations)
- Finishing (buttons, hemming, pressing)
- Quality check
- Packaging/Delivery preparation

Return JSON array only:
[
  {
    "title": "Task name",
    "description": "What needs to be done",
    "requiredSkills": ["skill1", "skill2"],
    "estimatedMin": 60,
    "suggestedWorkerId": "worker_id (if a good match exists)"
  }
]

RULES:
- Create 2-5 tasks per order (don't over-fragment)
- Be realistic with time estimates
- Only suggest workers who have matching skills
- If no good worker match, omit suggestedWorkerId
`;
}
