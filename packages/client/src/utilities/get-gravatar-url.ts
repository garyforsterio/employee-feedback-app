import md5 from 'md5';

import { GRAVATAR_URL } from '../constants';

/**
 * Get public Gravatar URL
 * If user has defined a profile picture it will display. Alteratively a unique robohash
 */
function getGravatarUrl(email: string): string {
  return GRAVATAR_URL + md5(email) + '?d=robohash';
}

export default getGravatarUrl;
