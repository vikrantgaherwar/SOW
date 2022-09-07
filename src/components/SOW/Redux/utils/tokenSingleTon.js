import axios from "axios";

export class TokenSingleton {
  constructor() {
    this.token = axios.CancelToken.source();
  }

  mintNewToken = () => {
    this.token = axios.CancelToken.source();
  };

  cancelToken = () => {
    this.token.cancel();
    this.token = axios.CancelToken.source();
  };
}
