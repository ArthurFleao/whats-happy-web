import { environment } from './../../../environments/environment';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent implements OnInit {

  // Form Group controla N Form Controls
  // Form Control controla UM campo.
  @Input()
  form: FormGroup; // É um grupo de Form Controls, permite controle de estado de validade de tudo que tem dentro, e
  // comandos utilitários tambem, permite que se nescessário, o componente de cima possa interferir no form
  @Input()
  loginBoostrap; // se quizer inicialisar o form

  showTest = environment.enableTests;

  @Output()
  formChange = new EventEmitter(); // evento de mudança no form
  @Output()
  submited = new EventEmitter(); // evento de envio no form
  constructor(
    private fb: FormBuilder// importa o formbuilder para poder usar
  ) {
  }

  ngOnInit(): void {

    // ------------------------ CAMPOS -------------
    this.form = this.fb.group({
      // formName: ['valorInicial', Validator]
      login: [this.loginBoostrap?.login || '', Validators.required],
      senha: [this.loginBoostrap?.senha || '', Validators.required]
    });
    // ------------------------ FIM CAMPOS -------------

    this.formChange.emit(this.form); // emite o form construido para cima
    this.form.valueChanges.subscribe(c => { // sempre que houver uma mudança no form
      this.formChange.emit(this.form); // emite o form para cima
    });
  }

  onSubmit() {
    this.form.markAllAsTouched(); // Marcar que o usuário tentou interagir com todos os campos, para mostrar erros caso existam
    if (this.form.valid) { // se o formulário estiver válido
      this.submited.emit(this.form.value); // avisar o componente de cima que o form foi enviado e mandar os valores
    }
  }

  setValidTestValues() {
    this.form.patchValue({
      login: 'admin@email.com',
      senha: '123456'
    });
  }
  rand() {
    return Math.floor((Math.random() * 9999) + 1);
  }

}
