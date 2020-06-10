import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-registrar-consulta',
  templateUrl: './form-registrar-consulta.component.html',
  styleUrls: ['./form-registrar-consulta.component.scss']
})
export class FormRegistrarConsultaComponent implements OnInit {

  @Input()
  bootstrap; // se quizer inicialisar o form
  // Form Group controla N Form Controls
  // Form Control controla UM campo.
  @Output()
  formChange = new EventEmitter(); // evento de mudança no form

  @Input()
  form: FormGroup; // É um grupo de Form Controls, permite controle de estado de validade de tudo que tem dentro, e
  // comandos utilitários tambem, permite que se nescessário, o componente de cima possa interferir no form

  @Output()
  submited = new EventEmitter(); // evento de envio no form

  @Input()
  pacientesArray; // se quizer inicialisar o form

  constructor(
    private fb: FormBuilder// importa o formbuilder para poder usar
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      // ------------------------ dados do usuario -------------
      dadosUsuario: this.fb.group({
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

    this.formChange.emit(this.form); // emite o form construido para cima
    this.form.valueChanges.subscribe(c => { // sempre que houver uma mudança no form
    this.formChange.emit(this.form); // emite o form para cima
    });

  }

  onSubmit(){
    this.form.markAllAsTouched(); // Marcar que o usuário tentou interagir com todos os campos, para mostrar erros caso existam
    if (this.form.valid) { // se o formulário estiver válido
      this.submited.emit(this.form.value); // avisar o componente de cima que o form foi enviado e mandar os valores
    } else {
      console.log('form invalido!', this.form.value);
    }
  }

}
