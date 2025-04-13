import HTTP from '../http';

function uploadAvatar(file: File) {
  const data = new FormData();
  data.append('type', 'account-avatar');
  data.append('file', file);

  return HTTP.post('/file', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

function deleteAvatar() {
  return HTTP.delete('/file/avatar');
}

function uploadCover(file: File) {
  const data = new FormData();
  data.append('type', 'post-cover');
  data.append('file', file);

  return HTTP.post('/file', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default {
  uploadAvatar,
  deleteAvatar,
  uploadCover,
};
