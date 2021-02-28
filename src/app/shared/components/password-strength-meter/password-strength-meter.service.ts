import { Injectable } from '@angular/core';

@Injectable()
export class PasswordStrengthMeterService {
  constructor() {}

  /**
   *  this will return the password strength score in number
   *  0 - too guessable
   *  1 - very guessable
   *  2 - somewhat guessable
   *  3 - safely unguessable
   *  4 - very unguessable
   *
   *  @param password - Password
   */
  score(password): number {
    const result = this.checkStrength(password);
    return result;
  }

  /**
   * this will return the password strength score with feedback messages
   * return type { score: number; feedback: { suggestions: string[]; warning: string } }
   *
   * @param password - Password
   */
  scoreWithFeedback(
    password
  ): { score: number; feedback: { suggestions: string[]; warning: string } } {
    const result = this.checkStrength(password);
    // return { score: result.score, feedback: result.feedback };
    return { score: result, feedback: null };
  }

  checkStrength(p): number {
    // 1
    let force = 0;

    // 2
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);

    // 3
    const flags = [lowerLetters, upperLetters, numbers, symbols];

    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    // 5
    force += 2 * p.length + (p.length >= 8 ? 1 : 0);
    force += passedMatches * 10;

    // 6
    force = p.length <= 6 ? Math.min(force, 10) : force;

    // 7
    force = passedMatches === 1 ? Math.min(force, 1) : force;
    force = passedMatches === 2 ? Math.min(force, 2) : force;
    force = passedMatches === 3 ? Math.min(force, 3) : force;
    force = passedMatches === 4 ? Math.min(force, 4) : force;

    return force;
  }
}
