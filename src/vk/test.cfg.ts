import { config } from 'dotenv';
import { Config } from './types';

config();

export const cfg: Config = {
    token: process.env.JEST_VK_TOKEN,
    groupId: +process.env.JEST_VK_GROUP_ID,
    apiVersion: '5.103',
};
