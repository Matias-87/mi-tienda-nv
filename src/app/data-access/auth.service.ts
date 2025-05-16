import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, UserCredential } from '@angular/fire/auth';
import { Credential } from '../interfaces/credentials.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  
  readonly authState$ = authState(this.auth);

  async signUpWithEmailAndPassWord(credential: Credential & {storeName?: string}): Promise<UserCredential>{
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    );

    if (credential.storeName) {
      await updateProfile(userCredential.user, {
        displayName: credential.storeName
      })
    }

    return userCredential;
  }

  // Luego de reestructurar la base de datos para que cada usuario
  // acceda a sus datos, tenes que implementar una forma de guardar
  // el nombre de usuario

  logInWithEmailAndPassword(credential: Credential) {
    return signInWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    )
  }

  // MAS ADELANTE... Cuando ya este hecha una pestaña de perfil
  //o algo asi, tenes que implementar el log-out.

  logOut(): Promise<void> {
    return this.auth.signOut()
  }
}
