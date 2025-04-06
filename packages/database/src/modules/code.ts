import prisma from '../prisma';

type CodeType = 'ACCOUNT_VERIFICATION' | 'RESET_PASSWORD';

interface CodeData {
  code: string;
  type: CodeType;
  etime: Date;
}

// create code
async function createCode(accountId: number, codeData: CodeData) {
  const code = await prisma.code.create({
    data: {
      ...codeData,
      account: accountId,
    },
  });

  return {
    data: code,
  };
}

// search with account and code
async function searchCode(data: Record<string, any>) {
  const codeData = await prisma.code.findFirst({
    where: data,
  });

  return {
    data: codeData,
  };
}

interface UpdateData {
  used: boolean;
}

// update code
async function updateCode(id: number, data: UpdateData) {
  const codeData = await prisma.code.update({
    where: {
      id,
    },
    data,
  });

  return {
    data: codeData,
  };
}

// count code by accountId
async function countCodeByAccountId(accountId: number) {
  const count = await prisma.code.count({
    where: {
      account: accountId,
    },
  });

  return {
    data: {
      count,
    },
  };
}

export default {
  createCode,
  searchCode,
  updateCode,
  countCodeByAccountId,
};
