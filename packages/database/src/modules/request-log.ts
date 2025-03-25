import prisma from '../prisma';

type TargetType = 'POST';

export interface RequestData {
  ip: string;
  target: number;
  type: TargetType;
}

// create log
async function createLog(logData: RequestData) {
  try {
    await prisma.requestLog.create({
      data: logData,
    });
  } catch (error) {
    console.log(error);
  }
}

export default {
  createLog,
};
