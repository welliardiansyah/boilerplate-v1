import { AddressDocument } from 'src/address/entities/address.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserStatus {
  Waiting_for_approval = 'WAITING_FOR_APPROVAL',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Rejected = 'REJECTED',
}

@Entity('users')
export class UsersProfileValidation {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  fullname: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status?: UserStatus;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  email_verified_at?: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  phone_verified_at?: Date;

  @Column('uuid', { nullable: true })
  role_id?: string;

  role_name: string;

  @Column({ nullable: true })
  refresh_token: string;

  @OneToOne(() => AddressDocument, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: AddressDocument;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updated_at?: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deleted_at: Date;

  constructor(init?: Partial<UsersProfileValidation>) {
    Object.assign(this, init);
  }
}
