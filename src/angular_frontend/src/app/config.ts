/* GLOBAL CONFIG SETTINGS */
import { INgxMyDpOptions } from 'ngx-mydatepicker';

export const DELTA = 300;  // If the authentication token will expire in less than DELTA seconds it will be refreshed on the next request
export const DATE_OPTIONS: INgxMyDpOptions = {
  dateFormat: 'dd.mm.yyyy',
  sunHighlight: true
};
