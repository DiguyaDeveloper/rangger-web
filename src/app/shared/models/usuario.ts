export class Usuario {
  /**
   *
   * @param email: string
   * @param name: string
   * @param sobrenome: string
   * @param _token: string
   * @param _tokenExpirationDate: string
   */
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public sobrenome: string,
    private _token: string,
    private _tokenExpirationDate
  ) {}

  get token(): string {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
