import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-prontuario',
  templateUrl: './form-prontuario.component.html',
  styleUrls: ['./form-prontuario.component.scss']
})
export class FormProntuarioComponent implements OnInit {

  // Form Control controla UM campo.
  @Input()
  arrayDadosFichasCadastro: Array<any>

  @Input()
  pacientesArray; // se quizer inicialisar o form

  @Input()
  bootstrap; // se quizer inicialisar o form

  @Input()
  form: FormGroup; // É um grupo de Form Controls, permite controle de estado de validade de tudo que tem dentro, e
  // comandos utilitários tambem, permite que se nescessário, o componente de cima possa interferir no form

  @Output()
  formChange = new EventEmitter(); // evento de mudança no form

  pacienteSelected

  constructor(
    private fb: FormBuilder// importa o formbuilder para poder usar
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      // ------------------------ dados do usuario -------------
      cabecalhoProtuario: this.fb.group({
        // formName: ['valorInicial', Validator]
        idPaciente: [this.bootstrap?.paciente || '', Validators.nullValidator],
        sexo: [this.bootstrap?.sexo || '', Validators.nullValidator],
        dataNascimento: [this.bootstrap?.dataNascimento || '', Validators.nullValidator],
        psicologo: [this.bootstrap?.nomeCompleto || '', Validators.nullValidator],
      }),

      // ------------------------ ficha de consulta -------------
      registroConsulta: this.fb.group({
        // formName: ['valorInicial', Validator]
        dcHda: [this.bootstrap?.dcHda || '', Validators.required],
        reacoesFrenteDiagnostico: [this.bootstrap?.reacoesFrenteDiagnostico || '', Validators.required],
        estadoEmocionalAtual: [this.bootstrap?.estadoEmocionalAtual || '', Validators.required],
        historicoPessoal: [this.bootstrap?.historicoPessoal || '', Validators.required],
        examePsiquico: [this.bootstrap?.examePsiquico || '', Validators.required],
        condutaPsicologica: [this.bootstrap?.condutaPsicologica || '', Validators.required],
        orientacao: [this.bootstrap?.orientacao || '', Validators.required],
        Outros: [this.bootstrap?.Outros || '', Validators.required],
      })

    });

  }

  onChange(value) {
    this.pacienteSelected = value.value
    this.formChange.emit(value.value.uid); // mada o valor pra cima
  }

}
