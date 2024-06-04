import { Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application } from './application.entity';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  async getAllApplications(): Promise<Application[]> {
    return await this.applicationService.getAllApplications();
  }

  @Get(':id')
  async getApplicationById(@Param('id') id: number): Promise<Application> {
    const application = await this.applicationService.getApplicationById(id);
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    return application;
  }

  @Post()
  async createApplication(@Body() applicationData: Partial<Application>): Promise<Application> {
    const timeStamp = new Date()
    applicationData.receivedDate = timeStamp;
    return await this.applicationService.createApplication(applicationData);
  }

  @Patch(':id')
  async updateApplication(@Param('id') id: number, @Body() applicationData: Application): Promise<Application> {
    const updatedApplication = await this.applicationService.updateApplication(id, applicationData);
    if (!updatedApplication) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    return updatedApplication;
  }

  @Delete(':id')
  async deleteApplication(@Param('id') id: number): Promise<void> {
    const deleted = await this.applicationService.deleteApplication(id);
    if (!deleted) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
  }
  //   @ts-ignore
  @Delete()
  async deleteAllApps(): Promise<void> {
    await this.applicationService.deleteAllApplications();
  }
}