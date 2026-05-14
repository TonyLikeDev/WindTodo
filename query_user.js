const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.qramzmtkeppludkbqxiy:Windtodo1234%21@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres'
    }
  }
});
prisma.$queryRaw`SELECT * FROM "User"`
  .then(res => { console.log(res); prisma.$disconnect() })
  .catch(err => { console.error(err); prisma.$disconnect() });
