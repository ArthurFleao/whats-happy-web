import { Psicologo } from './psicologo';
import { Paciente } from './paciente';
import { DadosUsuario } from './dadosUsuario';
export class User {
  email?: string;
  senha?: string;
  uid?: string;
  isPaciente?: boolean;
  isPsicologo?: boolean;
  dadosUsuario?: DadosUsuario;
  dadosPaciente?: Paciente;
  dadosPsicologo?: Psicologo;
}
