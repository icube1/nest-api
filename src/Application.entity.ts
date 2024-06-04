import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number; // Номер заявки

  @Column({ type: 'timestamp' })
  receivedDate: Date; // Дата и время получения заявки от клиента

  @Column()
  clientCompanyName: string; // Название фирмы клиента

  @Column()
  carrierName: string; // ФИО перевозчика

  @Column()
  carrierPhone: string; // Контактный телефон перевозчика

  @Column()
  comments: string; // Комментарии

  @Column({ default: 'new' })
  status: string; // Статус заявки

  @Column()
  atiCode: string; // ATI код сети перевозчика

  // Method to generate clickable ATI link
  getAtiLink(): string {
    return `https://ati.su/firms/${this.atiCode}/info`;
  }
}