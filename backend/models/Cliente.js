class Cliente extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
        email: DataTypes.STRING,
        telefone: DataTypes.STRING,
        cpf: DataTypes.STRING,
        data_nascimento: DataTypes.DATE,
      },
      {
        sequelize,
      }
    );
  }
}