export const HOST = process.env.NODE_ENV === "development" ? 'http://localhost:4000' : "";


export const LOGIN_WITH_GOOGLE = `${HOST}/google/auth/login`;

export const CREATE_USER = `${HOST}/app/create-user`
export const GET_USER = `${HOST}/app/getUser`;
export const CREATE_EVENT = `${HOST}/app/create-event`;
export const UPDATE_EVENT = `${HOST}/app/update-event`;
export const DELETE_EVENT = `${HOST}/app/delete-event`
export const ACCESS = `${HOST}/getAccess`
