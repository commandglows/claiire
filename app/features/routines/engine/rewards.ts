export type RoutineRewards = {
  actionXP: number;
  bonusXP: number;
  xpAwarded: number;
};

export function getRoutineRewards(
  actionIds: readonly string[],
  completedCount: number,
): RoutineRewards {
  const isSafetySensitive = actionIds.some((id) =>
    id.startsWith("relationship-reflection-"),
  );
  const actionXP = isSafetySensitive ? 0 : completedCount * 10;
  const bonusXP =
    !isSafetySensitive && completedCount === actionIds.length ? 20 : 0;
  return { actionXP, bonusXP, xpAwarded: actionXP + bonusXP };
}
