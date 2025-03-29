import {
  PrismaClient,
} from '../client';

const prisma = new PrismaClient({
  log: [
    // {
    //   level: 'query',
    //   emit: 'event',
    // },
    {
      level: 'error',
      emit: 'stdout',
    },
    // {
    //   level: 'info',
    //   emit: 'stdout',
    // },
    // {
    //   level: 'warn',
    //   emit: 'stdout',
    // },
  ],
});

// prisma.$on('query', (event) => {
//   console.log('[Query]:', event.query);
//   console.log('[Params]:', event.params);
//   console.log('[Duration]:', `${event.duration} ms`, '\n');
// });

export default prisma;
