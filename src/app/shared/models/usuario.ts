export class Usuario {
  /**
   *
   * @param email: string
   * @param name: string
   * @param lastName: string
   * @param token: string
   * @param tokenExpirationDate: string
   */
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public lastName: string,
    private token: string,
    private tokenExpirationDate
  ) {}

  get stoken(): string {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this.token;
  }
}
