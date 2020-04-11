import md5 from 'md5';

import { GRAVATAR_URL } from '../constants';

function getGravatarUrl(email: string): string {
  return GRAVATAR_URL + md5(email) + '?d=robohash';
}

export default getGravatarUrl;
