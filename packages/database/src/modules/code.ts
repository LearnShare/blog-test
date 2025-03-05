import prisma from '../prisma';

type CodeType = 'ACCOUNT_VERIFICATION' | 'RESET_PASSWORD';

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
async function searchCode(data: Record<string, any>) {
  try {
    const codeData = await prisma.code.findFirst({
      where: data,
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
