import axios from "axios"

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:3001/Blog/v1/',
    timeout: 5000
})

export const getPosts = async () => {
  try {
    const response = await apiClient.get("/posts");
    return response.data; 
  } catch (e) {
    return { error: true, e };
  }
};

export const getPostById = async (id) => {
  try {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data; 
  } catch (e) {
    return { error: true, message: e.message };
  }
};

export const createPost = async (postData) => {

  try {
    const response = await apiClient.post("/posts", postData);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const updatePost = async (id, postData) => {
  try {
    const response = await apiClient.put(`/posts/${id}`, postData);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const deletePost = async (id) => {
  try {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};


export const createComment = async (commentData) => {
  try {
    const response = await apiClient.post("/comments", commentData);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const updateComment = async (id, commentData) => {
  try {
    const response = await apiClient.put(`/comments/${id}`, commentData);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await apiClient.delete(`/comments/${id}`);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await apiClient.get(`/post/${postId}`); 
    return response.data; 
  } catch (e) {
    return { error: true, e };
  }
};

export const getCourses = async () => {
  try {
    const response = await apiClient.get("/courses");
    return response.data; 
  } catch (e) {
    return { error: true, e };
  }
};

export const getPublicationById = async (id) => {
  try {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  } catch (e) {
    return { error: true, message: e.message };
  }
};


export default apiClient;
