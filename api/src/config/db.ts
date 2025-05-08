import { DataSource } from 'typeorm';
import { Task } from '../Models/Entities/task.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private dataSource: DataSource;

  private constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: false,
      entities: [Task],
    });
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }

  public async initializeDatabase(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }
}
export const ServerDataSource = DatabaseConfig.getInstance().getDataSource();
