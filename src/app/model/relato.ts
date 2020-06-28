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
  transcriptionError?: any;
  noResults: boolean;
  audioUploaded?: boolean;
  confiabilidade?: number;
  analiseRelato?: any;
  analiseAudioTranscrito?: any;
  relatoAlertaScore?: number;
  audioAlertaScore?: number;
}
