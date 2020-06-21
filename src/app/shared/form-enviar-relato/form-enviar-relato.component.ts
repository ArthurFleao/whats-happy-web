import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-enviar-relato',
  templateUrl: './form-enviar-relato.component.html',
  styleUrls: ['./form-enviar-relato.component.scss']
})
export class FormEnviarRelatoComponent implements OnInit {

  @Input()
  relatoRequired = true;
  @Input()
  includeCrp: boolean;
  // Form Group controla N Form Controls
  // Form Control controla UM campo.
  @Input()
  form: FormGroup; // É um grupo de Form Controls, permite controle de estado de validade de tudo que tem dentro, e
  // comandos utilitários tambem, permite que se nescessário, o componente de cima possa interferir no form
  @Input()
  bootstrap; // se quizer inicialisar o form

  @Output()
  formChange = new EventEmitter(); // evento de mudança no form

  @Output()
  submited = new EventEmitter(); // evento de envio no form
  constructor(
    private fb: FormBuilder// importa o formbuilder para poder usar
  ) { }

  ngOnInit(): void {

    // ------------------------ VALIDAR CAMPOS -------------
    this.form = this.fb.group({
      grauFelicidade: [this.bootstrap?.grauFelicidade || '', Validators.required],
      grauDisposicao: [this.bootstrap?.grauDisposicao || '', Validators.required],
      grauIrritabilidade: [this.bootstrap?.grauIrritabilidade || '', Validators.required],
      relato: [this.bootstrap?.relato || '', Validators.required],
    });

    this.formChange.emit(this.form); // emite o form construido para cima
    this.form.valueChanges.subscribe(c => { // sempre que houver uma mudança no form
      this.formChange.emit(this.form); // emite o form para cima
    });
  }

  onSubmit() {

    this.form.markAllAsTouched(); // Marcar que o usuário tentou interagir com todos os campos, para mostrar erros caso existam
    if (this.form.valid) { // se o formulário estiver válido
      console.log('form valido!', this.form.value);
      this.submited.emit(this.form.value); // avisar o componente de cima que o form foi enviado e mandar os valores
    } else {
      console.log('form invalido!', this.form.value);
    }
  }

}
