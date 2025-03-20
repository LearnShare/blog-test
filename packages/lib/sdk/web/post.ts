import HTTP from '../../http';

import {
  PostData,
} from '@packages/database';

function create(data: PostData) {
  return HTTP.post('/post', data);
}

export default {
  create,
};
