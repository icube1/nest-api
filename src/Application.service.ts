import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}
  
async createApplication(appData: Partial<Application>): Promise<Application> {
    const newApp = this.applicationRepository.create(appData);
    return await this.applicationRepository.save(newApp);
  }

  async getAllApplications(): Promise<Application[]> {
    return this.applicationRepository.find();
  }

  async deleteAllApplications(): Promise<void> {
    await this.applicationRepository.find()
    .then(array => {
        array.map(app => {
            this.applicationRepository.delete({id: app.id, receivedDate: app.receivedDate});
        })
    })
  }

  async getApplicationById(id: number): Promise<Application> {
    return this.applicationRepository.findOne({ where: { id } });
  }

  async updateApplication(id: number, applicationData: Partial<Application>): Promise<Application> {
    await this.applicationRepository.update(id, applicationData);
    return this.applicationRepository.findOne({ where: { id } });
  }

  async deleteApplication(id: number): Promise<boolean> {
    return await this.applicationRepository.delete(id)
        .then(()=> true)
        .catch(()=> false)
  }
}