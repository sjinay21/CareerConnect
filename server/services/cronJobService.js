import { insertCronJobLog } from "../models/CronJob.js";

async function logCronJobExecution(jobName, successCount, rejectCount) {
  try {
    return await insertCronJobLog(jobName, successCount, rejectCount);
  } catch (error) {
    console.error(`Failed to log cron job execution for ${jobName}:`, error);
  }
}

export { logCronJobExecution };
