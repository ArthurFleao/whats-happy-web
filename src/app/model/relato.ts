export class Relato {
  dataHora: string;
  grauDisposicao: string;
  grauFelicidade: string;
  grauIrritabilidade: string;
  relato: string;
  uid?: string;
  new?: boolean;
  hasAudio?: boolean;
  audioTranscrito?: string;
  transcript?: [];
  pacienteUid: string;
  transcriptionFailed?: any;
  noResults: boolean;
}
