import axios from "axios";
import { TokenSingleton } from "../../utils/tokenSingleTon";

// export let solHubToken = axios.CancelToken.source();

export const SolHubToken = new TokenSingleton();
