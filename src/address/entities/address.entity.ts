import { UsersDocument } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('address')
export class AddressDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  zip_code: string;

  @Column()
  province: string;

  @OneToOne(() => UsersDocument, (user: UsersDocument) => user.address)
  public user: UsersDocument;

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
}
