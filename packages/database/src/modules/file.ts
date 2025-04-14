import prisma from '../prisma';

import {
  type FileType,
} from '@packages/types';

export interface FilesQuery {
  creator?: number;
  sort: string;
  page: number;
  size: number;
}

// get files
async function getFiles(fileQuery: FilesQuery) {
  const {
    creator,
    sort,
    page,
    size,
  } = fileQuery;

  // order by
  const name = sort.startsWith('-')
    ? sort.substring(1)
    : sort;
  const direction = sort.startsWith('-')
    ? 'desc'
    : 'asc';

  const query = creator
      ? {
        creator,
      }
      : {};

  const count = await prisma.file.count({
    where: query,
  });

  const list = await prisma.file.findMany({
    where: query,
    orderBy: {
      [name]: direction,
    },
    skip: (page - 1) * size,
    take: size,
  });

  const data = {
    count,
    page,
    size,
    list,
  };

  return {
    data,
  };
}

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
  const file = await prisma.file.create({
    data: {
      ...fileData,
      creator: accountId,
    },
  });

  return {
    data: file,
  };
}

// get file info by id
async function getFileById(id: number) {
  const file = await prisma.file.findUnique({
    where: {
      id,
    },
  });

  return {
    data: file,
  };
}

// get file info by hash
async function getFileByHash(hash: string) {
  const file = await prisma.file.findUnique({
    where: {
      hash,
    },
  });

  return {
    data: file,
  };
}

// get file stats
async function getStats(creator?: number) {
  const creatorQuery = creator
      ? {
        creator,
      }
      : {};

  const total = await prisma.file.count({
    where: {
      ...creatorQuery,
    },
  });
  const sizeSum = await prisma.file.aggregate({
    where: {
      ...creatorQuery,
    },
    _sum: {
      size: true,
    },
  });

  const totalSize = sizeSum._sum.size
      || 0;

  return {
    data: {
      total,
      totalSize,
    },
  };
}

export default {
  getFiles,
  createFile,
  getFileById,
  getFileByHash,
  getStats,
};
