import axios from 'axios';

export const getVideoByChannel = async (id: string, nextPage?: string) => {
  try {
    const newApi = process.env.GET_VIDEO_MY_CHANNEL.replace('{id}', id);
    const response = await axios.get(newApi + `${nextPage}`);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const getChannel = async (id: string) => {
  try {
    const response = await axios.get(process.env.GET_CHANNEL + id);

    return response.data;
  } catch (err) {
    console.log('getChannel-err');
    return null;
  }
};

export const getPlaylistChannel = async (id: string, nextPage?: string) => {
  try {
    const newApi = process.env.GET_PLAYLIST_CHANNEL.replace('{id}', id);
    const response = await axios.get(newApi + nextPage);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const getPlaylist = async (id: string, nextPage?: string) => {
  try {
    const newApi = process.env.GET_PLAYLIST.replace('{id}', id);
    const response = await axios.get(newApi + nextPage);
    return response.data;
  } catch (err) {
    console.log('getPlaylist-err');
    return null;
  }
};

export const getVideo = async (id: string) => {
  try {
    const response = await axios.get(process.env.GET_VIDEO + id);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const getVideoByIds = async (id: string) => {
  try {
    const newApi = process.env.GET_DETAIL_VIDEO.replace('{id}', id);
    const response = await axios.get(newApi);
    return response.data;
  } catch (err) {
    console.log('getVideoByIds-err');
    return null;
  }
};

export const getCommentByVideoId = async (id: string, nextPage?: string) => {
  try {
    const key = process.env.KEY;
    const commentApi = process.env.GET_COMMENT.replace('{id}', id).replace('{key}', key);
    const response = await axios.get(commentApi + nextPage);
    return response.data;
  } catch (err) {
    console.log('getCommentByVideoId-err');
    return null;
  }
};
