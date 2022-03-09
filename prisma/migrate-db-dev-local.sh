# This script applies database migration in local development environment
export DATABASE_URL="postgresql://postgres:password@localhost:15432/dialect?schema=public"
export ENVIRONMENT="dev-local"
yarn prisma generate
yarn prisma migrate dev
yarn prisma db seed