export class User {
  email: string;
  senha: string;
}

export class DadosUsuario {
  cpf: string;
  dataNascimento: string;
  nomeCompleto: string;
  sexo: string;
  telefone: string;
  endereco: Endereco;
}

export class Endereco {
  logradouro: string;
  cep: string;
  numero: string;
  uf: string;
  bairro: string;
}
