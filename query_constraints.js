const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.qramzmtkeppludkbqxiy:Windtodo1234%21@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres'
    }
  }
});
prisma.$queryRaw`SELECT conname, pg_get_constraintdef(c.oid) FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE t.relname = 'Project'`
  .then(res => { console.log(res); prisma.$disconnect() })
  .catch(err => { console.error(err); prisma.$disconnect() });
