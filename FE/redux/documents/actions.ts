import { createAction } from 'redux-actions';
import { authHeader, toggleModalConfirmation } from '../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;

export const addUploadedFile: any = createAction('documents/ADD_UPLOADED_FILE');
export const removeUploadedFile: any = createAction('documents/REMOVE_UPLOADED_FILE');
