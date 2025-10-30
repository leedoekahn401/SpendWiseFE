export const BASE_URL = "http://127.0.0.1:8080/api";

export const API_PATH = {
    AUTH:{
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        CHANGE_PASSWORD: "/auth/change-pass",
        GET_INFO: "/auth/info/me",
        GET_INFOS: "/auth/info",
        UPDATE_PROFILE: "/auth/update-profile"
    },
    TRANSACTION:{
       CREATE: "/transaction/create",
       GET_TRANSACTION: "/transaction",
       GET_INCOME: "/transaction/income",
       GET_EXPENSE: "/transaction/expense",
       DOWNLOAD_EXCEL: "/transaction/download",
       GET_GROUP_TRANSACTION: "/transaction/group/"
    },
    GROUP:{
        CREATE: "/group/create",
        GET_MY_GROUPS: "/group/my",
        GET_GROUP: "/group/me/"
    },
    INVITE:{
        SEND_INVITE: "/group/send-invite",
        ACCEPT_INVITE: "/group/accept-invite",
        GET_INVITES: "/group/invites",
        DECLINE_INVITE: "/group/decline-invite",
        FIND_USERS: "/group/find"
    },
    DASHBOARD:{
        GET_DAILY_SUMMARY: "/dashboard/summary/daily",
        GET_ADD_UP_SUMMARY: "/dashboard/summary/add",
        GET_CATEGORY_SUMMARY: "/dashboard/summary/category",
        GET_DAILY_GROUP: "/dashboard/summary/daily/",
        GET_ADD_UP_GROUP: "/dashboard/summary/add/",
        GET_PROPORTION_GROUP: "/dashboard/summary/proportions/"
    },
    UPLOAD:{
        AVATAR: "/upload"
    },


}