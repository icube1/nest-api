import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { Application } from './application.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import dataSource from './data.source';
import { ConfigModule } from '@nestjs/config';
import { ApplicationController } from './Application.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ArticleModule } from './article/article.module';

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
          ...dataSource,
          synchronize: true,
        } as unknown as PostgresConnectionOptions),
        TypeOrmModule.forFeature([Application]),
        ArticleModule,
      ],
      controllers: [ApplicationController],
      providers: [ApplicationService, AuthService, JwtService],
})
export class ApplicationModule {}