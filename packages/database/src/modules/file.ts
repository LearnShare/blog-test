import prisma from '../prisma';

type FileType = 'UNKNOWN' | 'IMAGE' | 'VIDEO' | 'AUDIO';

interface FileData {
  hash: string;
  type: FileType;
  mime: string;
  name: string;
  ext: string;
  size: number;
}

// create file
async function createFile(accountId: number, fileData: FileData) {
  try {
    const file = await prisma.file.create({
      data: {
        ...fileData,
        creator: accountId,
      },
    });

    return {
      data: file,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// get file info by id
async function getFileById(id: number) {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id,
      },
    });

    return {
      data: file,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// get file info by hash
async function getFileByHash(hash: string) {
  try {
    const file = await prisma.file.findUnique({
      where: {
        hash,
      },
    });

    return {
      data: file,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

export default {
  createFile,
  getFileById,
  getFileByHash,
};
