class AdminRoutes {
  private static readonly PATH_ADMIN = '/admin';
  private static readonly PATH_LOGIN = '/login';

  public static admin() {
    return this.PATH_ADMIN;
  }

  public static login() {
    return this.PATH_LOGIN;
  }

  public static settings() {
    return `${this.PATH_ADMIN}/parametre`;
  }

  public static guides() {
    return `${this.PATH_ADMIN}/guides`;
  }

  public static users() {
    return `${this.PATH_ADMIN}/users`;
  }

  public static userDetail(id: string) {
    return `${this.PATH_ADMIN}/users/${id}`;
  }

  public static dashboard() {
    return `${this.PATH_ADMIN}/dashboard`;
  }

  public static tickets() {
    return `${this.PATH_ADMIN}/tickets`;
  }

  public static disputes() {
    return `${this.PATH_ADMIN}/disputes`;
  }
}

export default AdminRoutes;
