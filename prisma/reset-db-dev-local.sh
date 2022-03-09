# This script resets database and applies schema w/o migration procedure
export DATABASE_URL="postgresql://postgres:password@localhost:15432/dialect?schema=public"
export ENVIRONMENT="dev-local"
yarn prisma generate && yarn prisma db push --force-reset --accept-data-loss && yarn prisma db seed