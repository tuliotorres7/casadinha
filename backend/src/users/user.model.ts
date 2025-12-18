import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  googleId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  picture: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1000,
  })
  coins: number; // Moedas virtuais para apostar

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
