import prisma from '../prisma';

type CodeType = 'UNKNOWN' | 'IMAGE' | 'VIDEO' | 'AUDIO';

interface CodeData {
  code: string;
  type: CodeType;
  etime: Date;
}

// create code
async function createCode(accountId: number, codeData: CodeData) {
  try {
    const code = await prisma.code.create({
      data: {
        ...codeData,
        account: accountId,
      },
    });

    return {
      data: code,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// search with account and code
async function searchCode(accountId: number, code: string) {
  try {
    const codeData = await prisma.code.findFirst({
      where: {
        account: accountId,
        code,
      },
    });

    return {
      data: codeData,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

export default {
  createCode,
  searchCode,
};
