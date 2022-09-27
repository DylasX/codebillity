import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: '123',
  database: 'codebillity',
  synchronize: true,
  logging: false,
  entities: ['src/**/entities/*.{js,ts}', 'src/**/**/entities/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
});
